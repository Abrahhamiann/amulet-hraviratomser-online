function resolveApiBaseURL() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) {
    try {
      const apiUrl = new URL(configuredUrl);
      const pageHost = typeof window !== "undefined" ? window.location.hostname : "";
      const isLoopbackApi = ["localhost", "127.0.0.1", "::1"].includes(apiUrl.hostname);
      const isLoopbackPage = ["localhost", "127.0.0.1", "::1"].includes(pageHost);

      if (isLoopbackApi && pageHost && !isLoopbackPage) {
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
const TOKEN_KEY = "amulet_admin_token";

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

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data as T;
}

export async function login(email: string, password: string) {
  const data = await request<{ token: string; user: AdminUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!["admin", "super_admin"].includes(data.user.role)) {
    throw new Error("Admin access required");
  }

  setToken(data.token);
  return data;
}

export const adminApi = {
  me: () => request<AdminUser>("/auth/me"),
  dashboard: (period = "all") => request<any>(`/admin/dashboard?period=${encodeURIComponent(period)}`),
  orders: () => request<any[]>("/admin/orders"),
  templates: () => request<any[]>("/admin/templates"),
  invitations: () => request<any[]>("/admin/invitations"),
  customers: () => request<any[]>("/admin/customers"),
  customer: (id: string) => request<any>(`/admin/customers/${id}`),
  payments: () => request<any[]>("/admin/payments"),
  messages: () => request<any[]>("/admin/messages"),
  categories: () => request<any[]>("/admin/categories"),
  languages: () => request<any[]>("/admin/languages"),
  administrators: () => request<any[]>("/admin/administrators"),
  notifications: () => request<any[]>("/admin/notifications"),
  reviews: () => request<any[]>("/admin/reviews"),
  settings: () => request<any>("/admin/settings"),
  createTemplate: (data: any) => request<any>("/admin/templates", { method: "POST", body: JSON.stringify(data) }),
  updateTemplate: (id: string, data: any) => request<any>(`/admin/templates/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTemplate: (id: string) => request<any>(`/admin/templates/${id}`, { method: "DELETE" }),
  updateOrderStatus: (id: string, status: string) =>
    request<any>(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteOrder: (id: string) => request<any>(`/admin/orders/${id}`, { method: "DELETE" }),
  deleteAllOrders: () => request<any>("/admin/orders", { method: "DELETE" }),
  createInvitation: (data: any) => request<any>("/admin/invitations", { method: "POST", body: JSON.stringify(data) }),
  updateInvitation: (id: string, data: any) => request<any>(`/admin/invitations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteInvitation: (id: string) => request<any>(`/admin/invitations/${id}`, { method: "DELETE" }),
  deleteMessage: (id: string) => request<any>(`/admin/messages/${id}`, { method: "DELETE" }),
  replyMessage: (id: string, data: any) => request<any>(`/admin/messages/${id}/reply`, { method: "POST", body: JSON.stringify(data) }),
  createUser: (data: any) => request<any>("/admin/users", { method: "POST", body: JSON.stringify(data) }),
  updateUserRole: (id: string, role: string) =>
    request<any>(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
  deleteUser: (id: string) => request<any>(`/admin/users/${id}`, { method: "DELETE" }),
  sendCustomerEmail: (id: string, data: any) => request<any>(`/admin/customers/${id}/email`, { method: "POST", body: JSON.stringify(data) }),
  broadcastEmail: (data: any) => request<any>("/admin/broadcast", { method: "POST", body: JSON.stringify(data) }),
  createReview: (data: any) => request<any>("/admin/reviews", { method: "POST", body: JSON.stringify(data) }),
  updateReview: (id: string, data: any) => request<any>(`/admin/reviews/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteReview: (id: string) => request<any>(`/admin/reviews/${id}`, { method: "DELETE" }),
  updateSettings: (data: any) => request<any>("/admin/settings", { method: "PUT", body: JSON.stringify(data) }),
};
