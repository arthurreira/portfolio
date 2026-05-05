"use client"
import Link from "next/link"
import { GithubLogoIcon } from "@phosphor-icons/react"

export function Footer() {
    return (
        <footer className="border-t border-border mt-16 py-6 fixed bottom-0 w-full bg-background/80 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-4">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm text-muted-foreground">
                    
                    <span>© {new Date().getFullYear()} Arthurreira</span>

                    <Link
                        href="https://github.com/arthurreira"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-accent-foreground hover:underline underline-offset-4 transition-colors"
                    >
                        <GithubLogoIcon size={32} />
                        <span className="hidden sm:inline">GitHub</span>
                    </Link>

                    

                    <span>Currently learning Kubernetes</span>
                </div>
            </div>
        </footer>
    )
}