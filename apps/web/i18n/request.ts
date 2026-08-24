import { getRequestConfig } from "next-intl/server"

import { resolveLocale } from "./resolve-locale"

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = resolveLocale(await requestLocale)

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
