const wait = (milliseconds, signal) => new Promise((resolve, reject) => {
  const timeout = setTimeout(resolve, milliseconds);
  signal?.addEventListener('abort', () => {
    clearTimeout(timeout);
    reject(signal.reason || new Error('Aborted'));
  }, { once: true });
});

export class TelegramApiError extends Error {
  constructor(message, { status = 0, code = 0, retryAfter = 0 } = {}) {
    super(message);
    this.name = 'TelegramApiError';
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export class TelegramClient {
  constructor(token) {
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  async call(method, payload = {}, { attempts = 3, timeoutMs = 15_000, signal } = {}) {
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      const timeoutController = new AbortController();
      const timeout = setTimeout(
        () => timeoutController.abort(new Error(`Telegram ${method} timed out`)),
        timeoutMs
      );
      const abort = () => timeoutController.abort(signal.reason || new Error('Aborted'));
      signal?.addEventListener('abort', abort, { once: true });

      try {
        const response = await fetch(`${this.baseUrl}/${method}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: timeoutController.signal
        });
        const data = await response.json().catch(() => null);
        if (response.ok && data?.ok) return data.result;

        const error = new TelegramApiError(
          data?.description || `Telegram ${method} failed with HTTP ${response.status}`,
          {
            status: response.status,
            code: data?.error_code || 0,
            retryAfter: Number(data?.parameters?.retry_after) || 0
          }
        );
        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable || attempt === attempts) throw error;
        await wait(error.retryAfter ? error.retryAfter * 1000 : 500 * (2 ** (attempt - 1)), signal);
      } catch (error) {
        if (signal?.aborted) throw signal.reason || error;
        if (attempt === attempts || (error instanceof TelegramApiError && error.status < 500 && error.status !== 429)) {
          throw error;
        }
        await wait(500 * (2 ** (attempt - 1)), signal);
      } finally {
        clearTimeout(timeout);
        signal?.removeEventListener('abort', abort);
      }
    }
    throw new TelegramApiError(`Telegram ${method} failed`);
  }
}

