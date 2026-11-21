const path = require('node:path');

const sharedRoot = process.env.BOLTA_SHARED_ROOT || '/home/ubuntu/bolta-gurugram';

module.exports = {
  apps: [
    {
      name: 'bolta-gurugram',
      cwd: __dirname,
      script: path.join(__dirname, 'node_modules/next/dist/bin/next'),
      args: 'start -p 3002',
      instances: 1,
      exec_mode: 'cluster',
      listen_timeout: 45000,
      kill_timeout: 10000,
      max_memory_restart: '600M',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      error_file: path.join(sharedRoot, 'logs/error.log'),
      out_file: path.join(sharedRoot, 'logs/out.log'),
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
