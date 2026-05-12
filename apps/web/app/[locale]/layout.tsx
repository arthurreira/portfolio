import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

import "@arthurreira/ui/globals.css"
import { cn } from "@arthurreira/ui"
import { ThemeProvider } from "@arthurreira/ui/client"
import { TopBar } from "@/components/organisms"
import { Footer } from "@/components/organisms/Footer/Footer"
import { spring } from "motion"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const springTransition = spring(0.6, 0.3)

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages({ locale })

  return (
    <html lang={locale} suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, "font-mono", jetbrainsMono.variable)}
    >
      <head>
         <style>{`:root { --spring: ${springTransition}; }`}</style>
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <TopBar  />
            {children}
            <Footer />

          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
