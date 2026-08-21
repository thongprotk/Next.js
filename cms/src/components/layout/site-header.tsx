import Link from "next/link";
import { getLocalizedPath } from "@/i18n/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getServerTranslation } from "@/i18n/server";

export async function SiteHeader({ locale }: { locale: string }) {
  const { t } = await getServerTranslation(locale, "common");

  const links = [
    { href: getLocalizedPath(locale, "/products"), label: t("nav.products") },
    { href: getLocalizedPath(locale, "/sales"), label: t("nav.sales") },
    { href: getLocalizedPath(locale, "/purchases"), label: t("nav.purchases") },
    { href: getLocalizedPath(locale, "/expenses"), label: t("nav.expenses") },
    { href: getLocalizedPath(locale, "/tax"), label: t("nav.tax") },
    { href: getLocalizedPath(locale, "/analytics"), label: t("nav.analytics") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={getLocalizedPath(locale, "/")}
          className="shrink-0 text-base font-semibold tracking-tight text-foreground"
        >
          {t("appName")}
        </Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full px-3.5 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher />
      </div>
      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </header>
  );
}
