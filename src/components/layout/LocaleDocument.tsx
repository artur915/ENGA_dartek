"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { rtlLocales, type Locale } from "@/i18n/config";

/** Keeps `<html lang>` and `dir` in sync with the active locale. */
export function LocaleDocument() {
  const locale = useLocale();

  useEffect(() => {
    const dir = rtlLocales.includes(locale as Locale) ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  return null;
}
