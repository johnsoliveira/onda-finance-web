function LoginPage() {
    return (
        <div className="realtive flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-10 text-foreground">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/12 blur-[120px]" />
                <div className="absolute right-[5%] bottom-[5%] h-[30%] w-[30%] rounded-full bg-secondary/10 blur-[100px]" />
            </div>
            <main className="relative z-10 w-full max-w-[420px]">
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-3xl text-primary">~</span>
                        <span className="text-2xl font-bold tracking-tight text-secondary">
                            Onda Finance
                        </span>
                    </div>
                    <p className="text-sm text-muted">
                        Acesse sua conta para continuar
                    </p>
                </div>
                <div className="rounded-[1.25rem] border border-border/70 bg-surface p-8 shadow-[var(--shadow-card)]">
                    <h1 className="mb-6 text-xl font-semibold text-foreground">Login</h1>
                    <form className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label htmlFor="agencia" className="block text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-muted">Agência</label>
                                <input
                                    id="agencia"
                                    type="text"
                                    placeholder="0000"
                                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="conta"
                                    className="block text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-muted"
                                >
                                    Conta
                                </label>
                                <input
                                    id="conta"
                                    type="text"
                                    placeholder="00000-0"
                                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                                />
                            </div>

                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default LoginPage