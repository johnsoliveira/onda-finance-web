import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftRight, Bell, CreditCard, HelpCircle, InfoIcon, Landmark, LayoutGrid, LineChart, LogOut, PiggyBank, Play, QrCode, Receipt, Search, Settings, TrendingUp } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { formatCurrency, formatUSD } from "@/utils/mask";
import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, useNavigate } from "react-router-dom";
import { ActivityTable } from "@/components/ui/activity-table";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useUpdateDashboardBalance } from "@/hooks/use-update-dashboard-balance";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user, logout, hasHydrated } = useAuthStore();

    if (!hasHydrated) {
        return null;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const currentUser = user;

    function handleLogout() {
        logout();
        navigate("/", { replace: true });
    }

    function handleGoToTransfers() {
        navigate("/transfers");
    }

    const { data: dashboardData, isLoading } = useDashboardData(currentUser.agencia, currentUser.conta);
    const updateBalanceMutation = useUpdateDashboardBalance();
    const currentDashboardData = dashboardData ?? user.dashboardData;

    const navItems = [
        { icon: LayoutGrid, label: "Dashboard", active: true },
        { icon: CreditCard, label: "Contas" },
        { icon: ArrowLeftRight, label: "Transações", onClick: handleGoToTransfers },
        { icon: LineChart, label: "Investimentos" },
        { icon: Settings, label: "Configurações" },
    ]

    const actions = [
        { icon: Play, label: "Transferência" },
        { icon: Receipt, label: "Pagar" },
        { icon: QrCode, label: "Pix" },
        { icon: Landmark, label: "Depósito" },
    ]

    const data = currentDashboardData.transactions.map((transaction) => ({
        id: transaction.id,
        date: transaction.date,
        description: transaction.description,
        sub: `ID: #${transaction.id}`,
        category: transaction.category,
        status: transaction.status,
        amount: `${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}`,
        positive: transaction.type === "income" ? true : false,
    }))

    function handleQuickDeposit() {
        const amount = 1000;
        const transactionId = `TX-${Date.now()}`;

        updateBalanceMutation.mutate({
            agencia: currentUser.agencia,
            conta: currentUser.conta,
            amount,
            transaction: {
                id: transactionId,
                date: new Intl.DateTimeFormat("pt-BR").format(new Date()),
                description: "Depósito instantâneo",
                category: "DEPOSIT",
                status: "Completed",
                amount,
                type: "income",
            },
        });
    }


    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="grid min-h-screen grid-cols-[260px_1fr]">
                <AppSidebar
                    brandTitle="Onda"
                    brandSubtitle="Finance"
                    navItems={navItems}
                    cta={{
                        icon: ArrowLeftRight,
                        label: "Nova transferência",
                        onClick: handleGoToTransfers,
                    }}
                    bottomActions={[
                        { icon: HelpCircle, label: "Suporte" },
                        { icon: LogOut, label: "Sair", onClick: handleLogout },
                    ]}
                />
                <div className="flex flex-col">
                    <header className="flex h-20 items-center justify-between border-b bg-white px-6">
                        <div className="flex items-center gap-6">
                            <div className="relative w-[320px]">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Buscar..."
                                    className="h-11 border-slate-200 bg-slate-100 pl-9 shadow-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <Bell className="h-5 w-5 text-slate-500" />
                            <HelpCircle className="h-5 w-5 text-slate-500" />
                            <Separator orientation="vertical" className="h-8" />
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-sm font-semibold">{currentUser.name}</div>
                                    <div className="text-xs text-amber-500">{currentUser.role}</div>
                                </div>
                                <Avatar className="h-10 w-10 rounded-xl bg-red-700">
                                    <AvatarFallback className="rounded-xl bg-red-800 text-white">
                                        {currentUser.name.split(' ').map(n => n[0]).join('')}
                                        .                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 p-6">
                        <div className="space-y-6">
                            <div className="grid gap-6 xl:grid-cols-[1.8fr_0.8fr]">
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
                                            <div>
                                                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                    Saldo Total
                                                </div>
                                                <div className="flex items-end gap-3">
                                                    <div className="text-5xl font-semibold tracking-tight">
                                                        {formatCurrency(currentDashboardData.totalBalance)}
                                                    </div>
                                                    <Badge className="rounded-md bg-emerald-100 text-emerald-600 hover:bg-emerald-100">
                                                        +2.4%
                                                    </Badge>
                                                </div>

                                                <div className="mt-6 flex gap-12 text-sm">
                                                    <div>
                                                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                                            Limite Disponível
                                                        </div>
                                                        <div className="mt-1 font-semibold">{formatCurrency(currentDashboardData.availableLimit)}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                                            Próxima Fatura
                                                        </div>
                                                        <div className="mt-1 font-semibold">{currentDashboardData.nextBillDate}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-4 gap-3">
                                                {actions.map((action) => {
                                                    const Icon = action.icon
                                                    return (
                                                        <button
                                                            key={action.label}
                                                            type="button"
                                                            onClick={
                                                                action.label === "Depósito"
                                                                    ? handleQuickDeposit
                                                                    : action.label === "Transferência"
                                                                        ? handleGoToTransfers
                                                                        : undefined
                                                            }
                                                            disabled={updateBalanceMutation.isPending && action.label === "Depósito"}
                                                            className="flex flex-col cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 text-center hover:bg-slate-100 min-w-20 w-full h-20"
                                                        >
                                                            <Icon className="h-5 w-5 text-slate-700" />
                                                            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                                                {action.label === "Depósito" && updateBalanceMutation.isPending
                                                                    ? "Processando"
                                                                    : action.label}
                                                            </span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 bg-slate-950 text-white shadow-sm">
                                    <CardContent className="flex h-full flex-col justify-between p-6">
                                        <div>
                                            <div className="mb-5 flex items-center justify-between">
                                                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                    Crédito Institucional
                                                </div>
                                                <InfoIcon className="h-8 w-8 text-slate-500" />
                                            </div>

                                            <div className="text-sm text-slate-400">Score de Crédito</div>
                                            <div className="mt-2 flex items-center gap-3">
                                                <div className="text-5xl font-semibold">{currentDashboardData.creditScore}</div>
                                                <Badge className="rounded-md bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20">
                                                    EXCELENTE
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button className="mt-8 h-11 rounded-lg bg-white text-slate-950 hover:bg-slate-100">
                                            Ver Detalhes do Cartão
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="grid gap-6 xl:grid-cols-[1.55fr_0.75fr]">
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="flex min-h-[240px] items-start justify-between p-6">
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                Performance do Portfólio
                                            </div>
                                            <div className="mt-3 text-6xl font-semibold tracking-tight">
                                                {formatUSD(currentDashboardData.portfolioPerformance)}
                                            </div>

                                            <div className="mt-6 flex gap-3">
                                                <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-600 hover:bg-emerald-100">
                                                    +{currentDashboardData.percentageChange}% YTD
                                                </Badge>
                                                <Badge
                                                    variant="secondary"
                                                    className="rounded-full bg-slate-100 px-3 py-1 text-slate-500"
                                                >
                                                    Portfólio Institucional
                                                </Badge>
                                            </div>
                                        </div>

                                        <TrendingUp className="h-24 w-24 text-slate-200" />
                                    </CardContent>
                                </Card>
                                <div className="space-y-6">
                                    <Card className="border-none bg-[#f2f4f6]">
                                        <CardContent className="flex items-start justify-between p-6">
                                            <div>
                                                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                    Investimentos
                                                </div>
                                                <div className="mt-2 text-4xl font-semibold tracking-tight">
                                                    {formatUSD(currentDashboardData.investments)}
                                                </div>
                                            </div>
                                            <div className="rounded-lg bg-slate-50 p-3">
                                                <TrendingUp className="h-5 w-5 text-emerald-500" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-[#f2f4f6]">
                                        <CardContent className="flex items-start justify-between p-6">
                                            <div>
                                                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                    Liquidez / Poupança
                                                </div>
                                                <div className="mt-2 text-4xl font-semibold tracking-tight">
                                                    {formatCurrency(currentDashboardData.liquidity)}
                                                </div>
                                            </div>
                                            <div className="rounded-lg bg-slate-50 p-3">
                                                <PiggyBank className="h-5 w-5 text-slate-700" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                                    <div>
                                        <CardTitle className="text-3xl font-semibold tracking-tight">
                                            Atividade Recente
                                        </CardTitle>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Histórico de transações em todas as contas institucionais vinculadas
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {isLoading ? (
                                        <div className="px-6 py-10 text-sm text-slate-500">
                                            Carregando transações...
                                        </div>
                                    ) : (
                                        <ActivityTable rows={data} />
                                    )}
                                </CardContent>
                            </Card>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
