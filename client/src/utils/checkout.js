import api from '../api/axios.js';

const redirectToLogin = (templateId, draft = null) => {
  localStorage.setItem('amulet_pending_template', templateId);
  if (draft) {
    localStorage.setItem('amulet_pending_draft', JSON.stringify(draft));
  } else {
    localStorage.removeItem('amulet_pending_draft');
  }
  localStorage.removeItem('userToken');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('amulet-auth-change'));
  window.location.assign('/login');
};

export const startStripeCheckout = async (templateId, draft = null) => {
  if (!localStorage.getItem('userToken')) {
    redirectToLogin(templateId, draft);
    return;
  }

  try {
    const { data } = await api.post('/payments/create-checkout-session', { templateId, draft });
    window.location.assign(data.url);
  } catch (error) {
    if (error.response?.status === 401) {
      redirectToLogin(templateId, draft);
      return;
    }

    throw error;
  }
};
