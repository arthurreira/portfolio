"use client"
import { HeroStatProps } from "./heroStatProps";
import { ClockIcon, CodeIcon, TranslateIcon } from "@phosphor-icons/react"
import { Badge } from "@arthurreira/ui/components/badge";

const icons = {
  clock: ClockIcon,
  code: CodeIcon,
  translate: TranslateIcon,
}

export default function HeroStat({ number, label, icon, visible }: HeroStatProps & { visible: boolean }) {
    const IconComponent = icons[icon as keyof typeof icons]

    return (
        <div className="flex items-center gap-1 sm:gap-4">
            <div className="relative">
                {IconComponent && <IconComponent size={32} weight="fill" className="text-primary" />}
                <Badge className={`absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"}`}>
                    {label}
                </Badge>
            </div>
            <div>
                <h2 className="text-lg font-display font-semibold text-foreground">{number}</h2>
            </div>
        </div>
    );
}