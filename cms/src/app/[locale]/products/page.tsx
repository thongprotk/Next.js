import { revalidatePath } from "next/cache";
import { getServerTranslation } from "@/i18n/server";
import { getProducts, createProduct, deleteProduct } from "@/lib/supabase/products";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-teal-50 p-3 text-teal-600">
            <Package className="size-6" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t("title")}
          </h1>
        </div>
        <ProductForm action={handleCreate} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-700">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-slate-400">
              {t("empty")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("sku")}</TableHead>
                  <TableHead>{t("unit")}</TableHead>
                  <TableHead className="text-right">{t("price")}</TableHead>
                  <TableHead>{t("description")}</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, i) => (
                  <TableRow
                    key={product.id}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                  >
                    <TableCell className="font-medium text-slate-900">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {product.sku ?? "—"}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {product.unit}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-700">
                      {currencyFmt.format(product.default_price)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-slate-500">
                      {product.description ?? "—"}
                    </TableCell>
                    <TableCell>
                      <form action={handleDelete}>
                        <input type="hidden" name="id" value={product.id} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="size-8 text-slate-400 hover:text-red-600"
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
