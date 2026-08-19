import { createClient } from "./server";
import type { SalesInvoice, SalesInvoiceItem, MonthlySalesData } from "./types";

interface CreateSalesInvoiceInput {
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
}

export async function createSalesInvoice(
  input: CreateSalesInvoiceInput
): Promise<SalesInvoice> {
  const supabase = await createClient();

  const subtotal = input.items.reduce(
    (s, i) => s + i.quantity * i.unit_price,
    0
  );
  const vatAmount = Math.round(subtotal * (input.vat_rate / 100));
  const total = subtotal + vatAmount;

  const { data: invoice, error } = await supabase
    .from("sales_invoices")
    .insert({
      invoice_number: input.invoice_number,
      date: input.date,
      customer_name: input.customer_name,
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
    .from("sales_invoice_items")
    .insert(items);
  if (itemsError) throw itemsError;

  return invoice as SalesInvoice;
}

export async function getSalesInvoices(options?: {
  from?: string;
  to?: string;
  limit?: number;
}): Promise<SalesInvoice[]> {
  const supabase = await createClient();
  let query = supabase
    .from("sales_invoices")
    .select("*, sales_invoice_items(*)")
    .order("date", { ascending: false });

  if (options?.from) query = query.gte("date", options.from);
  if (options?.to) query = query.lte("date", options.to);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((d: Record<string, unknown>) => ({
    ...d,
    items: d.sales_invoice_items,
  })) as SalesInvoice[];
}

export async function deleteSalesInvoice(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("sales_invoices")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function getMonthlySalesData(
  year: number
): Promise<MonthlySalesData[]> {
  const supabase = await createClient();
  const from = `${year}-01-01`;
  const to = `${year}-12-31`;

  const { data, error } = await supabase
    .from("sales_invoices")
    .select("date, subtotal, vat_amount")
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: true });

  if (error) throw error;

  const monthly = new Map<string, MonthlySalesData>();
  for (const row of data ?? []) {
    const m = (row.date as string).slice(0, 7);
    const existing = monthly.get(m) ?? {
      month: m,
      revenue: 0,
      vat: 0,
      count: 0,
    };
    existing.revenue += row.subtotal as number;
    existing.vat += row.vat_amount as number;
    existing.count += 1;
    monthly.set(m, existing);
  }

  return Array.from(monthly.values());
}
