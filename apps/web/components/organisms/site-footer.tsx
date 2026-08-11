// /ssr, not the package root: this is a server component, and the root entry
// builds an IconContext with createContext, which server components cannot do.
import { GithubLogoIcon } from "@phosphor-icons/react/ssr"
import { SiteSwitchers } from "@/components/organisms/site-switchers"

const GITHUB_URL = "https://github.com/arthurreira"

/** The switchers and the GitHub link. */
export function SiteFooter() {
  return (
    <footer className="t-shell pb-10">
      <div className="flex flex-row items-center justify-between gap-4 border-t border-border pt-6">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <GithubLogoIcon weight="fill" className="size-5" />
        </a>

        <SiteSwitchers />
      </div>
    </footer>
  )
}
