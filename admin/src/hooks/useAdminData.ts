import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";

export function useAdminData<T>(key: unknown, fetcher: () => Promise<T>, fallback: T, staleTime = 0) {
  const query = useQuery({
    queryKey: ["admin", key],
    queryFn: fetcher,
    retry: false,
    staleTime,
  });

  return {
    ...query,
    data: query.data ?? fallback,
  };
}

export const useDashboard = (period = "all") => useAdminData(["dashboard", period], () => adminApi.dashboard(period), null);
export const useOrders = () => useAdminData("orders", adminApi.orders, []);
export const useTemplates = (search = "") => {
  const query = useInfiniteQuery({
    queryKey: ["admin", "templates", search],
    initialPageParam: "",
    queryFn: ({ pageParam }) => adminApi.templates({ cursor: String(pageParam || ""), search }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    retry: false,
    staleTime: 60_000,
  });
  return {
    ...query,
    data: query.data?.pages.flatMap((page) => page.items) || [],
  };
};
export const useCustomers = () => useAdminData("customers", adminApi.customers, []);
export const usePayments = () => useAdminData("payments", adminApi.payments, []);
export const useMessages = () => useAdminData("messages", adminApi.messages, []);
export const useAdministrators = () => useAdminData("administrators", adminApi.administrators, []);
const EMPTY_FAQ = { items: [] };
export const useFaq = () => useAdminData("faq", adminApi.faq, EMPTY_FAQ);
export const useReviews = () => useAdminData("reviews", adminApi.reviews, []);
