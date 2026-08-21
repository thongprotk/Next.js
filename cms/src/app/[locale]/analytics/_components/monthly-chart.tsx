"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlySalesData } from "@/lib/supabase/types";

interface MonthlyChartProps {
  data: MonthlySalesData[];
  title: string;
  revenueLabel: string;
  vatLabel: string;
}

export function MonthlyChart({ data, title, revenueLabel, vatLabel }: MonthlyChartProps) {
  const chartData = data.map((d) => ({
    month: d.month.slice(5),
    [revenueLabel]: d.revenue,
    [vatLabel]: d.vat,
  }));

  const fmt = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 6" className="stroke-muted" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
              />
              <Tooltip
                cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                contentStyle={{
                  borderRadius: 12,
                  fontSize: 12,
                  border: "none",
                  boxShadow: "var(--shadow-soft-lg)",
                }}
                formatter={(value) => fmt(Number(value))}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey={revenueLabel} fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} maxBarSize={36} />
              <Bar dataKey={vatLabel} fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
