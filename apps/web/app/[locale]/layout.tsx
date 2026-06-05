import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

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

  return (
    <html lang={locale} suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, "font-mono", jetbrainsMono.variable)}
    >
      <head>
        <style>{`:root { --spring: ${springTransition}; }`}</style>
        {/* No-flash boot: set attributes + wire keyboard shortcuts before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){
  try{
    var r=document.documentElement;
    r.setAttribute('data-flag',localStorage.getItem('arthur-flag')||'brasil');
    r.setAttribute('data-mode',localStorage.getItem('arthur-mode')||'dark');
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
