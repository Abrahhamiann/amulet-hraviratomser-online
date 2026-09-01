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

export const startPayment = async (templateId, draft = null, options = {}) => {
  try {
    const { data } = await api.post('/payments/arca/create', { templateId, draft, ...options });
    const paymentUrl = data.paymentUrl || data.url;
    if (!paymentUrl) throw new Error('Payment URL was not returned');
    window.location.assign(paymentUrl);
  } catch (error) {
    if (error.response?.status === 401) {
      redirectToLogin(templateId, draft, options);
      return;
    }

    throw error;
  }
};
