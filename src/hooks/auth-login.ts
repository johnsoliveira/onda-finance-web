import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "@/service/api";
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
        mutationFn: login,
        onSuccess: (user) => {
            setUser(user);
            navigate("/dashboard");
        },
    });
}
