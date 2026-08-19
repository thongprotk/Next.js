import { getServerTranslation } from "@/i18n/server";
import { getPurchaseInvoices, createPurchaseInvoice, deletePurchaseInvoice } from "@/lib/supabase/purchases";
import { getProducts } from "@/lib/supabase/products";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ShoppingCart, Trash2 } from "lucide-react";
import { PurchaseForm } from "./_components/purchase-form";

const fmt = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export default async function PurchasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getServerTranslation(locale, "purchases");
  const [invoices, products] = await Promise.all([
    getPurchaseInvoices(),
    getProducts(),
  ]);

  async function handleCreate(formData: FormData) {
    "use server";
    const date = formData.get("date") as string;
    const invoiceNumber = formData.get("invoice_number") as string;
    const supplierName = formData.get("supplier_name") as string;
    const notes = formData.get("notes") as string;
    const itemsJson = formData.get("items") as string;
    const items = JSON.parse(itemsJson) as {
      product_id?: string;
      product_name: string;
      quantity: number;
      unit_price: number;
    }[];

    await createPurchaseInvoice({
      date,
      invoice_number: invoiceNumber || undefined,
      supplier_name: supplierName || undefined,
      notes: notes || undefined,
      vat_rate: 10,
      items,
    });

    revalidatePath(`/${locale}/purchases`);
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deletePurchaseInvoice(id);
    revalidatePath(`/${locale}/purchases`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-orange-50 p-3 text-orange-600">
          <ShoppingCart className="size-6" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h1>
      </div>

      <PurchaseForm
        products={products}
        createAction={handleCreate}
        translations={{
          createInvoice: t("createInvoice"),
          date: t("date"),
          invoiceNumber: t("invoiceNumber"),
          supplier: t("supplier"),
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
            <p className="py-8 text-center text-sm text-slate-500">
              {t("empty")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("invoiceNumber")}</TableHead>
                  <TableHead>{t("supplier")}</TableHead>
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
                    <TableCell>{inv.supplier_name ?? "—"}</TableCell>
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
                      <form action={handleDelete}>
                        <input type="hidden" name="id" value={inv.id} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="size-4" />
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
