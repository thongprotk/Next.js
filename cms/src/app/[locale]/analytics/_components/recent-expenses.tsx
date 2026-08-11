import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Expense } from "@/lib/supabase/types";
import { format, parseISO } from "date-fns";

interface RecentExpensesProps {
  expenses: Expense[];
  title: string;
  categoryLabels: Record<string, string>;
}

const BADGE_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  food: "default",
  transport: "secondary",
  housing: "outline",
  entertainment: "destructive",
  shopping: "default",
  health: "secondary",
  education: "outline",
  utilities: "secondary",
  other: "outline",
};

export function RecentExpenses({ expenses, title, categoryLabels }: RecentExpensesProps) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expenses yet.</p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{expense.description}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={BADGE_VARIANTS[expense.category] ?? "outline"} className="text-xs">
                      {categoryLabels[expense.category] ?? expense.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(expense.date), "dd/MM/yyyy")}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-red-500">
                  -{fmt(expense.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
