export type ExpenseCategory =
  | "food"
  | "transport"
  | "housing"
  | "entertainment"
  | "shopping"
  | "health"
  | "education"
  | "utilities"
  | "other";

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  created_at: string;
  user_id: string;
}

export interface ExpenseSummary {
  totalSpent: number;
  totalThisMonth: number;
  totalLastMonth: number;
  averagePerDay: number;
  topCategory: ExpenseCategory | null;
  byCategory: Record<ExpenseCategory, number>;
  dailyTrend: { date: string; amount: number }[];
}
