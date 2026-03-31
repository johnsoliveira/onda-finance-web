import { AppSidebar } from "@/components/ui/app-sidebar"
import { useAuthStore } from "@/store/useAuthStore"
import { useTransferStore } from "@/store/useTransferStore"
import { ArrowLeftRight, BanknoteArrowDown, CircleHelp, LayoutGrid, LineChart, LogOut, Settings, Shield, UserRoundCheck } from "lucide-react"
import { Navigate, useNavigate } from "react-router-dom"
import TransferValuePage from "./transfer-value-page"
import TransferRecipientPage from "./transfer-recipient-page"
import TransferReceiptPage from "./transfer-receipt-page"

export default function TransfersPage() {
    const navigate = useNavigate()
    const { user, logout, hasHydrated } = useAuthStore()
    const { step, resetTransfer } = useTransferStore();

    if (!hasHydrated) {
        return null
    }

    if (!user) {
        return <Navigate to="/" replace />
    }

    function handleLogout() {
        logout()
        navigate("/", { replace: true })
    }

    function handleGoDashboard() {
        navigate("/dashboard")
    }

    const isReceipt = step === "confirmation"

    const navItems = isReceipt
        ? [
            { icon: LayoutGrid, label: "Dashboard", onClick: handleGoDashboard },
            { icon: ArrowLeftRight, label: "Transfers", active: true },
            { icon: LineChart, label: "Investments" },
            { icon: Settings, label: "Settings" },
        ]
        : [
            { icon: BanknoteArrowDown, label: "Valor", active: step === "value" },
            { icon: UserRoundCheck, label: "Destinatário", active: step === "recipient" },
            { icon: Shield, label: "Confirmação", active: false },
        ]

    return (
        <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
            <div className="grid min-h-screen grid-cols-[260px_1fr]">
                <AppSidebar
                    variant="workflow"
                    brandTitle="Onda Finance"
                    brandSubtitle={isReceipt ? "Premium Account" : "Institutional Flow"}
                    navItems={navItems}
                    cta={
                        isReceipt
                            ? {
                                icon: ArrowLeftRight,
                                label: "Nova transferência",
                                onClick: () => {
                                    resetTransfer()
                                    navigate("/transfers")
                                },
                            }
                            : undefined
                    }
                    bottomActions={[
                        { icon: CircleHelp, label: "Suporte" },
                        { icon: LogOut, label: "Sair", onClick: handleLogout },
                    ]}
                />
                <div className="flex min-h-screen flex-col">
                    {step === "value" && <TransferValuePage />}
                    {step === "recipient" && <TransferRecipientPage />}
                    {step === "confirmation" && <TransferReceiptPage />}
                </div>
            </div>
        </div>
    )
}
