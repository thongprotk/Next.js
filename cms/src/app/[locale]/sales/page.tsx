import { revalidatePath } from "next/cache";
import { getServerTranslation } from "@/i18n/server";
import { getSalesInvoices, createSalesInvoice, deleteSalesInvoice } from "@/lib/supabase/sales";
import { getProducts } from "@/lib/supabase/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Trash2 } from "lucide-react";
import { SalesForm } from "./_components/sales-form";

const fmt = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export default async function SalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getServerTranslation(locale, "sales");
  const [invoices, products] = await Promise.all([
    getSalesInvoices(),
    getProducts(),
  ]);

  async function handleCreate(input: {
    invoice_number?: string;
    date: string;
    customer_name?: string;
    notes?: string;
    vat_rate: number;
    items: {
      product_id?: string;
      product_name: string;
      quantity: number;
      unit_price: number;
    }[];
  }) {
    "use server";
    await createSalesInvoice(input);
    revalidatePath(`/${locale}/sales`);
  }

  async function handleDelete(id: string) {
    "use server";
    await deleteSalesInvoice(id);
    revalidatePath(`/${locale}/sales`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3.5">
        <span className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <FileText className="size-5" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h1>
      </div>

      <SalesForm
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          default_price: p.default_price,
          unit: p.unit,
        }))}
        onCreate={handleCreate}
        labels={{
          createInvoice: t("createInvoice"),
          date: t("date"),
          invoiceNumber: t("invoiceNumber"),
          customer: t("customer"),
          notes: t("notes"),
          product: t("product"),
          quantity: t("quantity"),
          unitPrice: t("unitPrice"),
          lineTotal: t("lineTotal"),
          addItem: t("addItem"),
          subtotal: t("subtotal"),
          vat: t("vat"),
          total: t("total"),
          submit: t("submit"),
        }}
      />

      {invoices.length === 0 ? (
        <p className="rounded-2xl bg-card px-6 py-14 text-center text-sm text-muted-foreground shadow-(--shadow-soft)">
          {t("empty")}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card shadow-(--shadow-soft)">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("invoiceNumber")}</TableHead>
                <TableHead>{t("customer")}</TableHead>
                <TableHead className="text-right">{t("subtotal")}</TableHead>
                <TableHead className="text-right">{t("vat")}</TableHead>
                <TableHead className="text-right">{t("total")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                  <TableCell>
                    {inv.invoice_number ? (
                      <Badge variant="outline">{inv.invoice_number}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-foreground">{inv.customer_name ?? "—"}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {fmt.format(inv.subtotal)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {fmt.format(inv.vat_amount)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {fmt.format(inv.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={handleDelete.bind(null, inv.id)}>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
