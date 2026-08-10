"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { cookieName, languages, type Language } from "@/i18n/settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LOCALE_LABELS: Record<Language, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams<{ locale: string }>();

  function onChange(next: string | null) {
    if (!next) return;
    document.cookie = `${cookieName}=${next}; path=/; max-age=31536000`;
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
    router.refresh();
  }

  return (
    <Select value={locale} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-35">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((l) => (
          <SelectItem key={l} value={l}>
            {LOCALE_LABELS[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
