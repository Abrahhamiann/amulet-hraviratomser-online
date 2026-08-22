import { API_URL as API_BASE_URL } from "./env";

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

type RequestOptions = RequestInit & { timeoutMs?: number };

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 30_000, ...requestOptions } = options;
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers,
      credentials: "include",
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) throw new Error("Request timed out");
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }

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
  resetRevenue: () => request<any>("/admin/dashboard/reset-revenue", { method: "POST" }),
  orders: () => request<any[]>("/admin/orders"),
  templates: () => request<any[]>("/admin/templates"),
  customers: () => request<any[]>("/admin/customers"),
  customer: (id: string) => request<any>(`/admin/customers/${id}`),
  payments: () => request<any[]>("/admin/payments"),
  messages: () => request<any[]>("/admin/messages"),
  administrators: () => request<any[]>("/admin/administrators"),
  faq: () => request<any>("/admin/faq"),
  promocodes: () => request<any[]>("/admin/promocodes"),
  reviews: () => request<any[]>("/admin/reviews"),
  createTemplate: (data: any) =>
    request<any>("/admin/templates", { method: "POST", body: JSON.stringify(data) }),
  updateTemplate: (id: string, data: any) =>
    request<any>(`/admin/templates/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTemplate: (id: string) => request<any>(`/admin/templates/${id}`, { method: "DELETE" }),
  restoreTemplate: (id: string) => request<any>(`/admin/templates/${id}/restore`, { method: "POST" }),
  deleteOrder: (id: string) => request<any>(`/admin/orders/${id}`, { method: "DELETE" }),
  deleteAllOrders: () => request<any>("/admin/orders", { method: "DELETE" }),
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
    request<any>("/admin/broadcast", { method: "POST", body: JSON.stringify(data), timeoutMs: 35_000 }),
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
