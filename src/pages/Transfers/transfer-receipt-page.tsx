import { CheckCircle2, Bell, Home, Share2, UserRound } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTransferStore } from "@/store/useTransferStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useUpdateDashboardBalance } from "@/hooks/use-update-dashboard-balance"
import { formatCurrency } from "@/utils/mask"
import { useEffect, useRef } from "react"

export default function TransferReceiptPage() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { amount, recipient, receipt, generateReceipt, resetTransfer } = useTransferStore()
    const updateBalance = useUpdateDashboardBalance()
    const hasProcessed = useRef(false)

    useEffect(() => {
        if (!user || hasProcessed.current) return

        hasProcessed.current = true

        if (!receipt) {
            generateReceipt()
        }

        updateBalance.mutate({
            agencia: user.agencia,
            conta: user.conta,
            amount: -amount,
            transaction: {
                id: `TX-${Date.now()}`,
                date: new Intl.DateTimeFormat("pt-BR").format(new Date()),
                description: `Transferência para ${recipient.fullName}`,
                category: "TRANSFER",
                status: "Completed",
                amount,
                type: "expense",
            },
        })
    }, [amount, generateReceipt, receipt, recipient.fullName, updateBalance, user])

    if (!user) return null

    return (
        <>
            <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
                <div className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                    Onda Finance
                </div>

                <div className="flex items-center gap-8">
                    <nav className="flex items-center gap-6 text-sm text-slate-500">
                        <a href="#">Support</a>
                        <a href="#">Help Center</a>
                    </nav>

                    <div className="flex items-center gap-5 text-slate-500">
                        <Bell className="h-4 w-4" />
                        <div className="flex items-center gap-2 text-sm">
                            <UserRound className="h-4 w-4" />
                            <span>{user.role}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 bg-[#f7f9fc] px-8 py-10">
                <div className="mx-auto max-w-[920px]">
                    <div className="flex flex-col items-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#18a497] text-white">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>

                        <h1 className="mt-6 text-[2.5rem] font-semibold tracking-[-0.05em] text-slate-900">
                            Transferência Realizada com Sucesso
                        </h1>

                        <p className="mt-3 text-lg text-slate-500">
                            Seu comprovante está pronto para download ou compartilhamento.
                        </p>
                    </div>

                    <div className="mt-10 overflow-hidden rounded-[1.75rem] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                        <div className="bg-[#f1f4f8] px-8 py-8 text-center">
                            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Valor da transação
                            </p>
                            <p className="mt-3 text-[3rem] font-semibold tracking-[-0.06em] text-slate-950">
                                {formatCurrency(amount)}
                            </p>
                        </div>

                        <div className="px-8 py-8">
                            <div>
                                <h2 className="text-lg font-semibold uppercase tracking-[0.12em] text-[#159a92]">
                                    Destinatário
                                </h2>

                                <div className="mt-6 grid gap-6 md:grid-cols-2">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                            Nome completo
                                        </p>
                                        <p className="mt-2 text-xl font-semibold text-slate-900">
                                            {recipient.fullName}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                            Instituição
                                        </p>
                                        <p className="mt-2 text-xl font-semibold text-slate-900">
                                            {recipient.bankName}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                            Agência / Conta
                                        </p>
                                        <p className="mt-2 text-xl font-semibold text-slate-900">
                                            {recipient.agencia} / {recipient.conta}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                            CPF/CNPJ
                                        </p>
                                        <p className="mt-2 text-xl font-semibold text-slate-900">
                                            {recipient.document}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <h2 className="text-lg font-semibold uppercase tracking-[0.12em] text-[#159a92]">
                                    Origem
                                </h2>

                                <div className="mt-5 rounded-xl bg-[#f5f7fb] p-5">
                                    <p className="text-xl font-semibold text-slate-900">{user.bankName}</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {user.role} · Ag {user.agencia} · CC {user.conta}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">{user.document}</p>
                                </div>
                            </div>

                            <div className="mt-10 grid gap-6 md:grid-cols-2">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                        Data e hora
                                    </p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900">
                                        {receipt?.createdAt}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                        Código de autenticação
                                    </p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900">
                                        {receipt?.authenticationCode}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10 rounded-lg bg-[#f8fafc] px-4 py-3 text-center text-sm text-slate-500">
                                Esta transação foi processada de forma segura pela rede Onda Finance.
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <button
                            type="button"
                            className="flex h-14 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-base font-semibold text-slate-800"
                        >
                            <Share2 className="h-5 w-5" />
                            Compartilhar Comprovante
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                resetTransfer()
                                navigate("/dashboard")
                            }}
                            className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#18a497] text-base font-semibold text-white"
                        >
                            <Home className="h-5 w-5" />
                            Voltar para o Início
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Precisa de ajuda com esta transferência?{" "}
                        <span className="font-medium text-[#159a92]">Contate o suporte</span>
                    </p>
                </div>
            </main>
        </>
    )
}
