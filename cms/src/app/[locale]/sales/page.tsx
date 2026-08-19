import { revalidatePath } from "next/cache";
import { getServerTranslation } from "@/i18n/server";
import { getSalesInvoices, createSalesInvoice, deleteSalesInvoice } from "@/lib/supabase/sales";
import { getProducts } from "@/lib/supabase/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
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
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>

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

      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              {t("empty")}
            </p>
          ) : (
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
                    <TableCell>{inv.date}</TableCell>
                    <TableCell>
                      {inv.invoice_number ? (
                        <Badge variant="outline">{inv.invoice_number}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{inv.customer_name ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      {fmt.format(inv.subtotal)}
                    </TableCell>
                    <TableCell className="text-right">
                      {fmt.format(inv.vat_amount)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {fmt.format(inv.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <form action={handleDelete.bind(null, inv.id)}>
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
