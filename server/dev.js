import { spawn } from 'node:child_process';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The local API must never inherit the production database and secrets.
const developmentEnv = path.join(__dirname, '.env.development');
if (!existsSync(developmentEnv)) {
  throw new Error('Create server/.env.development from server/.env.development.example before starting the local API');
}
dotenv.config({ path: developmentEnv, override: true });
process.env.AMULET_DEV_ENV = '1';
let mongoHost;
try {
  const mongoUrl = new URL(process.env.MONGO_URI);
  if (mongoUrl.protocol === 'mongodb:') mongoHost = mongoUrl.hostname;
} catch {
  // The local development URI must be a valid direct MongoDB URL.
}
if (!['localhost', '127.0.0.1', '[::1]'].includes(mongoHost)) {
  throw new Error('Local development requires a loopback MONGO_URI in server/.env.development');
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('Set a local JWT_SECRET of at least 32 characters in server/.env.development');
}

const port = process.env.PORT || 5000;

const runningServerMode = async () => {
  try {
    const response = await fetch(`http://localhost:${port}/api/health`, {
      signal: AbortSignal.timeout(1200)
    });
    const payload = await response.json();
    if (response.ok && payload?.status === 'ok' && payload.service === 'e-invite-server') {
      return payload.mode || 'unknown';
    }
    return 'unknown';
  } catch {
    return null;
  }
};

const mode = await runningServerMode();
if (mode === 'development') {
  console.log(`Amulet server is already running on port ${port}. Nothing else to start.`);
  process.exit(0);
}
if (mode) {
  throw new Error(`Port ${port} is occupied by a ${mode} API. Stop it before starting the local development server.`);
}

const nodemonPath = path.resolve(__dirname, '../node_modules/nodemon/bin/nodemon.js');
const child = spawn(process.execPath, [nodemonPath, 'server.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

const stopChild = (signal) => {
  if (!child.killed) child.kill(signal);
};

process.once('SIGINT', () => stopChild('SIGINT'));
process.once('SIGTERM', () => stopChild('SIGTERM'));
child.once('error', (error) => {
  console.error(`Failed to start the Amulet dev server: ${error.message}`);
  process.exitCode = 1;
});
child.once('exit', (code) => {
  process.exitCode = code ?? 0;
});
