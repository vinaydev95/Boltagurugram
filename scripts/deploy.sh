#!/usr/bin/env bash
# Build an isolated, pinned release. The legacy directory remains Nginx's asset root.
set -euo pipefail
umask 077

fail() { printf '%s\n' "$*" >&2; exit 1; }

expected_sha=${1:?Pass the full commit SHA to deploy}
[[ "$expected_sha" =~ ^[0-9a-f]{40}$ ]] || fail 'A full commit SHA is required.'
release_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
releases_root=$(cd "${BOLTA_RELEASES_ROOT:-$HOME/bolta-gurugram-releases}" && pwd -P)
shared_root=$(cd "${BOLTA_SHARED_ROOT:-$HOME/bolta-gurugram}" && pwd -P)
case "$release_dir/" in
  "$releases_root/"*) ;;
  *) fail 'Refusing to build outside the releases directory.' ;;
esac
[[ "$release_dir" != "$shared_root" ]] || fail 'Refusing to build in the live directory.'
[[ "$(git -C "$release_dir" rev-parse HEAD)" == "$expected_sha" ]] || fail 'Release commit does not match the requested SHA.'
[[ -f "$shared_root/.env.local" ]] || fail 'The existing production environment file is missing.'

# Retain rollback releases; stop safely before dependency/build growth fills disk.
available_kb=$(df -Pk "$releases_root" | awk 'NR == 2 { print $4 }')
[[ "$available_kb" =~ ^[0-9]+$ ]] || fail 'Could not determine free disk space.'
(( available_kb >= 2 * 1024 * 1024 )) || fail 'At least 2 GiB of free disk is required before staging a build. The live release was not changed.'

