import { HeroButtonProps } from "./heroButtonProps"
import Link from "next/link"
import { buttonVariants } from "@arthurreira/ui/components/button"

export default function HeroButton({ href, label }: HeroButtonProps) {
  return (
    <Link
      href={href}
      className={`${buttonVariants({ variant: "secondary", size: "lg" })} 
        hover:translate-y-[-4px] transition-transform duration-200 
        `}
    >
      {label}
    </Link>
  )
}