import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'

import "@arthurreira/ui/styles/globals.css"
import { ThemeProvider } from "@arthurreira/ui/lib/theme-provider"

import { TopBar } from "@/components/organisms"
import { cn } from "@arthurreira/ui/lib/utils";
import { Footer } from "@/components/organisms/Footer/Footer"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

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
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <TopBar locale={locale as Locale} />
            {children}
            <Footer />

          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
