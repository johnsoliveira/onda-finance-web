import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { findMockUser } from "@/data/mockUsers";
import { useAuthStore } from "@/store/useAuthStore";
import type { User } from "@/types";

interface LoginCredentials {
    agencia: string;
    conta: string;
    senha: string;
}

export function useAuthLogin() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation<User, Error, LoginCredentials>({
        mutationFn: async (credentials: LoginCredentials) => {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const user = findMockUser(credentials.agencia, credentials.conta);

            if (!user || user.senha !== credentials.senha) {
                throw new Error("Agência, conta ou senha incorretos.");
            }

            return user;
        },
        onSuccess: (user) => {
            setUser(user);
            navigate("/dashboard");
        },
    });
}
