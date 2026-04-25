import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fi', 'pt-br'],
  defaultLocale: 'fi'
})

export type Locale = (typeof routing.locales)[number]