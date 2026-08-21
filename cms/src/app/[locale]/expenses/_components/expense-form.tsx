"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import type { ExpenseCategory } from "@/lib/supabase/types";

const CATEGORIES: ExpenseCategory[] = [
  "food",
  "transport",
  "housing",
  "entertainment",
  "shopping",
  "health",
  "education",
  "utilities",
  "other",
];

export function ExpenseForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const { locale } = useParams<{ locale: string }>();
  const { t } = useTranslation(locale, "expenses");
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="size-4" />
        {t("addExpense")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addExpense")}</DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          action={async (formData) => {
            await action(formData);
            formRef.current?.reset();
            setOpen(false);
          }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">{t("date")}</span>
            <Input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">
              {t("description")} <span className="text-destructive">*</span>
            </span>
            <Input name="description" required placeholder={t("description")} />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">{t("category")}</span>
              <NativeSelect name="category" defaultValue="other">
                {CATEGORIES.map((c) => (
                  <NativeSelectOption key={c} value={c}>
                    {t(`categories.${c}`)}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">{t("amount")}</span>
              <Input name="amount" type="number" min={0} defaultValue={0} placeholder="0" />
            </label>
          </div>

          <Button type="submit" className="mt-2">
            {t("add")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
