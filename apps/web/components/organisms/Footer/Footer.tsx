"use client"
import Link from "next/link"
import { GithubLogoIcon } from "@phosphor-icons/react"

export function Footer() {
    
    return (
        <footer className=" fixed bottom-0 py-2  w-full bg-background/80 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-4">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm text-muted-foreground">
                    
                    <span className="hidden md:inline">(Press d to toggle dark mode)</span>

                    <Link
                        href="https://github.com/arthurreira"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-accent-foreground hover:underline underline-offset-4 transition-colors"
                    >
                        <span className="">© {new Date().getFullYear()} Arthurreira</span>
                        <GithubLogoIcon  size={22} weight="duotone" className="text-primary" />

                    </Link>

                </div>
            </div>
        </footer>
    )
}