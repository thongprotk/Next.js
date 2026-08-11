"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import type { ExpenseCategory } from "@/lib/supabase/types";

interface CategoryBreakdownProps {
  data: Record<ExpenseCategory, number>;
  title: string;
  categoryLabels: Record<string, string>;
}

const COLORS: Record<ExpenseCategory, string> = {
  food: "hsl(var(--chart-1))",
  transport: "hsl(var(--chart-2))",
  housing: "hsl(var(--chart-3))",
  entertainment: "hsl(var(--chart-4))",
  shopping: "hsl(var(--chart-5))",
  health: "hsl(142 71% 45%)",
  education: "hsl(262 83% 58%)",
  utilities: "hsl(38 92% 50%)",
  other: "hsl(0 0% 50%)",
};

export function CategoryBreakdown({ data, title, categoryLabels }: CategoryBreakdownProps) {
  const chartData = Object.entries(data)
    .map(([key, value]) => ({
      category: categoryLabels[key] ?? key,
      amount: value,
      fill: COLORS[key as ExpenseCategory] ?? "hsl(0 0% 50%)",
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 80, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
                formatter={(value) =>
                  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value))
                }
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
