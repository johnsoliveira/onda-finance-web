import axios from "axios";
import type { DashboardData, Transaction, User } from "@/types";

type LoginPayload = {
    agencia: string;
    conta: string;
    senha: string;
};

type UpdateDashboardPayload = {
    agencia: string;
    conta: string;
    amount: number;
    transaction?: Transaction;
};

type CreateTransferPayload = {
    agencia: string;
    conta: string;
    amount: number;
    transaction: Transaction;
};

export const api = axios.create({
    baseURL: "/api",
});

export async function login(credentials: LoginPayload) {
    const response = await api.post<User>("/auth/login", credentials);
    return response.data;
}

export async function getDashboardData(agencia: string, conta: string) {
    const response = await api.get<DashboardData>("/dashboard", {
        params: { agencia, conta },
    });

    return response.data;
}

export async function updateDashboardBalance(payload: UpdateDashboardPayload) {
    const response = await api.patch<DashboardData>("/dashboard/balance", payload);
    return response.data;
}

export async function createTransfer(payload: CreateTransferPayload) {
    const response = await api.post<DashboardData>("/transfers", payload);
    return response.data;
}
