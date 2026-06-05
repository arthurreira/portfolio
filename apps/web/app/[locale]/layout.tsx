import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { cookies } from 'next/headers'

import "@arthurreira/ui/globals.css"
import { cn } from "@arthurreira/ui"
// import { TopBar } from "@/components/organisms"
import { SiteNav } from "@/components/organisms/site-nav"
import { VerticalTicker } from "@/components/atoms/vertical-ticker"
// import { Footer } from "@/components/organisms/Footer/Footer"
import { spring } from "motion"
import { Analytics } from '@arthurreira/analytics/client'
// ThemeProvider commented out — test pages use data-flag + data-mode system instead
// import { ThemeProvider } from "@arthurreira/ui/client"
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
  const cookieStore = await cookies()
  const themeFlag = cookieStore.get("arthur-flag")?.value ?? "brasil"
  const themeMode = cookieStore.get("arthur-mode")?.value ?? "dark"

  return (
    <html lang={locale} data-flag={themeFlag} data-mode={themeMode} suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, "font-mono", jetbrainsMono.variable)}
    >
      <head>
        <style>{`:root { --spring: ${springTransition}; }`}</style>
        {/* No-flash boot: attributes already set by server; keyboard shortcuts wired before React */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){
            try{
              // Server already set data-flag/data-mode from cookies — only sync localStorage
              var r=document.documentElement;
              var flag=r.getAttribute('data-flag')||localStorage.getItem('arthur-flag')||'brasil';
              var mode=r.getAttribute('data-mode')||localStorage.getItem('arthur-mode')||'dark';
              r.setAttribute('data-flag',flag);
              r.setAttribute('data-mode',mode);
              localStorage.setItem('arthur-flag',flag);
              localStorage.setItem('arthur-mode',mode);
            }catch(e){}
            // d = toggle mode, f = toggle flag — works immediately, before React hydrates
            document.addEventListener('keydown',function(e){
              if(e.defaultPrevented||e.repeat||e.metaKey||e.ctrlKey||e.altKey) return;
              var t=e.target;
              if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)) return;
              var r=document.documentElement;
              if(e.key==='d'){
                var next=r.getAttribute('data-mode')==='dark'?'light':'dark';
                r.setAttribute('data-mode',next);
                try{localStorage.setItem('arthur-mode',next);}catch(err){}
                window.dispatchEvent(new CustomEvent('arthur-theme',{detail:{mode:next}}));
              }
              if(e.key==='f'){
                var next=r.getAttribute('data-flag')==='brasil'?'suomi':'brasil';
                r.setAttribute('data-flag',next);
                try{localStorage.setItem('arthur-flag',next);}catch(err){}
                window.dispatchEvent(new CustomEvent('arthur-theme',{detail:{flag:next}}));
              }
            });
          })();` }} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {/* <TopBar /> */}
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
