import { HeroButtonProps } from "./heroButtonProps"
import Link from "next/link"
import { buttonVariants } from "@arthurreira/ui/components/button"

export default function HeroButton({ href, label }: HeroButtonProps) {
  return (
    <Link
      href={href}
     className={`${buttonVariants({ variant: "default", size: "lg" })} 
  bg-primary text-primary-foreground 
  shadow-lg hover:shadow-xl 
  hover:translate-y-[-4px] transition-transform duration-200 
  rounded-md text-base font-semibold`}
    >
      {label}
    </Link>
  )
}