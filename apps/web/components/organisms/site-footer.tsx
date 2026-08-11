// /ssr, not the package root: this is a server component, and the root entry
// builds an IconContext with createContext, which server components cannot do.
import { GithubLogoIcon } from "@phosphor-icons/react/ssr"
import { SiteSwitchers } from "@/components/organisms/site-switchers"

const GITHUB_URL = "https://github.com/arthurreira"

/**
 * The switchers and the GitHub link. They are global controls, so they need to
 * exist on every page — putting them in the hero would have made them
 * home-page-only, leaving no way to change language from /projects.
 *
 * GitHub sits here rather than in the top-right corner: the nav is navigation,
 * and this is an external destination.
 */
export function SiteFooter() {
  return (
    <footer className="t-shell  pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <SiteSwitchers />

      
      </div>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <GithubLogoIcon weight="fill" className="size-5" />
        </a>
    </footer>
  )
}
