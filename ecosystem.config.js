module.exports = {
  apps: [
    {
      name: 'bolta-gurugram',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 2,            // Run 2 instances for zero-downtime reload
      exec_mode: 'cluster',    // Required for pm2 reload (zero-downtime)
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Auto-restart on crash
      autorestart: true,
      watch: false,
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,
      // Logging
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
