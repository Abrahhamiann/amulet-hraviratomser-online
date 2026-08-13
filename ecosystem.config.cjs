// PM2 process list for the production server.
// Usage (from the repo root):  pm2 start ecosystem.config.cjs && pm2 save
const path = require('path');

const ROOT = __dirname;
const VENV_PYTHON = path.join(ROOT, '.venv', 'bin', 'python');

module.exports = {
  apps: [
    {
      name: 'amulet-api',
      cwd: path.join(ROOT, 'server'),
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '500M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'amulet-admin',
      cwd: path.join(ROOT, 'admin'),
      // Nitro build output. Rebuild with: npm run build (inside admin/)
      script: '.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '500M',
      env: { NODE_ENV: 'production', HOST: '127.0.0.1', PORT: 3000 }
    },
    {
      name: 'amulet-bot',
      cwd: path.join(ROOT, 'telegram_bot'),
      script: 'bot.py',
      interpreter: VENV_PYTHON,
      instances: 1, // long polling: exactly one instance, never more
      exec_mode: 'fork',
      max_memory_restart: '300M',
      env: { PYTHONUNBUFFERED: '1' }
    }
  ]
};
