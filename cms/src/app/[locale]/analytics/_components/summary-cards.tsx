import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CalendarDays,
  Tag,
} from "lucide-react";
import type { ExpenseSummary } from "@/lib/supabase/types";

interface SummaryCardsProps {
  summary: ExpenseSummary;
  t: (key: string, options?: Record<string, unknown>) => string;
}

export function SummaryCards({ summary, t }: SummaryCardsProps) {
  const diff = summary.totalLastMonth
    ? ((summary.totalThisMonth - summary.totalLastMonth) / summary.totalLastMonth) * 100
    : 0;
  const isUp = diff > 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("thisMonth")}
          </CardTitle>
          <Wallet className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{fmt(summary.totalThisMonth)}</p>
          <p className={`mt-1 flex items-center gap-1 text-xs ${isUp ? "text-red-500" : "text-green-500"}`}>
            {isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {Math.abs(diff).toFixed(1)}% {t("vsLastMonth")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("last30Days")}
          </CardTitle>
          <CalendarDays className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{fmt(summary.totalSpent)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("avgPerDay")}
          </CardTitle>
          <CalendarDays className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{fmt(summary.averagePerDay)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("topCategory")}
          </CardTitle>
          <Tag className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold capitalize">
            {summary.topCategory ? t(`categories.${summary.topCategory}`) : "—"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
