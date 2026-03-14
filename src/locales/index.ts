import { en } from './en';
import { am } from './am';
import { ar } from './ar';
import { fr } from './fr';
import { it } from './it';
import { es } from './es';
import { de } from './de';
import { zh } from './zh';

export const locales = {
  en,
  am,
  ar,
  fr,
  it,
  es,
  de,
  zh,
};

export type LocaleType = typeof en;
export type LanguageCode = keyof typeof locales;
