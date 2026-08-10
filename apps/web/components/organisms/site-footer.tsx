import { SiteSwitchers } from "@/components/organisms/site-switchers"

/**
 * The switchers and nothing else. They are global controls, so they need to
 * exist on every page — putting them in the hero would have made them
 * home-page-only, leaving no way to change language from /projects.
 */
export function SiteFooter() {
  return (
    <footer className="t-shell pt-16 pb-10">
      <SiteSwitchers />
    </footer>
  )
}
