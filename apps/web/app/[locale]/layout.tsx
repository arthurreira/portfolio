import { Geist, JetBrains_Mono } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { cookies } from 'next/headers'
import SmoothScroll from "@/lib/SmoothScroll"
import "@arthurreira/ui/globals.css"
import { cn } from "@arthurreira/ui"
import { SiteNav } from "@/components/organisms/site-nav"
import { VerticalTicker } from "@/components/atoms/vertical-ticker"
import { ScrollProgress } from "@/components/atoms/scroll-progress"
import { BackToTop } from "@/components/atoms/back-to-top"
import { CursorFollower } from "@/components/atoms/cursor-follower"
import { Analytics } from "@vercel/analytics/next"

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
  // No defaults here: when a cookie is missing the attribute is omitted, so
  // the boot script below can fall back to localStorage (else it never could).
  const themeFlag = cookieStore.get("arthur-flag")?.value
  const themeMode = cookieStore.get("arthur-mode")?.value

  return (
    <html lang={locale} data-flag={themeFlag} data-mode={themeMode} suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, "font-mono", jetbrainsMono.variable)}
    >
      <head>
        {/* No-flash boot: cookie-set attributes win; otherwise restore from
            localStorage before first paint (covers cleared-cookie visitors).
            Keyboard shortcuts (d = mode, l = language) live in SiteNav. */}
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
          <ScrollProgress />
          <CursorFollower />
          <VerticalTicker />
          <SiteNav />
          <Analytics />
          <SmoothScroll>
          <main>
            {children}
          </main>
          <BackToTop />
        </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
