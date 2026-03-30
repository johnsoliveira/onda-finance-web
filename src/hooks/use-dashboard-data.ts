import { useQuery } from "@tanstack/react-query";
import { getMockDashboardData } from "@/data/mockUsers";
import type { DashboardData } from "@/types";

export function useDashboardData(agencia?: string, conta?: string) {
    return useQuery<DashboardData>({
        queryKey: ["dashboard-data", agencia, conta],
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));

            if (!agencia || !conta) {
                throw new Error("Credenciais do usuário indisponíveis.");
            }

            return getMockDashboardData(agencia, conta);
        },
        enabled: Boolean(agencia && conta),
        staleTime: 30_000,
    });
}
