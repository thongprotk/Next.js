import { getServerTranslation } from "@/i18n/server";
import { getSalesInvoices } from "@/lib/supabase/sales";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calculator } from "lucide-react";
import type { SalesInvoice } from "@/lib/supabase/types";

const fmt = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function summarize(invoices: SalesInvoice[]) {
  return {
    totalRevenue: invoices.reduce((s, i) => s + i.subtotal, 0),
    vatDue: invoices.reduce((s, i) => s + i.vat_amount, 0),
    totalInclVat: invoices.reduce((s, i) => s + i.total, 0),
  };
}

export default async function TaxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getServerTranslation(locale, "tax");
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const yearInvoices = await getSalesInvoices({ from: `${year}-01-01`, to: `${year}-12-31` });
  const monthInvoices = yearInvoices.filter((inv) => inv.date.slice(0, 7) === `${year}-${month}`);

  const monthSummary = summarize(monthInvoices);
  const yearSummary = summarize(yearInvoices);

  const panels = [
    { label: t("thisMonth"), summary: monthSummary },
    { label: t("thisYear"), summary: yearSummary },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3.5">
        <span className="rounded-2xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
          <Calculator className="size-5" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {panels.map(({ label, summary }) => (
          <Card key={label}>
            <CardContent className="grid gap-4">
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("totalRevenue")}</span>
                <span className="font-medium text-foreground">{fmt.format(summary.totalRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("vatDue")}</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">{fmt.format(summary.vatDue)}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium text-foreground">{t("totalInclVat")}</span>
                <span className="text-xl font-semibold tracking-tight text-foreground">
                  {fmt.format(summary.totalInclVat)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">{t("invoices")}</h2>
        {yearInvoices.length === 0 ? (
          <p className="rounded-2xl bg-card px-6 py-14 text-center text-sm text-muted-foreground shadow-(--shadow-soft)">
            {t("empty")}
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-card shadow-(--shadow-soft)">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead className="text-right">{t("totalRevenue")}</TableHead>
                  <TableHead className="text-right">{t("vatDue")}</TableHead>
                  <TableHead className="text-right">{t("totalInclVat")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {yearInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-muted-foreground">
                      {inv.date}
                      {inv.invoice_number && (
                        <Badge variant="outline" className="ml-2">
                          {inv.invoice_number}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{fmt.format(inv.subtotal)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{fmt.format(inv.vat_amount)}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{fmt.format(inv.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
