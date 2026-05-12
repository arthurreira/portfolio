import { PageHeader } from "@/components/atoms/pageHeader"
import { getTranslations, getLocale } from "next-intl/server"
import Link from "next/link"
import { Badge, buttonVariants, cn } from "@arthurreira/ui"
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
        <div className="min-h-screen flex flex-col justify-start max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-4 py-16">
                
                <PageHeader title={t("title")} />
           
            <div className='max-w-2xl space-y-3'>
                <Badge variant="outline" className="p-0"> {t("availability")}</Badge>
                <p className="text-shadow-muted-foreground text-xs ">{t("subtitle")}</p>
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