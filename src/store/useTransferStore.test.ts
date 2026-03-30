import { beforeEach, describe, expect, it } from "vitest";
import { useTransferStore } from "@/store/useTransferStore";

describe("useTransferStore", () => {
    beforeEach(() => {
        useTransferStore.getState().resetTransfer();
        window.localStorage.clear();
    });

    it("updates amount and recipient data", () => {
        useTransferStore.getState().setAmount(45000);
        useTransferStore.getState().setRecipient({
            fullName: "Arturo V. de Albuquerque",
            bankName: "Banco Inter",
        });

        const state = useTransferStore.getState();

        expect(state.amount).toBe(45000);
        expect(state.recipient.fullName).toBe("Arturo V. de Albuquerque");
        expect(state.recipient.bankName).toBe("Banco Inter");
    });

    it("resets transfer flow to initial state", () => {
        useTransferStore.getState().setAmount(1000);
        useTransferStore.getState().setStep("recipient");
        useTransferStore.getState().setRecipient({ fullName: "Teste" });

        useTransferStore.getState().resetTransfer();

        const state = useTransferStore.getState();

        expect(state.step).toBe("value");
        expect(state.amount).toBe(0);
        expect(state.recipient.fullName).toBe("");
        expect(state.receipt).toBeNull();
    });
});
