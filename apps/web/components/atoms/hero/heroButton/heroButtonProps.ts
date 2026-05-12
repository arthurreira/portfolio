import type { buttonVariants } from "@arthurreira/ui"

type ButtonVariantProps = NonNullable<Parameters<typeof buttonVariants>[0]>

export type HeroButtonProps = {
  href: string
  label: string
  variant?: ButtonVariantProps['variant']
  size?: ButtonVariantProps['size']
}