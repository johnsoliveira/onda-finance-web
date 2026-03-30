import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMockDashboardData } from "@/data/mockUsers";
import type { DashboardData, Transaction } from "@/types";

type UpdateBalanceInput = {
    agencia: string;
    conta: string;
    amount: number;
    transaction?: Transaction;
};

export function useUpdateDashboardBalance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ agencia, conta, amount, transaction }: UpdateBalanceInput) => {
            await new Promise((resolve) => setTimeout(resolve, 250));

            return updateMockDashboardData(agencia, conta, (current) => ({
                ...current,
                totalBalance: current.totalBalance + amount,
                liquidity: current.liquidity + amount,
                transactions: transaction
                    ? [transaction, ...current.transactions]
                    : current.transactions,
            }));
        },
        onSuccess: (updatedDashboardData, variables) => {
            queryClient.setQueryData<DashboardData>(
                ["dashboard-data", variables.agencia, variables.conta],
                updatedDashboardData
            );
        },
    });
}
