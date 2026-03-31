import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast rounded-2xl border border-app-border/80 bg-app-surface text-app-foreground shadow-(--shadow-card)",
          title: "text-sm font-semibold tracking-[-0.02em]",
          description: "text-sm text-app-muted",
          error:
            "border-[color:color-mix(in_oklab,var(--destructive)_22%,transparent)] bg-[color:color-mix(in_oklab,var(--destructive)_10%,white)] text-[var(--destructive)]",
          icon: "text-[var(--destructive)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
