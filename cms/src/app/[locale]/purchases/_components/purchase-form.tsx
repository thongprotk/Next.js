"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Plus, Trash2 } from "lucide-react";
import { useInvoiceItems, type InvoiceItemProduct } from "@/hooks/use-invoice-items";

const VAT_RATE = 10;

const fmt = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

interface PurchaseFormProps {
  products: InvoiceItemProduct[];
  createAction: (formData: FormData) => Promise<void>;
  translations: {
    createInvoice: string;
    date: string;
    invoiceNumber: string;
    supplier: string;
    notes: string;
    product: string;
    quantity: string;
    unitPrice: string;
    lineTotal: string;
    addItem: string;
    subtotal: string;
    vat: string;
    total: string;
    submit: string;
  };
}

export function PurchaseForm({ products, createAction, translations: t }: PurchaseFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { items, addItem, removeItem, updateItem, selectProduct, reset, subtotal, vatAmount, total } =
    useInvoiceItems(VAT_RATE);

  async function handleSubmit(formData: FormData) {
    formData.set(
      "items",
      JSON.stringify(
        items
          .filter((i) => i.product_name.trim().length > 0)
          .map(({ product_id, product_name, quantity, unit_price }) => ({
            product_id,
            product_name,
            quantity,
            unit_price,
          }))
      )
    );
    await createAction(formData);
    formRef.current?.reset();
    reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.createInvoice}</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">{t.date}</span>
              <Input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">{t.invoiceNumber}</span>
              <Input name="invoice_number" placeholder={t.invoiceNumber} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">{t.supplier}</span>
              <Input name="supplier_name" placeholder={t.supplier} />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">{t.notes}</span>
            <Input name="notes" placeholder={t.notes} />
          </label>

          <div className="overflow-x-auto rounded-2xl bg-muted/30 p-1.5">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-left text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">{t.product}</th>
                  <th className="w-24 px-3 py-2">{t.quantity}</th>
                  <th className="w-36 px-3 py-2">{t.unitPrice}</th>
                  <th className="w-36 px-3 py-2 text-right">{t.lineTotal}</th>
                  <th className="w-10 px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.key} className="rounded-xl transition-colors hover:bg-card">
                    <td className="p-2">
                      <NativeSelect
                        value={item.product_id ?? ""}
                        onChange={(e) => {
                          const product = products.find((p) => p.id === e.target.value);
                          if (product) selectProduct(item.key, product);
                        }}
                        className="w-full"
                      >
                        <NativeSelectOption value="" disabled>
                          {t.product}
                        </NativeSelectOption>
                        {products.map((p) => (
                          <NativeSelectOption key={p.id} value={p.id}>
                            {p.name}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        min={0}
                        value={item.quantity}
                        onChange={(e) => updateItem(item.key, { quantity: Number(e.target.value) || 0 })}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        min={0}
                        value={item.unit_price}
                        onChange={(e) => updateItem(item.key, { unit_price: Number(e.target.value) || 0 })}
                      />
                    </td>
                    <td className="p-2 text-right font-medium">
                      {fmt.format(item.quantity * item.unit_price)}
                    </td>
                    <td className="p-2 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.key)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button type="button" variant="outline" className="w-fit gap-2" onClick={addItem}>
            <Plus className="size-4" />
            {t.addItem}
          </Button>

          <div className="flex justify-end">
            <div className="flex w-64 flex-col gap-1.5 rounded-2xl bg-muted/40 px-4 py-3.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{t.subtotal}</span>
                <span>{fmt.format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t.vat}</span>
                <span>{fmt.format(vatAmount)}</span>
              </div>
              <div className="flex justify-between pt-1 text-base font-semibold text-foreground">
                <span>{t.total}</span>
                <span>{fmt.format(total)}</span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-fit">
            {t.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
