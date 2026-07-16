"use client";

import { useEffect } from "react";
import { rtlLocales, type Locale } from "@/i18n/config";

export function LocaleHtmlAttributes({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtlLocales.includes(locale) ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
