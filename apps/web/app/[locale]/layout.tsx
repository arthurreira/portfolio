import { Geist, JetBrains_Mono } from "next/font/google"
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import "@arthurreira/ui/globals.css"
import { cn } from "@arthurreira/ui"
import { SiteNav } from "@/components/organisms/site-nav"
import { SiteChat } from "@/components/organisms/site-chat"
import { Analytics } from "@vercel/analytics/next"
import { routing } from "@/i18n/routing"

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

// Geist drives --font-ui, which every label, subtitle and UI string reads.
// Previously that variable was a hardcoded Helvetica/Arial system stack while
// a second Geist was loaded and never used.
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

  // Enables static rendering. Without it, next-intl reads headers() on every
  // request, which opts the whole route tree out of static generation (a
  // serverless invocation per request, including RSC prefetches).
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
        {/* No-flash boot: restore the theme from localStorage before first
            paint. Runs in <head> before <body> renders, so there is no flash.
            Theme used to be seeded from cookies server-side, but that read
            forced dynamic rendering for the entire site.
            Keyboard shortcuts (d = mode, l = language) live in SiteNav. */}
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
          <main>{children}</main>
          <SiteChat />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
