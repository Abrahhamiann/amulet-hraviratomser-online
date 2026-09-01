// PM2 process list for the production server.
// Usage (from the repo root):  pm2 start ecosystem.config.cjs && pm2 save
const path = require('path');

const ROOT = __dirname;

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
      cwd: path.join(ROOT, 'server'),
      script: 'telegram-bot/bot.js',
      instances: 1, // long polling: exactly one instance, never more
      exec_mode: 'fork',
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    }
  ]
};
