import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/service/api";
import type { DashboardData } from "@/types";

export function useDashboardData(agencia?: string, conta?: string) {
    return useQuery<DashboardData>({
        queryKey: ["dashboard-data", agencia, conta],
        queryFn: async () => {
            if (!agencia || !conta) {
                throw new Error("Credenciais do usuário indisponíveis.");
            }

            return getDashboardData(agencia, conta);
        },
        enabled: Boolean(agencia && conta),
        staleTime: 30_000,
    });
}
