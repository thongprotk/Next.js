import { createClient } from "./server";
import type { PurchaseInvoice } from "./types";

interface CreatePurchaseInvoiceInput {
  invoice_number?: string;
  date: string;
  supplier_name?: string;
  notes?: string;
  vat_rate: number;
  items: {
    product_id?: string;
    product_name: string;
    quantity: number;
    unit_price: number;
  }[];
}

export async function createPurchaseInvoice(
  input: CreatePurchaseInvoiceInput
): Promise<PurchaseInvoice> {
  const supabase = await createClient();

  const subtotal = input.items.reduce(
    (s, i) => s + i.quantity * i.unit_price,
    0
  );
  const vatAmount = Math.round(subtotal * (input.vat_rate / 100));
  const total = subtotal + vatAmount;

  const { data: invoice, error } = await supabase
    .from("purchase_invoices")
    .insert({
      invoice_number: input.invoice_number,
      date: input.date,
      supplier_name: input.supplier_name,
      notes: input.notes,
      subtotal,
      vat_rate: input.vat_rate,
      vat_amount: vatAmount,
      total,
    })
    .select()
    .single();
  if (error) throw error;

  const items = input.items.map((i) => ({
    invoice_id: invoice.id,
    product_id: i.product_id || null,
    product_name: i.product_name,
    quantity: i.quantity,
    unit_price: i.unit_price,
    line_total: Math.round(i.quantity * i.unit_price),
  }));

  const { error: itemsError } = await supabase
    .from("purchase_invoice_items")
    .insert(items);
  if (itemsError) throw itemsError;

  return invoice as PurchaseInvoice;
}

export async function getPurchaseInvoices(options?: {
  from?: string;
  to?: string;
  limit?: number;
}): Promise<PurchaseInvoice[]> {
  const supabase = await createClient();
  let query = supabase
    .from("purchase_invoices")
    .select("*, purchase_invoice_items(*)")
    .order("date", { ascending: false });

  if (options?.from) query = query.gte("date", options.from);
  if (options?.to) query = query.lte("date", options.to);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((d: Record<string, unknown>) => ({
    ...d,
    items: d.purchase_invoice_items,
  })) as PurchaseInvoice[];
}

export async function deletePurchaseInvoice(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("purchase_invoices")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
