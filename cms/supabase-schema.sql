-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text,
  unit text not null default 'cái',
  default_price bigint not null default 0,
  description text,
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Sales invoices
create table if not exists sales_invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text,
  date date not null default current_date,
  customer_name text,
  notes text,
  subtotal bigint not null default 0,
  vat_rate numeric(5,2) not null default 10,
  vat_amount bigint not null default 0,
  total bigint not null default 0,
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists sales_invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references sales_invoices(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  quantity numeric(12,2) not null default 1,
  unit_price bigint not null default 0,
  line_total bigint not null default 0,
  created_at timestamptz not null default now()
);

-- Purchase invoices
create table if not exists purchase_invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text,
  date date not null default current_date,
  supplier_name text,
  notes text,
  subtotal bigint not null default 0,
  vat_rate numeric(5,2) not null default 10,
  vat_amount bigint not null default 0,
  total bigint not null default 0,
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists purchase_invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references purchase_invoices(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  quantity numeric(12,2) not null default 1,
  unit_price bigint not null default 0,
  line_total bigint not null default 0,
  created_at timestamptz not null default now()
);

-- Expenses
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  amount bigint not null default 0,
  category text not null check (category in (
    'food', 'transport', 'housing', 'entertainment', 'shopping',
    'health', 'education', 'utilities', 'other'
  )),
  description text not null,
  date date not null default current_date,
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_sales_invoices_date on sales_invoices(date);
create index if not exists idx_purchase_invoices_date on purchase_invoices(date);
create index if not exists idx_sales_invoice_items_invoice on sales_invoice_items(invoice_id);
create index if not exists idx_purchase_invoice_items_invoice on purchase_invoice_items(invoice_id);
create index if not exists idx_expenses_date on expenses(date);
