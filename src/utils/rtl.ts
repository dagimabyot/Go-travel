import { LanguageType } from '../contexts/LanguageContext';

/**
 * List of right-to-left languages
 */
const RTL_LANGUAGES: LanguageType[] = ['Arabic'];

/**
 * Check if a language is RTL
 */
export const isRTLLanguage = (language: LanguageType): boolean => {
  return RTL_LANGUAGES.includes(language);
};

/**
 * Get the text direction for a language
 */
export const getTextDirection = (language: LanguageType): 'ltr' | 'rtl' => {
  return isRTLLanguage(language) ? 'rtl' : 'ltr';
};

/**
 * Get margin utilities for RTL support
 */
export const getRTLMargin = (
  language: LanguageType,
  left?: string | number,
  right?: string | number
): { marginLeft?: string | number; marginRight?: string | number } => {
  const isRTL = isRTLLanguage(language);
  return {
    marginLeft: isRTL ? right : left,
    marginRight: isRTL ? left : right
  };
};

/**
 * Get padding utilities for RTL support
 */
export const getRTLPadding = (
  language: LanguageType,
  left?: string | number,
  right?: string | number
): { paddingLeft?: string | number; paddingRight?: string | number } => {
  const isRTL = isRTLLanguage(language);
  return {
    paddingLeft: isRTL ? right : left,
    paddingRight: isRTL ? left : right
  };
};

/**
 * Get transform for RTL flip
 */
export const getRTLTransform = (language: LanguageType): { transform?: string } => {
  const isRTL = isRTLLanguage(language);
  return {
    transform: isRTL ? 'scaleX(-1)' : undefined
  };
};

/**
 * Get alignment for RTL support
 */
export const getRTLAlign = (
  language: LanguageType,
  ltrAlign: 'left' | 'right' | 'center'
): 'left' | 'right' | 'center' => {
  const isRTL = isRTLLanguage(language);
  if (ltrAlign === 'center') return 'center';
  if (ltrAlign === 'left') return isRTL ? 'right' : 'left';
  return isRTL ? 'left' : 'right';
};
