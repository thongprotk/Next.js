"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { getLocalizedPath } from "@/i18n/utils";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useParams<{ locale: string }>();
  const { t } = useTranslation(locale, "common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
      <span className="rounded-xl bg-rose-50 p-3 text-rose-600">
        <AlertTriangle className="size-6" />
      </span>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-foreground">{t("error.title")}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{t("error.description")}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={reset}>{t("error.retry")}</Button>
        <Button variant="outline" nativeButton={false} render={<Link href={getLocalizedPath(locale, "/")} />}>
          {t("error.home")}
        </Button>
      </div>
    </div>
  );
}
