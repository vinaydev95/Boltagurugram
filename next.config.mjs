/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep build workers bounded on the 2 GB production server.
  experimental: { cpus: 1 },
  // Redirects from www to non-www are handled via middleware with standard 301 status code
};

export default nextConfig;
