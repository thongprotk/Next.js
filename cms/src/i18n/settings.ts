export const fallbackLng = "en";
export const languages = [fallbackLng, "vi"] as const;
export type Language = (typeof languages)[number];
export const defaultNS = "common";
export const cookieName = "i18next";

export function getOptions(lng: string = fallbackLng, ns: string | string[] = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
