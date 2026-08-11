import { Geist, JetBrains_Mono } from "next/font/google"
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import SmoothScroll from "@/lib/SmoothScroll"
import "@arthurreira/ui/globals.css"
import { cn } from "@arthurreira/ui"
import { SiteNav } from "@/components/organisms/site-nav"
import { SiteFooter } from "@/components/organisms/site-footer"
import { SiteChat } from "@/components/organisms/site-chat"
import { Analytics } from "@vercel/analytics/next"
import { routing } from "@/i18n/routing"

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

// Geist drives --font-ui, which every label, subtitle and UI string reads.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })



export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  // Enables static rendering.
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning
      className={cn(
        "antialiased",
        geist.variable,
        jetbrainsMono.variable
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){
            try{
              var r=document.documentElement;
              var flag=localStorage.getItem('arthur-flag')||'brasil';
              var mode=localStorage.getItem('arthur-mode')||'dark';
              r.setAttribute('data-flag',flag);
              r.setAttribute('data-mode',mode);
              localStorage.setItem('arthur-flag',flag);
              localStorage.setItem('arthur-mode',mode);
            }catch(e){}
          })();` }} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SiteNav />
          <Analytics />
          <SmoothScroll>
            <main>{children}</main>
            <SiteFooter />
          </SmoothScroll>
          <SiteChat />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
