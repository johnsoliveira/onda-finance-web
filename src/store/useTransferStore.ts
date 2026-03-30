import { create } from "zustand"
import { persist } from "zustand/middleware"

type TransferStep = "value" | "recipient" | "confirmation"

type RecipientData = {
    fullName: string
    document: string
    bankName: string
    agencia: string
    conta: string
}

type TransferReceipt = {
    authenticationCode: string
    createdAt: string
}

type TransferState = {
    step: TransferStep
    amount: number
    recipient: RecipientData
    receipt: TransferReceipt | null

    setStep: (step: TransferStep) => void
    setAmount: (amount: number) => void
    setRecipient: (data: Partial<RecipientData>) => void
    generateReceipt: () => void
    resetTransfer: () => void
}

const initialRecipient: RecipientData = {
    fullName: "",
    document: "",
    bankName: "",
    agencia: "",
    conta: "",
}

export const useTransferStore = create<TransferState>()(
    persist(
        (set) => ({
            step: 'value',
            amount: 0,
            recipient: initialRecipient,
            receipt: null,
            setStep: (step) => set({ step }),
            setAmount: (amount) => set({ amount }),

            setRecipient: (data) =>
                set((state) => ({
                    recipient: {
                        ...state.recipient,
                        ...data,
                    },
                })),

            generateReceipt: () => set(() => ({
                receipt: {
                    authenticationCode: `ONDA-TX-${Math.floor(Math.random() * 9999)}-${Math.floor(
                        Math.random() * 9999
                    )}-X${Math.floor(Math.random() * 999)} `,
                    createdAt: new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "medium",
                    }).format(new Date()),
                }
            })),

            resetTransfer: () =>
                set({
                    step: "value",
                    amount: 0,
                    recipient: initialRecipient,
                    receipt: null,
                }),
        }),
        {
            name: "onda-transfer-flow",
        }
    )
)