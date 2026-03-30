import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/Login";
import DashboardPage from "@/pages/Dashboard";
import TransfersPage from "@/pages/Transfers";

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/transfers" element={<TransfersPage />} />
            </Routes>
        </BrowserRouter>
    );
}
