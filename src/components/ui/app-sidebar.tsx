import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarItem = {
    icon: LucideIcon;
    label: string;
    active?: boolean;
    onClick?: () => void;
};

type SidebarAction = {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
};

type SidebarCta = {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
};

type AppSidebarProps = {
    brandTitle: string;
    brandSubtitle: string;
    navItems: SidebarItem[];
    cta?: SidebarCta;
    bottomActions?: SidebarAction[];
    variant?: "brand" | "workflow";
};

export function AppSidebar({
    brandTitle,
    brandSubtitle,
    navItems,
    cta,
    bottomActions = [],
    variant = "brand",
}: AppSidebarProps) {
    return (
        <aside
            className={cn(
                "flex flex-col border-r",
                variant === "workflow" ? "bg-[#f7f9fc]" : "bg-white"
            )}
        >
            {variant === "workflow" ? (
                <div className="px-6 pt-8">
                    <div className="text-[18px] font-semibold tracking-[-0.03em] text-slate-900">
                        {brandTitle}
                    </div>
                    <div className="mt-8">
                        <div className="text-[15px] font-semibold tracking-[-0.03em] text-slate-900">
                            Transfer Funds
                        </div>
                        <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                            {brandSubtitle}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-20 items-center gap-3 px-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950">
                        <span className="text-3xl text-brand">~</span>
                    </div>
                    <div>
                        <div className="text-3xl font-semibold tracking-tight">{brandTitle}</div>
                        <div className="text-[11px] uppercase tracking-[0.35em] text-slate-500">
                            {brandSubtitle}
                        </div>
                    </div>
                </div>
            )}

            <div className={cn(variant === "workflow" ? "px-3 pt-8" : "px-3")}>
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.label}
                                type="button"
                                onClick={item.onClick}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-4 text-sm font-medium transition",
                                    variant === "workflow" ? "h-11" : "py-3",
                                    item.active
                                        ? variant === "workflow"
                                            ? "bg-brand/95 text-white shadow-sm hover:bg-brand"
                                            : "bg-brand text-white shadow-sm hover:bg-brand/90"
                                        : variant === "workflow"
                                            ? "text-slate-500 hover:bg-white hover:text-slate-900"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon className={cn(variant === "workflow" ? "h-4 w-4" : "h-5 w-5")} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className={cn("mt-auto", variant === "workflow" ? "border-t border-slate-200 px-3 py-8" : "p-3")}>
                {cta ? (
                    <Button
                        type="button"
                        onClick={cta.onClick}
                        className={cn(
                            "mb-6 h-12 w-full justify-center rounded-lg bg-black text-white hover:bg-slate-800",
                            variant === "workflow" && "mx-3 w-[calc(100%-1.5rem)]"
                        )}
                    >
                        <cta.icon className="h-4 w-4" />
                        {cta.label}
                    </Button>
                ) : null}

                <div className="space-y-1">
                    {bottomActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <button
                                key={action.label}
                                type="button"
                                onClick={action.onClick}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-500",
                                    variant === "workflow" ? "hover:bg-white" : "hover:bg-slate-50"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {action.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}
