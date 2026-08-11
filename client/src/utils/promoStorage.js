const promoUserKey = (user) => user?._id || user?.id || user?.email || '';

export const promoStorageKey = (user, templateId) => {
  const userKey = promoUserKey(user);
  return userKey && templateId ? `amulet_confirmed_promo_${userKey}_${templateId}` : '';
};

export const readRememberedPromo = (key) => {
  if (!key) return null;
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return value?.code ? value : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const clearPurchasedPromo = (user, templateId) => {
  const key = promoStorageKey(user, templateId);
  if (key) localStorage.removeItem(key);
  localStorage.removeItem('amulet_pending_promo');
};
