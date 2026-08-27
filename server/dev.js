import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const port = process.env.PORT || 5000;

const amuletServerIsRunning = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`, {
      signal: AbortSignal.timeout(1200)
    });
    const payload = await response.json();
    return response.ok && payload?.status === 'ok'
      && (!payload.service || payload.service === 'e-invite-server');
  } catch {
    return false;
  }
};

if (await amuletServerIsRunning()) {
  console.log(`Amulet server is already running on port ${port}. Nothing else to start.`);
  process.exit(0);
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
