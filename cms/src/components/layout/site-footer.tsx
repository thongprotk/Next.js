import { getServerTranslation } from "@/i18n/server";

export async function SiteFooter({ locale }: { locale: string }) {
  const { t } = await getServerTranslation(locale, "common");

  return (
    <footer className="py-10 text-center text-xs text-muted-foreground/80">
      {t("footer")}
    </footer>
  );
}
