import { hasLocale } from "next-intl"

import { routing, type Locale } from "./routing"

/**
 * Narrows whatever arrived in the URL's first segment to a locale the app can
 * actually load messages for.
 *
 * The segment is visitor-controlled, so it is any string at all — `/admin.php`
 * reaches this as `"admin.php"`. Passing that straight through built
 * `import("../messages/admin.php.json")`, which throws at request time and
 * surfaced as a 500 rather than a 404. Falling back here only fixes the crash;
 * the 404 comes from the layout, which rejects unknown locales separately.
 */
export const resolveLocale = (requested: string | undefined): Locale =>
  hasLocale(routing.locales, requested) ? requested : routing.defaultLocale
