import { getServerTranslation } from "@/i18n/server";
import { getMonthlySalesData } from "@/lib/supabase/sales";
import { getExpenses } from "@/lib/supabase/expenses";
import { TrendingUp } from "lucide-react";
import { OverviewCards } from "../_components/overview-cards";
import { MonthlyChart } from "../_components/monthly-chart";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getServerTranslation(locale, "analytics");
  const year = new Date().getFullYear();

  const [monthly, expenses] = await Promise.all([
    getMonthlySalesData(year),
    getExpenses({ from: `${year}-01-01`, to: `${year}-12-31` }),
  ]);

  const revenueYtd = monthly.reduce((s, m) => s + m.revenue, 0);
  const vatYtd = monthly.reduce((s, m) => s + m.vat, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = revenueYtd - totalExpenses;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3.5">
          <span className="rounded-2xl bg-teal-50 p-3 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
            <TrendingUp className="size-5" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
        </div>
        <p className="pl-13 text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <OverviewCards
        revenueYtd={revenueYtd}
        vatYtd={vatYtd}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        labels={{
          revenueYtd: t("revenueYtd"),
          vatYtd: t("vatYtd"),
          totalExpenses: t("totalExpenses"),
          netProfit: t("netProfit"),
        }}
      />

      <MonthlyChart
        data={monthly}
        title={t("monthlyRevenue")}
        revenueLabel={t("revenue")}
        vatLabel={t("vat")}
      />
    </div>
  );
}
