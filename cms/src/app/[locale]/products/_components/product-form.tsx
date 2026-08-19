"use client";

import { useRef } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

export function ProductForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const { locale } = useParams<{ locale: string }>();
  const { t } = useTranslation(locale, "products");
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
          <Plus className="size-4" />
          {t("addProduct")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addProduct")}</DialogTitle>
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
            <span className="text-sm font-medium text-slate-700">
              {t("name")} <span className="text-red-500">*</span>
            </span>
            <Input name="name" required placeholder={t("name")} />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">
                {t("sku")}
              </span>
              <Input name="sku" placeholder={t("sku")} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">
                {t("unit")}
              </span>
              <Input name="unit" defaultValue="cái" placeholder={t("unit")} />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              {t("price")}
            </span>
            <Input
              name="default_price"
              type="number"
              min={0}
              defaultValue={0}
              placeholder="0"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              {t("description")}
            </span>
            <Input name="description" placeholder={t("description")} />
          </label>

          <Button type="submit" className="mt-2 bg-teal-600 hover:bg-teal-700">
            {t("add")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
