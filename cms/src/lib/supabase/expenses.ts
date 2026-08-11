import { createClient } from "./server";
import type { Expense, ExpenseCategory, ExpenseSummary } from "./types";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  subDays,
  format,
  differenceInDays,
} from "date-fns";

export async function getExpenses(options?: {
  from?: string;
  to?: string;
  category?: ExpenseCategory;
  limit?: number;
}): Promise<Expense[]> {
  const supabase = await createClient();
  let query = supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (options?.from) query = query.gte("date", options.from);
  if (options?.to) query = query.lte("date", options.to);
  if (options?.category) query = query.eq("category", options.category);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Expense[];
}

export async function getExpenseSummary(): Promise<ExpenseSummary> {
  const now = new Date();
  const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");
  const lastMonthStart = format(startOfMonth(subMonths(now, 1)), "yyyy-MM-dd");
  const lastMonthEnd = format(endOfMonth(subMonths(now, 1)), "yyyy-MM-dd");
  const thirtyDaysAgo = format(subDays(now, 30), "yyyy-MM-dd");

  const supabase = await createClient();

  const [thisMonthRes, lastMonthRes, last30Res] = await Promise.all([
    supabase
      .from("expenses")
      .select("amount, category")
      .gte("date", monthStart)
      .lte("date", monthEnd),
    supabase
      .from("expenses")
      .select("amount")
      .gte("date", lastMonthStart)
      .lte("date", lastMonthEnd),
    supabase
      .from("expenses")
      .select("amount, category, date")
      .gte("date", thirtyDaysAgo)
      .order("date", { ascending: true }),
  ]);

  const thisMonth = (thisMonthRes.data ?? []) as { amount: number; category: ExpenseCategory }[];
  const lastMonth = (lastMonthRes.data ?? []) as { amount: number }[];
  const last30 = (last30Res.data ?? []) as { amount: number; category: ExpenseCategory; date: string }[];

  const totalThisMonth = thisMonth.reduce((s, e) => s + e.amount, 0);
  const totalLastMonth = lastMonth.reduce((s, e) => s + e.amount, 0);
  const totalSpent = last30.reduce((s, e) => s + e.amount, 0);

  const days = differenceInDays(now, new Date(thirtyDaysAgo)) || 1;
  const averagePerDay = totalSpent / days;

  const byCategory = {} as Record<ExpenseCategory, number>;
  for (const e of last30) {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
  }

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] as ExpenseCategory | null ?? null;

  const dailyMap = new Map<string, number>();
  for (const e of last30) {
    dailyMap.set(e.date, (dailyMap.get(e.date) ?? 0) + e.amount);
  }
  const dailyTrend = Array.from(dailyMap.entries()).map(([date, amount]) => ({ date, amount }));

  return {
    totalSpent,
    totalThisMonth,
    totalLastMonth,
    averagePerDay,
    topCategory,
    byCategory,
    dailyTrend,
  };
}

export async function createExpense(
  expense: Omit<Expense, "id" | "created_at" | "user_id">
): Promise<Expense> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expenses")
    .insert(expense)
    .select()
    .single();
  if (error) throw error;
  return data as Expense;
}

export async function deleteExpense(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw error;
}
