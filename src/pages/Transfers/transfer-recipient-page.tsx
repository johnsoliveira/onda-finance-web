import { Bell, CircleHelp, UserRound } from "lucide-react";
import { useTransferStore } from "@/store/useTransferStore";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { maskCpfCnpj } from "@/utils/mask";

const EMPTY_BANK_VALUE = "__empty_bank__";

const recipientSchema = z.object({
    fullName: z
        .string()
        .min(3, "Informe o nome completo")
        .regex(/^[A-Za-zÀ-ÿ\s]+$/, "Use apenas letras"),
    document: z
        .string()
        .min(11, "Documento inválido")
        .regex(/^[\d.\-\/]+$/, "Documento inválido"),
    bankName: z.string().min(1, "Selecione um banco"),
    agencia: z
        .string()
        .min(4, "Agência deve ter ao menos 4 dígitos")
        .regex(/^\d+$/, "Apenas números"),
    conta: z
        .string()
        .min(5, "Conta inválida")
        .regex(/^[\d-]+$/, "Conta inválida"),
})

type RecipientFormData = z.infer<typeof recipientSchema>

export default function TransferRecipientPage() {
    const { recipient, setRecipient, setStep, amount } = useTransferStore()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RecipientFormData>({
        resolver: zodResolver(recipientSchema),
        defaultValues: {
            fullName: recipient.fullName,
            document: recipient.document,
            bankName: recipient.bankName,
            agencia: recipient.agencia,
            conta: recipient.conta,
        },
    })


    function onSubmit(data: RecipientFormData) {
        setRecipient(data)
        setStep("confirmation")
    }

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
                <div className="grid gap-8 xl:grid-cols-[1fr_290px]">
                    <div className="max-w-[720px]">
                        <h1 className="text-[3.3rem] leading-[0.96] font-semibold tracking-[-0.05em] text-slate-950">
                            Detalhes do destinatário
                        </h1>

                        <p className="mt-4 max-w-[700px] text-[20px] leading-9 text-slate-500">
                            Insira as informações bancárias da pessoa ou entidade para a qual deseja transferir os fundos.
                        </p>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5 rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                            <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Nome completo
                                </label>
                                <Input
                                    {...register("fullName")}
                                    placeholder="Ex.: Alexander Hamilton"
                                    className={`h-12 w-full rounded-lg border bg-slate-100 px-4 outline-none ${errors.fullName ? "border-red-500" : "border-transparent"
                                        }`}
                                />
                                {errors.fullName && (
                                    <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    CPF/CNPJ
                                </label>
                                <Controller
                                    name="document"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            value={field.value}
                                            onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))}
                                            placeholder="000.000.000-00"
                                            className={`h-12 w-full rounded-lg border bg-slate-100 px-4 outline-none ${errors.document ? "border-red-500" : "border-transparent"
                                                }`}
                                        />
                                    )}
                                />
                                {errors.document && (
                                    <p className="mt-1 text-xs text-red-500">{errors.document.message}</p>
                                )}
                            </div>
                            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
                                <div>
                                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                        Banco
                                    </label>
                                    <Controller
                                        name="bankName"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value || undefined}
                                                onValueChange={(value) => {
                                                    field.onChange(value === EMPTY_BANK_VALUE ? "" : value)
                                                }}
                                            >
                                                <SelectTrigger
                                                    className={`h-14 w-full rounded-lg border bg-slate-100 px-4 outline-none ${errors.bankName ? "border-red-500" : "border-transparent"
                                                        }`}
                                                >
                                                    <SelectValue placeholder="Selecione um banco" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value={EMPTY_BANK_VALUE}>Selecione um banco</SelectItem>
                                                    <SelectItem value="Banco Inter">Banco Inter</SelectItem>
                                                    <SelectItem value="Nubank">Nubank</SelectItem>
                                                    <SelectItem value="Itaú">Itaú</SelectItem>
                                                    <SelectItem value="Bradesco">Bradesco</SelectItem>
                                                    <SelectItem value="Onda Finance">Onda Finance</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.bankName && (
                                        <p className="mt-1 text-xs text-red-500">{errors.bankName.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                        Agência
                                    </label>
                                    <Input
                                        {...register("agencia")}
                                        placeholder="0001"
                                        maxLength={4}
                                        className={`h-12 w-full rounded-lg border bg-slate-100 px-4 outline-none ${errors.agencia ? "border-red-500" : "border-transparent"
                                            }`}
                                    />
                                    {errors.agencia && (
                                        <p className="mt-1 text-xs text-red-500">{errors.agencia.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                        Conta
                                    </label>
                                    <input
                                        {...register("conta")}
                                        placeholder="0001"
                                        className={`h-12 w-full rounded-lg border bg-slate-100 px-4 outline-none ${errors.conta ? "border-red-500" : "border-transparent"
                                            }`}
                                    />
                                    {errors.conta && (
                                        <p className="mt-1 text-xs text-red-500">{errors.conta.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep("value")}
                                    className="text-sm cursor-pointer font-medium text-slate-500 hover:text-slate-900"
                                >
                                    Voltar
                                </button>

                                <button
                                    type="submit"
                                    className="h-12 cursor-pointer rounded-lg bg-gradient-to-r from-[#031916] to-[#159a92] px-6 text-sm font-semibold text-white"
                                >
                                    Revisar transferência
                                </button>
                            </div>
                        </form>
                    </div>
                    <aside className="space-y-5">
                        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                Valor selecionado
                            </p>
                            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                                R$ {amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </aside>
                </div>
            </main>
        </>
    )
}
