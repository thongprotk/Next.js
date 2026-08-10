import Link from "next/link";
import { getServerTranslation } from "@/i18n/server";
import { getLocalizedPath } from "@/i18n/utils";
import { LanguageSwitcher } from "@/components/language-switcher";

export async function SiteHeader({ locale }: { locale: string }) {
  const { t } = await getServerTranslation(locale, "common");

  const links = [
    { href: getLocalizedPath(locale, "/"), label: t("nav.home") },
    { href: getLocalizedPath(locale, "/analytics"), label: t("nav.analytics") },
  ];

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-6 px-6">
        <Link href={getLocalizedPath(locale, "/")} className="font-semibold">
          {t("appName")}
        </Link>
        <nav className="flex flex-1 items-center gap-6 text-sm text-muted-foreground">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
