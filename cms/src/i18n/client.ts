"use client";

import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next";
import { getOptions, languages, fallbackLng } from "./settings";

// Language is driven explicitly by the `lng` param (from the URL segment) via
// useTranslation() below, not auto-detected — so no language-detector plugin is used here.
i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init(getOptions());

export function useTranslation(lng: string, ns: string | string[] = "common") {
  const ret = useTranslationOrg(ns);
  const { i18n } = ret;

  if (i18n.resolvedLanguage !== lng && languages.includes(lng as (typeof languages)[number])) {
    i18n.changeLanguage(lng);
  } else if (!languages.includes(lng as (typeof languages)[number])) {
    i18n.changeLanguage(fallbackLng);
  }

  return ret;
}
