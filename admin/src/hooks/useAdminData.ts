import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";

export function useAdminData<T>(key: unknown, fetcher: () => Promise<T>, fallback: T) {
  const query = useQuery({
    queryKey: ["admin", key],
    queryFn: fetcher,
    retry: false,
  });

  return {
    ...query,
    data: query.data ?? fallback,
  };
}

export const useDashboard = (period = "all") => useAdminData(["dashboard", period], () => adminApi.dashboard(period), null);
export const useOrders = () => useAdminData("orders", adminApi.orders, []);
export const useTemplates = () => useAdminData("templates", adminApi.templates, []);
export const useInvitations = () => useAdminData("invitations", adminApi.invitations, []);
export const useCustomers = () => useAdminData("customers", adminApi.customers, []);
export const usePayments = () => useAdminData("payments", adminApi.payments, []);
export const useMessages = () => useAdminData("messages", adminApi.messages, []);
export const useCategories = () => useAdminData("categories", adminApi.categories, []);
export const useLanguages = () => useAdminData("languages", adminApi.languages, []);
export const useAdministrators = () => useAdminData("administrators", adminApi.administrators, []);
export const useNotifications = () => useAdminData("notifications", adminApi.notifications, []);
export const useFaq = () => useAdminData("faq", adminApi.faq, { items: [] });
export const useReviews = () => useAdminData("reviews", adminApi.reviews, []);
export const useSettings = () => useAdminData("settings", adminApi.settings, null);
