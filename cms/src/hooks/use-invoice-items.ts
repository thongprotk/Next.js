"use client";

import { useMemo, useState } from "react";

export interface InvoiceItemProduct {
  id: string;
  name: string;
  default_price: number;
  unit: string;
}

export interface InvoiceItemRow {
  key: number;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

let nextKey = 0;

function emptyRow(): InvoiceItemRow {
  return { key: nextKey++, product_id: undefined, product_name: "", quantity: 1, unit_price: 0 };
}

export function useInvoiceItems(vatRate: number) {
  const [items, setItems] = useState<InvoiceItemRow[]>([emptyRow()]);

  function addItem() {
    setItems((prev) => [...prev, emptyRow()]);
  }

  function removeItem(key: number) {
    setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.key !== key) : prev));
  }

  function updateItem(key: number, patch: Partial<InvoiceItemRow>) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  }

  function selectProduct(key: number, product: InvoiceItemProduct) {
    updateItem(key, {
      product_id: product.id,
      product_name: product.name,
      unit_price: product.default_price,
    });
  }

  function reset() {
    setItems([emptyRow()]);
  }

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.quantity * i.unit_price, 0),
    [items]
  );
  const vatAmount = Math.round(subtotal * (vatRate / 100));
  const total = subtotal + vatAmount;

  return { items, addItem, removeItem, updateItem, selectProduct, reset, subtotal, vatAmount, total };
}
