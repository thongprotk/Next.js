import { getServerTranslation } from "@/i18n/server";
import { getPurchaseInvoices, createPurchaseInvoice, deletePurchaseInvoice } from "@/lib/supabase/purchases";
import { getProducts } from "@/lib/supabase/products";
import { revalidatePath } from "next/cache";
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
      <div className="flex items-center gap-3.5">
        <span className="rounded-2xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
          <ShoppingCart className="size-5" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
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
                  <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                  <TableCell>
                    {inv.invoice_number ? (
                      <Badge variant="outline">{inv.invoice_number}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-foreground">{inv.supplier_name ?? "—"}</TableCell>
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
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={inv.id} />
                      <Button
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
