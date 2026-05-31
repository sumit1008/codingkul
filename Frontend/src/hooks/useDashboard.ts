import { useQuery } from "@tanstack/react-query";
import { dashboardApi, type DashboardData } from "@/lib/api";

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.get,
    staleTime: 60_000,
    retry: 1,
  });
}
