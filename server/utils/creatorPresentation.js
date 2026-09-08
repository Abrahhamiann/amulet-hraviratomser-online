export const creatorLinkButtons = (url) => {
  if (!url) return [];
  let parsed;
  try { parsed = new URL(url); } catch { return []; }
  if (!['http:', 'https:'].includes(parsed.protocol)) return [];
  const rows = [];
  if (!['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname) && !parsed.hostname.endsWith('.local')) {
    rows.push([{ text: '🔗 Դիտել հրավերը', url }]);
  }
  if (url.length <= 256) rows.push([{ text: '📋 Պատճենել հղումը', copy_text: { text: url } }]);
  return rows;
};

export const creatorDashboardButton = [{ text: '📊 Creator dashboard', callback_data: 'creator:page:0' }];