export BOLTA_SHARED_ROOT="$shared_root"
check_dir="$release_dir/.deploy-check"
mkdir -p "$check_dir"
candidate_pid=''
cleanup() {
  if [[ -n "$candidate_pid" ]]; then
    kill "$candidate_pid" 2>/dev/null || true
    wait "$candidate_pid" 2>/dev/null || true
  fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

# Check a real homepage as well as database readiness; an empty HTTP 200 is a failure.
check_site() {
  local base=$1
  local validation_mode=${2:-strict}
  local article_path article_status
  if [[ "$validation_mode" != 'legacy' ]]; then
    curl --fail --silent --show-error --connect-timeout 2 --max-time 15 \
      "$base/api/health" -o "$check_dir/health.json" || return 1
    node -e 'if(JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8")).status!=="ready") process.exit(1)' \
      "$check_dir/health.json" || return 1
  fi
  curl --fail --silent --show-error --connect-timeout 2 --max-time 20 \
    "$base/" -o "$check_dir/home.html" || return 1
  article_path=$(node - "$check_dir/home.html" <<'NODE'
const html = require('node:fs').readFileSync(process.argv[2], 'utf8');
const link = html.match(/href=["'](\/article\/[^"']+)["']/);
if (/No Articles Yet|Articles will appear here once published/i.test(html) ||
    !link) {
  process.exit(1);
}
process.stdout.write(new URL(link[1], 'https://boltagurugram.com').pathname);
NODE
  ) || return 1
  article_status=$(curl --fail --silent --show-error --connect-timeout 2 --max-time 20 \
    --write-out '%{http_code}' "$base$article_path" -o "$check_dir/article.html") || return 1
  [[ "$article_status" == '200' ]] || return 1
  node - "$check_dir/article.html" "$article_path" "$validation_mode" <<'NODE'
const html = require('node:fs').readFileSync(process.argv[2], 'utf8');
const tag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
const canonical = tag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
const expected = new URL(process.argv[3], 'https://boltagurugram.com').href;
if (!html.includes('Reported by') ||
    (process.argv[4] !== 'legacy' && (!canonical || new URL(canonical).href !== expected))) {
  process.exit(1);
}
NODE
}

wait_for_site() {
  local base=$1
  local expected_pid=${2:-}
  local validation_mode=${3:-strict}
  local attempt
  for attempt in {1..15}; do
    if [[ -n "$expected_pid" ]] && ! kill -0 "$expected_pid" 2>/dev/null; then return 1; fi
    if check_site "$base" "$validation_mode" >"$check_dir/last-check.log" 2>&1; then return 0; fi
    sleep 2
  done
  return 1
}

install -m 600 "$shared_root/.env.local" "$release_dir/.env.local"
cd "$release_dir"
npm ci --include=dev --no-audit --no-fund
# Leave memory for the live process on the small EC2 instance; swap is still needed.
NODE_OPTIONS=--max-old-space-size=512 npm run build
[[ -s .next/BUILD_ID && -d .next/static ]] || fail 'The candidate build is incomplete.'

# Refuse an occupied check port, rather than accidentally testing another process.
node -e 'const s=require("node:net").createServer(); s.on("error",()=>process.exit(1)); s.listen(3003,"127.0.0.1",()=>s.close());' \
  || fail 'Candidate health-check port 3003 is already in use.'
node node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3003 \
  >"$check_dir/candidate.log" 2>&1 &
candidate_pid=$!
wait_for_site 'http://127.0.0.1:3003' "$candidate_pid" || fail 'Candidate failed readiness/content checks; the live process was not changed.'
kill -0 "$candidate_pid" 2>/dev/null || fail 'The candidate process exited during validation.'
cleanup
candidate_pid=''

# Extract only deployment state from PM2; never print its environment/configuration.
previous_state=$(pm2 jlist | node -e '
let data=""; process.stdin.on("data", x=>data+=x); process.stdin.on("end",()=>{
  const app=JSON.parse(data).find(x=>x.name==="bolta-gurugram");
  process.stdout.write(JSON.stringify({cwd:app?.pm2_env.pm_cwd || "", mode:app?.pm2_env.exec_mode || ""}));
});')
previous_cwd=$(node -e 'process.stdout.write(JSON.parse(process.argv[1]).cwd)' "$previous_state")
previous_mode=$(node -e 'process.stdout.write(JSON.parse(process.argv[1]).mode)' "$previous_state")

# Nginx aliases still point here. Merge assets, retaining old hashed chunks for
# requests already in flight. Never replace or remove the live .next directory.
mkdir -p "$shared_root/.next/static" "$shared_root/public" "$shared_root/logs"
cp -a "$release_dir/.next/static/." "$shared_root/.next/static/"
cp -a "$release_dir/public/." "$shared_root/public/"
# The release/env remain private; Nginx's www-data worker must read public assets.
chmod 755 "$shared_root/.next" "$shared_root/.next/static" "$shared_root/public"
find "$shared_root/.next/static" "$shared_root/public" -type d -exec chmod 755 {} +
find "$shared_root/.next/static" "$shared_root/public" -type f -exec chmod 644 {} +

rollback() {
  if [[ -n "$previous_cwd" && "$previous_cwd" != "$release_dir" && -f "$previous_cwd/ecosystem.config.js" ]]; then
    printf '%s\n' 'New release failed; restoring the previous PM2 release.' >&2
    (cd "$previous_cwd" && pm2 startOrReload "$previous_cwd/ecosystem.config.js" --only bolta-gurugram --update-env)
    # The original fork release predates /api/health and canonical fixes.
    local validation_mode='strict'
    if [[ "$previous_mode" == 'fork_mode' ]]; then validation_mode='legacy'; fi
    wait_for_site 'http://127.0.0.1:3002' '' "$validation_mode"
  else
    printf '%s\n' 'No previous PM2 release is available for automatic rollback.' >&2
    return 1
  fi
}

# Remove previous PM2 process definition so pm_cwd updates to the new release directory
pm2 delete bolta-gurugram 2>/dev/null || true
if ! pm2 start "$release_dir/ecosystem.config.js"; then
  rollback || true
  fail 'PM2 could not activate the candidate.'
fi
if ! pm2 jlist | node -e '
let data=""; process.stdin.on("data", x=>data+=x); process.stdin.on("end",()=>{
  const app=JSON.parse(data).find(x=>x.name==="bolta-gurugram");
  if(!app || app.pm2_env.pm_cwd!==process.argv[1] ||
     app.pm2_env.exec_mode!=="cluster_mode" || app.pm2_env.status!=="online") process.exit(1);
});' "$release_dir"; then
  rollback || true
  fail 'PM2 did not activate the expected release in cluster mode.'
fi
if ! wait_for_site 'http://127.0.0.1:3002'; then
  rollback || true
  fail 'The activated release failed live readiness/content checks.'
fi
pm2 save
# Keep only the 3 most recent releases to prevent disk fill
find "$releases_root" -mindepth 1 -maxdepth 1 -type d | sort -r | tail -n +4 | xargs -r rm -rf 2>/dev/null || true
printf 'Release %s is ready on port 3002.\n' "$expected_sha"
