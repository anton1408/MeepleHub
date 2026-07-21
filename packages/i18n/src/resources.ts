import enCommon from './locales/en/common.json' with { type: 'json' };

import ukCommon from './locales/uk/common.json' with { type: 'json' };

import type { Locale, Namespace } from './locales.js';

export const resources: Record<Locale, Record<Namespace, object>> = {
  en: {
    common: enCommon,
  },
  uk: {
    common: ukCommon,
  },
};
