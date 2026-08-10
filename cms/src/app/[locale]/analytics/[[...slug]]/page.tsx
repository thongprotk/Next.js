"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default function AnalyticsPage() {
  const { locale } = useParams<{ locale: string }>();
  const { t } = useTranslation(locale, "analytics");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <Badge variant="secondary">{t("badge")}</Badge>
      </div>
      <p className="max-w-xl text-sm text-muted-foreground">{t("description")}</p>

      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>{t("lastUpdated", { time: lastUpdated ?? "—" })}</CardTitle>
          <CardDescription>useTranslation(locale, &quot;analytics&quot;)</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => setLastUpdated(new Date().toLocaleTimeString(locale))}>
            {t("refresh")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
