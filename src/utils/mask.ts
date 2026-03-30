export const maskCurrency = (value: string, locale = "pt-BR", currency = "BRL") => {
    let v = value.replace(/\D/g, "");
    if (!v) return "";

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(Number(v) / 100);
};

export const formatCurrency = (value: number, locale = "pt-BR", currency = "BRL") => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(value);
};

export const formatUSD = (value: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);
};

export const maskCpfCnpj = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 14);

    if (digits.length <= 11) {
        return digits
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2");
    }

    return digits
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
};
