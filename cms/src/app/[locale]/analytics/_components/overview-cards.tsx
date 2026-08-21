import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Receipt, Wallet, PiggyBank } from "lucide-react";

interface OverviewCardsProps {
  revenueYtd: number;
  vatYtd: number;
  totalExpenses: number;
  netProfit: number;
  labels: {
    revenueYtd: string;
    vatYtd: string;
    totalExpenses: string;
    netProfit: string;
  };
}

export function OverviewCards({ revenueYtd, vatYtd, totalExpenses, netProfit, labels }: OverviewCardsProps) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

  const cards = [
    {
      label: labels.revenueYtd,
      value: revenueYtd,
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    {
      label: labels.vatYtd,
      value: vatYtd,
      icon: Receipt,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400",
    },
    {
      label: labels.totalExpenses,
      value: totalExpenses,
      icon: Wallet,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400",
    },
    {
      label: labels.netProfit,
      value: netProfit,
      icon: PiggyBank,
      color:
        netProfit >= 0
          ? "text-teal-600 bg-teal-50 dark:bg-teal-500/10 dark:text-teal-400"
          : "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">{label}</span>
              <p className="text-xl font-semibold tracking-tight text-foreground">{fmt(value)}</p>
            </div>
            <span className={`rounded-xl p-2.5 ${color}`}>
              <Icon className="size-4" />
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
