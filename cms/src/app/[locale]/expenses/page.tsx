import { revalidatePath } from "next/cache";
import { getServerTranslation } from "@/i18n/server";
import { getExpenses, createExpense, deleteExpense } from "@/lib/supabase/expenses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Receipt, Trash2 } from "lucide-react";
import { ExpenseForm } from "./_components/expense-form";
import type { ExpenseCategory } from "@/lib/supabase/types";

const currencyFmt = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export default async function ExpensesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getServerTranslation(locale, "expenses");
  const expenses = await getExpenses();

  async function handleCreate(formData: FormData) {
    "use server";
    await createExpense({
      date: formData.get("date") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as ExpenseCategory,
      amount: Number(formData.get("amount")) || 0,
    });
    revalidatePath(`/${locale}/expenses`);
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteExpense(id);
    revalidatePath(`/${locale}/expenses`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="rounded-2xl bg-rose-50 p-3 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            <Receipt className="size-5" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
        </div>
        <ExpenseForm action={handleCreate} />
      </div>

      {expenses.length === 0 ? (
        <p className="rounded-2xl bg-card px-6 py-14 text-center text-sm text-muted-foreground shadow-(--shadow-soft)">
          {t("empty")}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card shadow-(--shadow-soft)">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("description")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead className="text-right">{t("amount")}</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="text-muted-foreground">{expense.date}</TableCell>
                  <TableCell className="font-medium text-foreground">{expense.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{t(`categories.${expense.category}`)}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {currencyFmt.format(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={expense.id} />
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
