const MARKDOWN_LINK = /^\s*\[[^\]]*\]\(\s*(https?:\/\/[^\s)]+)(?:\s+["'][^"']*["'])?\s*\)\s*$/i;

export const normalizeMapUrl = (value) => {
  const input = String(value || '').trim();
  if (!input) return '';

  const markdownMatch = input.match(MARKDOWN_LINK);
  const candidate = (markdownMatch?.[1] || input).replace(/^<|>$/g, '').trim();

  try {
    const url = new URL(candidate);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};
