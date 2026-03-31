import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransfer } from "@/service/api";
import { useAuthStore } from "@/store/useAuthStore";
import type { DashboardData, Transaction } from "@/types";

type CreateTransferInput = {
    agencia: string;
    conta: string;
    amount: number;
    recipientAgencia: string;
    recipientConta: string;
    transaction: Transaction;
};

export function useCreateTransfer() {
    const queryClient = useQueryClient();
    const updateUserDashboardData = useAuthStore((state) => state.updateUserDashboardData);

    return useMutation({
        mutationFn: ({ agencia, conta, amount, recipientAgencia, recipientConta, transaction }: CreateTransferInput) =>
            createTransfer({ agencia, conta, amount, recipientAgencia, recipientConta, transaction }),
        onSuccess: (updatedDashboardData, variables) => {
            queryClient.setQueryData<DashboardData>(
                ["dashboard-data", variables.agencia, variables.conta],
                updatedDashboardData
            );
            updateUserDashboardData(updatedDashboardData);
        },
    });
}
