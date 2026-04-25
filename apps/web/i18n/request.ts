import { getRequestConfig } from 'next-intl/server'
import { Locale} from './routing'
import { routing } from './routing'
export default getRequestConfig(async ({ requestLocale }) => {
  const locale = ((await requestLocale) ?? routing.defaultLocale) as Locale
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})