import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"

import "@arthurreira/ui/globals.css"
import { ThemeProvider } from "@arthurreira/ui/lib/theme-provider"
import { cn } from "@arthurreira/ui/lib/utils";
import { TopBar } from "@/components/navBar";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, "font-mono", jetbrainsMono.variable)}
      style={{ viewTransitionName: "root" }}
    >
      <body>
        <ThemeProvider>

          <TopBar />
          {children}

        </ThemeProvider>
      </body>
    </html>
  )
}
