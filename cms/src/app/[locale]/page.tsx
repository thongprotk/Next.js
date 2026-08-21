import { getServerTranslation } from "@/i18n/server";
import { Package, FileText, TrendingUp, ShoppingCart, Receipt, Calculator, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getLocalizedPath } from "@/i18n/utils";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getServerTranslation(locale, "home");
  const { t: tc } = await getServerTranslation(locale, "common");

  const quickLinks = [
    {
      href: "/products",
      label: tc("nav.products"),
      icon: Package,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      href: "/sales",
      label: tc("nav.sales"),
      icon: FileText,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    {
      href: "/purchases",
      label: tc("nav.purchases"),
      icon: ShoppingCart,
      color: "text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400",
    },
    {
      href: "/expenses",
      label: tc("nav.expenses"),
      icon: Receipt,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400",
    },
    {
      href: "/tax",
      label: tc("nav.tax"),
      icon: Calculator,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400",
    },
    {
      href: "/analytics",
      label: tc("nav.analytics"),
      icon: TrendingUp,
      color: "text-teal-600 bg-teal-50 dark:bg-teal-500/10 dark:text-teal-400",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={getLocalizedPath(locale, href)}
            className="group flex items-center gap-4 rounded-2xl bg-card p-5 shadow-(--shadow-soft) ring-1 ring-foreground/5 transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-soft-lg)"
          >
            <span className={`shrink-0 rounded-2xl p-3 ${color}`}>
              <Icon className="size-5" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="font-medium text-foreground">{label}</span>
              <span className="text-sm text-muted-foreground">
                {locale === "vi" ? `Quản lý ${label.toLowerCase()}` : `Manage ${label.toLowerCase()}`}
              </span>
            </div>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
