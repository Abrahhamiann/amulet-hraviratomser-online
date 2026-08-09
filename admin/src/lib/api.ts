function resolveApiBaseURL() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) {
    try {
      const apiUrl = new URL(configuredUrl);
      const pageHost = typeof window !== "undefined" ? window.location.hostname : "";
      const isLoopbackApi = ["localhost", "127.0.0.1", "::1"].includes(apiUrl.hostname);
      if (isLoopbackApi && pageHost) {
        apiUrl.hostname = pageHost;
        return apiUrl.toString().replace(/\/$/, "");
      }
    } catch {
      return configuredUrl.replace(/\/$/, "");
    }

    return configuredUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }

  return "http://127.0.0.1:5000/api";
}

const API_BASE_URL = resolveApiBaseURL();
const LEGACY_TOKEN_KEYS = ["amulet_admin_token", "token", "userToken"];

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin" | "user";
};

export const currency = (value: number) =>
  new Intl.NumberFormat("hy-AM", {
    style: "currency",
    currency: "AMD",
    maximumFractionDigits: 0,
  }).format(value || 0);

export function clearToken() {
  if (typeof window === "undefined") return;
  LEGACY_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
  LEGACY_TOKEN_KEYS.forEach((key) => sessionStorage.removeItem(key));
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data as T;
}

export async function login(email: string, password: string) {
  clearToken();
  const data = await request<{ success: boolean; user: AdminUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!["admin", "super_admin"].includes(data.user.role)) {
    await request("/auth/logout", { method: "POST" }).catch(() => undefined);
    throw new Error("Admin access required");
  }

  return data;
}

export async function logout() {
  try {
    await request<{ success: boolean }>("/auth/logout", { method: "POST" });
  } finally {
    clearToken();
  }
}

export const adminApi = {
  me: () => request<AdminUser>("/auth/me"),
  dashboard: (period = "all") =>
    request<any>(`/admin/dashboard?period=${encodeURIComponent(period)}`),
  orders: () => request<any[]>("/admin/orders"),
  templates: () => request<any[]>("/admin/templates"),
  invitations: () => request<any[]>("/admin/invitations"),
  customers: () => request<any[]>("/admin/customers"),
  customer: (id: string) => request<any>(`/admin/customers/${id}`),
  payments: () => request<any[]>("/admin/payments"),
  messages: () => request<any[]>("/admin/messages"),
  administrators: () => request<any[]>("/admin/administrators"),
  notifications: () => request<any[]>("/admin/notifications"),
  faq: () => request<any>("/admin/faq"),
  promocodes: () => request<any[]>("/admin/promocodes"),
  reviews: () => request<any[]>("/admin/reviews"),
  createTemplate: (data: any) =>
    request<any>("/admin/templates", { method: "POST", body: JSON.stringify(data) }),
  updateTemplate: (id: string, data: any) =>
    request<any>(`/admin/templates/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTemplate: (id: string) => request<any>(`/admin/templates/${id}`, { method: "DELETE" }),
  deleteOrder: (id: string) => request<any>(`/admin/orders/${id}`, { method: "DELETE" }),
  deleteAllOrders: () => request<any>("/admin/orders", { method: "DELETE" }),
  createInvitation: (data: any) =>
    request<any>("/admin/invitations", { method: "POST", body: JSON.stringify(data) }),
  updateInvitation: (id: string, data: any) =>
    request<any>(`/admin/invitations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteInvitation: (id: string) => request<any>(`/admin/invitations/${id}`, { method: "DELETE" }),
  deleteMessage: (id: string) => request<any>(`/admin/messages/${id}`, { method: "DELETE" }),
  replyMessage: (id: string, data: any) =>
    request<any>(`/admin/messages/${id}/reply`, { method: "POST", body: JSON.stringify(data) }),
  createUser: (data: any) =>
    request<any>("/admin/users", { method: "POST", body: JSON.stringify(data) }),
  updateUserRole: (id: string, role: string) =>
    request<any>(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
  deleteUser: (id: string) => request<any>(`/admin/users/${id}`, { method: "DELETE" }),
  sendCustomerEmail: (id: string, data: any) =>
    request<any>(`/admin/customers/${id}/email`, { method: "POST", body: JSON.stringify(data) }),
  broadcastEmail: (data: any) =>
    request<any>("/admin/broadcast", { method: "POST", body: JSON.stringify(data) }),
  updateFaq: (data: any) =>
    request<any>("/admin/faq", { method: "PUT", body: JSON.stringify(data) }),
  createPromoCode: (data: any) =>
    request<any>("/admin/promocodes", { method: "POST", body: JSON.stringify(data) }),
  updatePromoCode: (id: string, data: any) =>
    request<any>(`/admin/promocodes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePromoCode: (id: string) => request<any>(`/admin/promocodes/${id}`, { method: "DELETE" }),
  createReview: (data: any) =>
    request<any>("/admin/reviews", { method: "POST", body: JSON.stringify(data) }),
  updateReview: (id: string, data: any) =>
    request<any>(`/admin/reviews/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteReview: (id: string) => request<any>(`/admin/reviews/${id}`, { method: "DELETE" }),
};
