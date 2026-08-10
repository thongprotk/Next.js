import { languages } from "./settings";

export function getLocalizedPath(locale: string, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export function isValidLocale(locale: string): locale is (typeof languages)[number] {
  return (languages as readonly string[]).includes(locale);
}
