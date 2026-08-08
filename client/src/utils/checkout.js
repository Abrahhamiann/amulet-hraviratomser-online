import api from '../api/axios.js';

const redirectToLogin = (templateId, draft = null, options = {}) => {
  localStorage.setItem('amulet_pending_template', templateId);
  if (draft) {
    localStorage.setItem('amulet_pending_draft', JSON.stringify(draft));
  } else {
    localStorage.removeItem('amulet_pending_draft');
  }
  localStorage.removeItem('amulet_pending_action');
  if (options.promoCode) localStorage.setItem('amulet_pending_promo', options.promoCode);
  else localStorage.removeItem('amulet_pending_promo');
  window.location.replace('/login');
};

export const startStripeCheckout = async (templateId, draft = null, options = {}) => {
  try {
    const { data } = await api.post('/payments/create-checkout-session', { templateId, draft, ...options });
    window.location.assign(data.url);
  } catch (error) {
    if (error.response?.status === 401) {
      redirectToLogin(templateId, draft, options);
      return;
    }

    throw error;
  }
};
