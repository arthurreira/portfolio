import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'fi', 'pt-br'],
  defaultLocale: 'fi',
  localePrefix: 'always', 
})

export type Locale = (typeof routing.locales)[number]

export const { useRouter, usePathname, Link, redirect } = createNavigation(routing)