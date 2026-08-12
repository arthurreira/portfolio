import { Geist, JetBrains_Mono } from "next/font/google"

import "@arthurreira/ui/globals.css"
import { cn } from "@arthurreira/ui"
import { ThemeProvider } from "@arthurreira/ui/client"
import { TopBar } from "@/components/top-bar"

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
