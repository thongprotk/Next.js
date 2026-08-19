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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={getLocalizedPath(locale, "/")}
          className="shrink-0 text-base font-bold tracking-tight text-slate-900"
        >
          {t("appName")}
        </Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-md px-3 py-1.5 font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
