import { Eye, EyeOff, Loader2, Lock, Shield } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthLogin } from "@/hooks/auth-login";

const loginSchema = z.object({
    agencia: z.string()
        .min(4, "Mínimo 4 dígitos")
        .regex(/^\d+$/, "Apenas números"),
    conta: z.string()
        .min(5, "Mínimo 5 dígitos")
        .regex(/^\d+$/, "Apenas números"),
    senha: z.string()
        .length(6, "Deve ter 6 caracteres")
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/, "Letras e números"),
})

type LoginData = z.infer<typeof loginSchema>;

function LoginPage() {
    const { mutate, isPending } = useAuthLogin();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            agencia: "",
            conta: "",
            senha: ""
        }
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const onSubmit = (data: LoginData) => {
        mutate(data, {
            onError: (error: any) => {
                setError("root", {
                    type: "manual",
                    message: error.message
                });
            }
        });
    }

    return (
        <div className="realtive flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-10 text-foreground">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-brand/12 blur-[120px]" />
                <div className="absolute right-[5%] bottom-[5%] h-[30%] w-[30%] rounded-full bg-ink/10 blur-[100px]" />
            </div>
            <main className="relative z-10 w-full max-w-[420px]">
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-3xl text-brand">~</span>
                        <span className="text-2xl font-bold tracking-tight text-ink">
                            Onda Finance
                        </span>
                    </div>
                    <p className="text-sm text-app-muted">
                        Acesse sua conta para continuar
                    </p>
                </div>
                <div className="rounded-[1.25rem] border border-app-border/70 bg-app-surface p-8 shadow-(--shadow-card)">
                    <h1 className="mb-6 text-xl font-semibold text-foreground">Login</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {errors.root && (
                            <div className="rounded-xl bg-red-500/10 p-4 text-center text-xs font-semibold text-red-600 border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                                {errors.root.message}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label htmlFor="agencia" className="block text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-app-muted">Agência</label>
                                <input
                                    id="agencia"
                                    type="text"
                                    placeholder="0000"
                                    {...register("agencia")}
                                    maxLength={4}
                                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:ring-4 ${errors.agencia ? 'border-red-500 focus:ring-red-500/15' : 'border-app-border focus:border-brand focus:ring-brand/15'}`}
                                />
                                {errors.agencia && <p className="text-[0.625rem] text-red-500">{errors.agencia.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="conta"
                                    className="block text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-app-muted"
                                >
                                    Conta
                                </label>
                                <input
                                    id="conta"
                                    type="text"
                                    placeholder="00000-0"
                                    {...register("conta")}
                                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:ring-4 ${errors.conta ? 'border-red-500 focus:ring-red-500/15' : 'border-app-border focus:border-brand focus:ring-brand/15'}`}
                                />
                                {errors.conta && <p className="text-[0.625rem] text-red-500">{errors.conta.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="senha"
                                    className="block text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-app-muted"
                                >
                                    Senha
                                </label>
                                <a
                                    href="#"
                                    className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-brand hover:underline"
                                >
                                    Esqueci a senha
                                </a>
                            </div>

                            <div className="relative">
                                <input
                                    id="senha"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("senha")}
                                    maxLength={6}
                                    className={`w-full rounded-xl border bg-background px-4 py-2.5 pr-11 text-sm text-foreground outline-none transition focus:ring-4 ${errors.senha ? 'border-red-500 focus:ring-red-500/15' : 'border-app-border focus:border-brand focus:ring-brand/15'}`}
                                />
                                <button
                                    type="button"
                                    className="absolute top-1/3 right-3 -translate-y-1/2 text-app-muted transition hover:text-foreground cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                                {errors.senha && <p className="mt-1 text-[0.625rem] text-red-500">{errors.senha.message}</p>}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-3 flex h-12 w-full items-center cursor-pointer justify-center gap-2 rounded-lg bg-linear-to-r from-[#054c40] to-[#0d9488] text-lg font-semibold text-white transition hover:opacity-95 disabled:pointer-events-none disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Entrar</span>
                                    <span>→</span>
                                </>
                            )}
                        </button>
                    </form>
                    <div className="mt-8 flex flex-col items-center gap-4 border-t border-border/60 pt-6">
                        <p className="text-center text-xs text-app-muted">
                            Ainda não possui acesso?{" "}
                            <a href="#" className="font-semibold text-brand hover:underline">
                                Solicite aqui
                            </a>
                        </p>
                    </div>

                </div>
                <div className="mt-12 flex flex-col items-center gap-4 opacity-70">
                    <div className="flex items-center gap-6 text-[10px] font-semibold uppercase tracking-wider text-app-muted">
                        <div className="flex items-center gap-1.5">
                            <Shield className="h-4 w-4" />
                            <span>SSL</span>
                            <span>Certificado</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Lock className="h-4 w-4" />
                            <span>Criptografia ponta a ponta</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default LoginPage
