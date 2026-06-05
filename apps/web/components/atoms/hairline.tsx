import { cn } from "@arthurreira/ui"

export function Hairline({ className }: { className?: string }) {
  return <div className={cn("h-px bg-hairline", className)} />
}
