import React, { createContext, useContext, useEffect, useState } from "react";
import { i18n, SupportedLocale, LocaleMetadata, SUPPORTED_LOCALES } from "./i18n";
import { Money } from "../../domain/pricing/money";

interface I18nContextState {
  locale: SupportedLocale;
  metadata: LocaleMetadata;
  isRTL: boolean;
  setLocale: (locale: SupportedLocale) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatCurrency: (money: Money) => string;
  formatNumber: (val: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
}

const I18nContext = createContext<I18nContextState | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(i18n.getLocale());
  const [isRTL, setIsRTLState] = useState<boolean>(i18n.isRTL());

  useEffect(() => {
    // Subscribe to engine locale change notifications
    const unsubscribe = i18n.subscribe((newLocale, newIsRTL) => {
      setLocaleState(newLocale);
      setIsRTLState(newIsRTL);
    });

    return () => unsubscribe();
  }, []);

  const handleSetLocale = async (newLocale: SupportedLocale) => {
    await i18n.setLocale(newLocale);
  };

  const contextValue: I18nContextState = {
    locale,
    metadata: SUPPORTED_LOCALES[locale] ?? SUPPORTED_LOCALES.en,
    isRTL,
    setLocale: handleSetLocale,
    t: (key, params) => i18n.t(key, params),
    formatCurrency: (money) => i18n.formatCurrency(money),
    formatNumber: (val, options) => i18n.formatNumber(val, options),
    formatDate: (date, options) => i18n.formatDate(date, options),
  };

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      locale: i18n.getLocale(),
      metadata: i18n.getMetadata(),
      isRTL: i18n.isRTL(),
      setLocale: (l: SupportedLocale) => i18n.setLocale(l),
      t: (key: string, params?: Record<string, string | number>) => i18n.t(key, params),
      formatCurrency: (money: Money) => i18n.formatCurrency(money),
      formatNumber: (val: number, options?: Intl.NumberFormatOptions) => i18n.formatNumber(val, options),
      formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => i18n.formatDate(date, options),
    };
  }
  return context;
};
