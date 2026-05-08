"use client"

import * as React from "react"
import { cn } from "../lib/utils"


interface NavBarProps {
    href: string
    label: string
    children: React.ReactNode

}


export function NavBar({ href, label, children }: NavBarProps) {
    return (
        <header className={cn("w-full border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm")}>
            <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-4 flex h-14 items-center justify-between">
                <a href={href} className="scroll-m-20 font-extrabold tracking-tight text-balance">{label}</a>

                <nav className="flex items-center gap-3">
                    {children}
                </nav>
            </div>
        </header>
    )
}
