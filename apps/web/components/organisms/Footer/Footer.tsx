import { getTranslations } from "next-intl/server"

export async function Footer() {
    const t = await getTranslations("topBar")

    return (
        <footer className=" fixed bottom-0 py-2  w-full bg-background/80 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-4">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm text-muted-foreground">
                    <span className="text-primary">© {new Date().getFullYear()} Arthurreira</span>

                    <span className="hidden md:inline">({t("darkModeHint")})</span>
                </div>
            </div>
        </footer>
    )
}
