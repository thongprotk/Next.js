import { revalidatePath } from "next/cache";
import { getServerTranslation } from "@/i18n/server";
import { getProducts, createProduct, deleteProduct } from "@/lib/supabase/products";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Trash2 } from "lucide-react";
import { ProductForm } from "./_components/product-form";

const currencyFmt = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getServerTranslation(locale, "products");
  const products = await getProducts();

  async function handleCreate(formData: FormData) {
    "use server";
    await createProduct({
      name: formData.get("name") as string,
      sku: (formData.get("sku") as string) || null,
      unit: (formData.get("unit") as string) || "cái",
      default_price: Number(formData.get("default_price")) || 0,
      description: (formData.get("description") as string) || null,
    });
    revalidatePath(`/${locale}/products`);
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteProduct(id);
    revalidatePath(`/${locale}/products`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="rounded-2xl bg-teal-50 p-3 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
            <Package className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground">{products.length} {t("title").toLowerCase()}</p>
          </div>
        </div>
        <ProductForm action={handleCreate} />
      </div>

      {products.length === 0 ? (
        <p className="rounded-2xl bg-card px-6 py-14 text-center text-sm text-muted-foreground shadow-(--shadow-soft)">
          {t("empty")}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card shadow-(--shadow-soft)">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("sku")}</TableHead>
                <TableHead>{t("unit")}</TableHead>
                <TableHead className="text-right">{t("price")}</TableHead>
                <TableHead>{t("description")}</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-foreground">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.sku ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.unit}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {currencyFmt.format(product.default_price)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {product.description ?? "—"}
                  </TableCell>
                  <TableCell>
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={product.id} />
                      <Button
                        type="submit"
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
