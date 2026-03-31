import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DashboardData, User } from "@/types";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    updateUserDashboardData: (dashboardData: DashboardData) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            updateUserDashboardData: (dashboardData) =>
                set((state) => ({
                    user: state.user
                        ? {
                            ...state.user,
                            dashboardData,
                        }
                        : null,
                })),
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: "onda-finance-auth",
        }
    )
);
