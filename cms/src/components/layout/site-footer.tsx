import { getServerTranslation } from "@/i18n/server";

export async function SiteFooter({ locale }: { locale: string }) {
  const { t } = await getServerTranslation(locale, "common");

  return (
    <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
      {t("footer")}
    </footer>
  );
}
