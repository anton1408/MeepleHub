import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { defaultLocale, defaultNamespace, locales, namespaces, type Locale } from './locales.js';
import { resources } from './resources.js';

export interface CreateI18nOptions {
  lng?: Locale;
}

export function createI18n(options: CreateI18nOptions = {}): I18nInstance {
  const instance = i18next.createInstance();

  instance.use(initReactI18next).init({
    resources,
    lng: options.lng ?? defaultLocale,
    fallbackLng: defaultLocale,
    supportedLngs: [...locales],
    ns: [...namespaces],
    defaultNS: defaultNamespace,
    interpolation: {
      escapeValue: false,
    },
  });

  return instance;
}

export const i18n = createI18n();
