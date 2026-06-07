import { Geist, JetBrains_Mono } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { cookies } from 'next/headers'

import "@arthurreira/ui/globals.css"
import { cn } from "@arthurreira/ui"
import { SiteNav } from "@/components/organisms/site-nav"
import { VerticalTicker } from "@/components/atoms/vertical-ticker"
import { Analytics } from '@arthurreira/analytics/client'

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
  const cookieStore = await cookies()
  const themeFlag = cookieStore.get("arthur-flag")?.value ?? "brasil"
  const themeMode = cookieStore.get("arthur-mode")?.value ?? "dark"

  return (
    <html lang={locale} data-flag={themeFlag} data-mode={themeMode} suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, "font-mono", jetbrainsMono.variable)}
    >
      <head>
        {/* No-flash boot: sync localStorage with the server-set attributes (keyboard handled in SiteNav) */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){
            try{
              var r=document.documentElement;
              var flag=r.getAttribute('data-flag')||localStorage.getItem('arthur-flag')||'brasil';
              var mode=r.getAttribute('data-mode')||localStorage.getItem('arthur-mode')||'dark';
              r.setAttribute('data-flag',flag);
              r.setAttribute('data-mode',mode);
              localStorage.setItem('arthur-flag',flag);
              localStorage.setItem('arthur-mode',mode);
            }catch(e){}
          })();` }} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <VerticalTicker />
          <SiteNav />
          <Analytics
            apiKey={process.env.NEXT_PUBLIC_ANALYTICS_KEY!}
            apiUrl={process.env.NEXT_PUBLIC_ANALYTICS_URL!}
          />
          <main>
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
