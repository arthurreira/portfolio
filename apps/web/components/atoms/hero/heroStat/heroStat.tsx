import { HeroStatProps } from "./heroStatProps";
import { ClockIcon, CodeIcon,TranslateIcon } from "@phosphor-icons/react"



export default function HeroStat({ number, label, icon }: HeroStatProps) {
    return (
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-display font-semibold text-foreground">{number}</h2>
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    {icon}
                    {label}
                </span>
            </div>
    );
}


// <div className="flex flex-col gap-1">
//                 <h2 className="text-lg font-display font-semibold text-foreground">2+</h2>
//                 <span className="text-muted-foreground flex items-center gap-1 text-xs">
//                     <CodeIcon className="text-primary" size={14} weight="fill" />
//                     years coding
//                 </span>
//             </div>
//             <div className="flex flex-col gap-1">
//                 <h2 className="text-lg font-display font-semibold text-foreground">4</h2>
//                 <span className="text-muted-foreground flex items-center gap-1 text-xs">
//                     <TranslateIcon className="text-primary" size={14} weight="fill" />
//                     languages
//                 </span>
//             </div>