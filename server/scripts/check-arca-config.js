import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { arcaConfigurationStatus, getArcaConfig } = await import('../config/arca.js');
const status = arcaConfigurationStatus();

if (!status.configured) {
  console.error(`ArCa configuration is incomplete. Missing: ${status.missing.join(', ')}`);
  process.exitCode = 1;
} else {
  try {
    const config = getArcaConfig();
    console.log(JSON.stringify({
      provider: config.provider,
      configured: true,
      baseHost: new URL(config.baseUrl).host,
      currency: config.currency,
      language: config.language,
      statusEndpoint: config.statusEndpoint,
      timeoutMs: config.timeoutMs,
      amountMultiplier: config.amountMultiplier,
      frontendHost: new URL(config.frontendUrl).host,
      backendHost: config.backendUrl ? new URL(config.backendUrl).host : '',
      hasApiUsername: Boolean(config.username),
      hasPassword: Boolean(config.password)
    }, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

