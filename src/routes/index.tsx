import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "@/pages/Login";

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    );
}