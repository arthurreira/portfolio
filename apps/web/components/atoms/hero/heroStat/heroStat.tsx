"use client"
import { HeroStatProps } from "./heroStatProps";
import { ClockIcon, CodeIcon, TranslateIcon } from "@phosphor-icons/react"

const icons = {
  clock: ClockIcon,
  code: CodeIcon,
  translate: TranslateIcon,
}


export default function HeroStat({ number, label, icon }: HeroStatProps) {

    const IconComponent = icons[icon as keyof typeof icons]

    return (
            <div >
                <h2 className="text-lg font-display font-semibold text-foreground">{number}</h2>
                <span className="text-muted-foreground flex gap-1 text-xs">
                {IconComponent && <IconComponent size={14} weight="fill" className="text-primary" />}
                {label}
                </span>
            </div>
    );
}


