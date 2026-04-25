import { HeroButtonProps } from "./heroButtonProps"
import Link from "next/link"

export default function HeroButton({ href, label }: HeroButtonProps) {
  return  <Link href={href} className="px-6 h-11 flex items-center rounded-lg bg-primary text-primary-foreground text-sm transition ease-linear hover:bg-primary/90">
            {label}
        </Link>
}
