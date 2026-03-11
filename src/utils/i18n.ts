import { Language, AVAILABLE_LANGUAGES } from '../locales/translations';

/**
 * Detect browser's preferred language
 */
export const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  
  const languageMap: { [key: string]: Language } = {
    'en': 'English',
    'es': 'Spanish',
    'am': 'Amharic',
    'fr': 'French',
    'ar': 'Arabic',
    'de': 'German',
    'zh': 'Chinese',
    'hi': 'Hindi',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'tr': 'Turkish',
    'sw': 'Swahili'
  };

  return languageMap[browserLang] || 'English';
};

/**
 * Check if a language is RTL (Right-To-Left)
 */
export const isRTLLanguage = (language: Language): boolean => {
  return language === 'Arabic';
};

/**
 * Get language display name
 */
export const getLanguageDisplayName = (language: Language): string => {
  const displayNames: { [key in Language]: string } = {
    English: 'English',
    Spanish: 'Español',
    Amharic: 'አማርኛ',
    French: 'Français',
    Arabic: 'العربية',
    German: 'Deutsch',
    Chinese: '中文',
    Hindi: 'हिंदी',
    Portuguese: 'Português',
    Russian: 'Русский',
    Turkish: 'Türkçe',
    Swahili: 'Kiswahili'
  };

  return displayNames[language];
};

/**
 * Get language flag emoji
 */
export const getLanguageFlagEmoji = (language: Language): string => {
  const flags: { [key in Language]: string } = {
    English: '🇬🇧',
    Spanish: '🇪🇸',
    Amharic: '🇪🇹',
    French: '🇫🇷',
    Arabic: '🇸🇦',
    German: '🇩🇪',
    Chinese: '🇨🇳',
    Hindi: '🇮🇳',
    Portuguese: '🇵🇹',
    Russian: '🇷🇺',
    Turkish: '🇹🇷',
    Swahili: '🇹🇿'
  };

  return flags[language];
};

/**
 * Get all available languages with display information
 */
export const getAvailableLanguagesInfo = () => {
  return AVAILABLE_LANGUAGES.map(lang => ({
    code: lang,
    displayName: getLanguageDisplayName(lang),
    flagEmoji: getLanguageFlagEmoji(lang),
    isRTL: isRTLLanguage(lang)
  }));
};
