export type ExpenseCategory =
  | "food"
  | "transport"
  | "housing"
  | "entertainment"
  | "shopping"
  | "health"
  | "education"
  | "utilities"
  | "other";

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  created_at: string;
  user_id: string;
}

export interface ExpenseSummary {
  totalSpent: number;
  totalThisMonth: number;
  totalLastMonth: number;
  averagePerDay: number;
  topCategory: ExpenseCategory | null;
  byCategory: Record<ExpenseCategory, number>;
  dailyTrend: { date: string; amount: number }[];
}

export interface Product {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
  default_price: number;
  description: string | null;
  user_id: string | null;
  created_at: string;
}

export interface SalesInvoice {
  id: string;
  invoice_number: string | null;
  date: string;
  customer_name: string | null;
  notes: string | null;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  user_id: string | null;
  created_at: string;
  items?: SalesInvoiceItem[];
}

export interface SalesInvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
}

export interface PurchaseInvoice {
  id: string;
  invoice_number: string | null;
  date: string;
  supplier_name: string | null;
  notes: string | null;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  user_id: string | null;
  created_at: string;
  items?: PurchaseInvoiceItem[];
}

export interface PurchaseInvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
}

export interface MonthlySalesData {
  month: string;
  revenue: number;
  vat: number;
  count: number;
}
