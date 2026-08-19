import { getServerTranslation } from "@/i18n/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, FileText, TrendingUp, ShoppingCart, Receipt, Calculator } from "lucide-react";
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
    { href: "/products", label: tc("nav.products"), icon: Package, color: "text-blue-600 bg-blue-50" },
    { href: "/sales", label: tc("nav.sales"), icon: FileText, color: "text-emerald-600 bg-emerald-50" },
    { href: "/purchases", label: tc("nav.purchases"), icon: ShoppingCart, color: "text-orange-600 bg-orange-50" },
    { href: "/expenses", label: tc("nav.expenses"), icon: Receipt, color: "text-rose-600 bg-rose-50" },
    { href: "/tax", label: tc("nav.tax"), icon: Calculator, color: "text-purple-600 bg-purple-50" },
    { href: "/analytics", label: tc("nav.analytics"), icon: TrendingUp, color: "text-teal-600 bg-teal-50" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h1>
        <p className="text-sm text-slate-500">{t("description")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={getLocalizedPath(locale, href)}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <span className={`rounded-xl p-3 ${color}`}>
                  <Icon className="size-6" />
                </span>
                <CardTitle className="text-lg">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">
                  {locale === "vi" ? `Quản lý ${label.toLowerCase()}` : `Manage ${label.toLowerCase()}`}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
