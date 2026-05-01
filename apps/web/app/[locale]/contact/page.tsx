import { PageHeader } from "@/components/atoms/pageHeader"
import { getTranslations, getLocale } from "next-intl/server"
import Link from "next/link"
import { buttonVariants } from "@arthurreira/ui/components/button"
import { cn } from "@arthurreira/ui/lib/utils"
import { Badge } from "@arthurreira/ui/components/badge"
import { ContactInfo } from "@/components/atoms"

export default async function ContactPage() {
    const t = await getTranslations("contact")
    const locale = await getLocale()

    const linkedInLocale = {
        'en': 'en_US',
        'fi': 'fi_FI',
        'pt-br': 'pt_BR'
    }[locale] ?? 'en_US'

    return (
        <div className="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-4 py-16">
            <div className='max-w-2xl space-y-3'>
                <PageHeader title={t("title")} />
                <Badge variant="outline"> {t("availability")}</Badge>
                <p className="text-muted-foreground">{t("subtitle")}</p>
                <ContactInfo email="arthur.ferreiramiran@gmail.com" location={t("location")} />
                <p className="text-sm text-muted-foreground">{t("responseTime")}</p>
                
                <div className="mt-6 flex flex-row gap-3">
                    <Link
                        href={`https://www.linkedin.com/in/arthur-ferreira-miranda-66815524a/?locale=${linkedInLocale}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "outline" }))}
                    >
                        {t("linkedin")}
                    </Link>
                    <Link
                        href="https://github.com/arthurreira"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "outline" }))}
                    >
                        {t("github")}
                    </Link>
                    <Link
                        href="mailto:arthur.ferreiramiran@gmail.com"
                        className={cn(buttonVariants({ variant: "default" }))}
                    >
                        {t("email")}
                    </Link>

                </div>

            </div>
        </div>
    )
}