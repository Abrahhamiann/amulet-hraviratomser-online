const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export class AmuletApiError extends Error {
  constructor(message, { status = 0, uncertain = false } = {}) {
    super(message);
    this.name = 'AmuletApiError';
    this.status = status;
    this.uncertain = uncertain;
  }
}

export class AmuletApi {
  constructor(baseUrl, secret) {
    this.baseUrl = baseUrl;
    this.secret = secret;
  }

  async request(method, path, { query, body, attempts = 3 } = {}) {
    const url = new URL(`${this.baseUrl}${path}`);
    Object.entries(query || {}).forEach(([key, value]) => url.searchParams.set(key, String(value)));

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        const response = await fetch(url, {
          method,
          redirect: 'error',
          headers: {
            'Content-Type': 'application/json',
            'X-Telegram-Bot-Secret': this.secret
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: AbortSignal.timeout(10_000)
        });
        const data = await response.json().catch(() => null);
        if (response.ok) return data;

        const error = new AmuletApiError(
          data?.message || `Amulet API returned HTTP ${response.status}`,
          { status: response.status }
        );
        if (response.status < 500 || attempt === attempts) throw error;
      } catch (error) {
        if (error instanceof AmuletApiError && (error.status < 500 || attempt === attempts)) throw error;
        if (attempt === attempts) {
          throw new AmuletApiError(error.message || 'Amulet API is unreachable', {
            uncertain: method !== 'GET'
          });
        }
      }
      await wait(350 * (2 ** (attempt - 1)));
    }
    throw new AmuletApiError('Amulet API is unreachable');
  }

  connect(payload) { return this.request('POST', '/connect', { body: payload }); }
  heartbeat(body = {}) { return this.request('POST', '/heartbeat', { body, attempts: 1 }); }
  account(chatId) { return this.request('GET', '/account', { query: { chatId } }); }
  creator(chatId, page = 0) { return this.request('GET', '/creator', { query: { chatId, page } }); }
  creatorPurchase(chatId, paymentId) { return this.request('GET', `/creator/purchases/${paymentId}`, { query: { chatId } }); }
  invitation(chatId, invitationId) {
    return this.request('GET', `/invitations/${invitationId}`, { query: { chatId } });
  }
  settings(chatId, settings) { return this.request('PATCH', '/settings', { body: { chatId, ...settings } }); }
  disconnect(chatId) { return this.request('DELETE', '/disconnect', { body: { chatId } }); }
  adminDashboard(chatId) { return this.request('GET', '/admin/dashboard', { query: { chatId } }); }
  adminCreators(chatId, page = 0) { return this.request('GET', '/admin/creators', { query: { chatId, page } }); }
  adminCreator(chatId, id, page = 0) { return this.request('GET', `/admin/creators/${id}`, { query: { chatId, page } }); }
  adminCreatorPurchase(chatId, id) { return this.request('GET', `/admin/creator-purchases/${id}`, { query: { chatId } }); }
  adminOrders(chatId, page = 0) { return this.request('GET', '/admin/orders', { query: { chatId, page } }); }
  adminOrder(chatId, orderId) { return this.request('GET', `/admin/orders/${orderId}`, { query: { chatId } }); }
  adminMessages(chatId, page = 0) { return this.request('GET', '/admin/messages', { query: { chatId, page } }); }
  adminMessage(chatId, messageId) { return this.request('GET', `/admin/messages/${messageId}`, { query: { chatId } }); }
  deleteAdminMessages(chatId) { return this.request('DELETE', '/admin/messages', { body: { chatId } }); }
  replyAdminMessage(chatId, messageId, message) {
    return this.request('POST', `/admin/messages/${messageId}/reply`, { body: { chatId, message } });
  }
}

