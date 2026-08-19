import { createClient } from "./server";
import type { Product } from "./types";

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Product;
}

export async function createProduct(
  product: Omit<Product, "id" | "created_at" | "user_id">
): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

export async function updateProduct(
  id: string,
  product: Partial<Omit<Product, "id" | "created_at" | "user_id">>
): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
