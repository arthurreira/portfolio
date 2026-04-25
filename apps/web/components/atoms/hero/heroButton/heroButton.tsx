import { HeroButtonProps } from "./heroButtonProps"
import Link from "next/link"
import { buttonVariants } from "@arthurreira/ui/components/button"
export default function HeroButton({ href, label }: HeroButtonProps) {
  return  <Link  href={href} className={`${buttonVariants({ variant: "default", size: "md" })} shadow-lg hover:translate-3.5 p-2 rounded-lg text-sm font-medium`}>
            {label}
        </Link>
}
