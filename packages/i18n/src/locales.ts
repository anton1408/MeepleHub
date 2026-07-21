export const locales = ['en', 'uk'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const namespaces = ['common'] as const;

export type Namespace = (typeof namespaces)[number];

export const defaultNamespace: Namespace = 'common';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  uk: 'Українська',
};
