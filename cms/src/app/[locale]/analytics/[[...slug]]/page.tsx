import { getServerTranslation } from "@/i18n/server";
import { getExpenses, getExpenseSummary } from "@/lib/supabase/expenses";
import { SummaryCards } from "../_components/summary-cards";
import { SpendingChart } from "../_components/spending-chart";
import { CategoryBreakdown } from "../_components/category-breakdown";
import { RecentExpenses } from "../_components/recent-expenses";
import type { ExpenseCategory } from "@/lib/supabase/types";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AnalyticsPage({ params }: PageProps) {
  const { locale } = await params;
  const { t } = await getServerTranslation(locale, "analytics");

  let summary;
  let recentExpenses;

  try {
    [summary, recentExpenses] = await Promise.all([
      getExpenseSummary(),
      getExpenses({ limit: 10 }),
    ]);
  } catch {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("errorLoading")}</p>
      </div>
    );
  }

  const categories: ExpenseCategory[] = [
    "food", "transport", "housing", "entertainment",
    "shopping", "health", "education", "utilities", "other",
  ];
  const categoryLabels = Object.fromEntries(
    categories.map((c) => [c, t(`categories.${c}`)])
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <SummaryCards summary={summary} t={t} />

      <div className="grid gap-4 lg:grid-cols-2">
        <SpendingChart data={summary.dailyTrend} title={t("spendingTrend")} />
        <CategoryBreakdown
          data={summary.byCategory}
          title={t("byCategory")}
          categoryLabels={categoryLabels}
        />
      </div>

      <RecentExpenses
        expenses={recentExpenses}
        title={t("recentExpenses")}
        categoryLabels={categoryLabels}
      />
    </div>
  );
}
