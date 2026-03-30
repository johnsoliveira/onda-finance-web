import { useAuthStore } from "@/store/useAuthStore"
import { useTransferStore } from "@/store/useTransferStore"
import { formatCurrency } from "@/utils/mask"
import { ArrowRight, Bell, CircleHelp, Info, UserRound } from "lucide-react"

export default function TransferValuePage() {
    const { user } = useAuthStore()
    const { amount, setAmount, setStep } = useTransferStore()

    if (!user) return null

    const formattedAmount = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount || 0)

    function handleAmountChange(value: string) {
        const digitsOnly = value.replace(/\D/g, "")
        const nextAmount = Number(digitsOnly || "0") / 100

        setAmount(nextAmount)
    }

    const balance = user.dashboardData.totalBalance

    return (
        <>
            <header className="flex h-16 items-center justify-between px-8">
                <div className="text-xl font-semibold tracking-[-0.03em] text-slate-900">
                    Nova Transferência
                </div>
                <div className="flex items-center gap-5 text-slate-500">
                    <CircleHelp className="h-4 w-4" />
                    <Bell className="h-4 w-4" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dce9e7]">
                        <UserRound className="h-4 w-4 text-slate-700" />
                    </div>
                </div>
            </header>
            <main className="px-12 pt-10 pb-12">
                <div className="max-w-[1120px]">
                    <h1 className="mt-4 text-[4rem] leading-[0.95] font-semibold tracking-[-0.06em] text-slate-950">
                        Determinar o valor.
                    </h1>
                    <p className="mt-5 max-w-[660px] text-[20px] leading-9 text-slate-500">
                        Informe o valor exato de liquidez que deseja movimentar dentro da sua rede.
                    </p>
                    <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.75fr]">
                        <div>
                            <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    Informe o valor
                                </p>

                                <div className="mt-12 flex items-baseline gap-4">
                                    <span className="shrink-0 text-[6rem] leading-none font-semibold tracking-[-0.1em] text-[#159a92]">
                                        R$
                                    </span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={formattedAmount}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                        aria-label="Valor da transferência"
                                        className={`w-full border-0 bg-transparent p-0 text-[5.75rem] leading-none font-semibold tracking-[-0.08em] tabular-nums outline-none ${amount > 0 ? "text-slate-900" : "text-slate-100"}`}
                                    />
                                </div>
                                <div className="mt-10 rounded-xl bg-[#f4f7fb] px-5 py-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                                Saldo disponível
                                            </p>
                                            <p className="mt-1 text-[1.7rem] font-semibold tracking-[-0.04em] text-slate-900">
                                                {formatCurrency(balance)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAmount(balance)}
                                            className="text-sm cursor-pointer py-2 px-2 rounded-sm hover:bg-brand-100 font-semibold uppercase tracking-[0.08em] text-[#159a92]"
                                        >
                                            Max
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setStep("recipient")}
                                disabled={!amount || amount <= 0 || amount > balance}
                                className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-md bg-gradient-to-r from-[#031916] to-[#159a92] text-lg font-semibold text-white shadow-[0_8px_20px_rgba(2,22,20,0.16)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <span>Continuar</span>
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-5">
                            <div className="rounded-2xl bg-[#f1f4f8] p-5">
                                <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-slate-700">
                                    Contexto de Mercado
                                </h3>
                                <div className="mt-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                                    <div>
                                        <p className="text-sm text-slate-500">Estimated Gas / Fees</p>
                                        <p className="mt-1 text-[2rem] font-semibold tracking-[-0.04em] text-slate-900">
                                            $142.20
                                        </p>
                                    </div>

                                    <span className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#159a92]">
                                        Optimized
                                    </span>
                                </div>
                                <div className="pt-5">
                                    <p className="text-sm text-slate-500">Tempo de Liquidação</p>
                                    <p className="mt-1 text-[1.7rem] font-semibold tracking-[-0.04em] text-slate-900">
                                        &lt; 2 Minutos
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-2xl bg-[#11192b] p-5 text-white">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#21c7b8] text-[#0e1626]">
                                        <Info className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em]">
                                            Limiar Institucional
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-300">
                                            Transferências acima de US$ 1 milhão exigem autorização secundária com múltiplas assinaturas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}
