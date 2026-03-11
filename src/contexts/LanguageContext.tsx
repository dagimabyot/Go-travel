import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { translations, Language, AVAILABLE_LANGUAGES } from '../locales/translations';

export type LanguageType = Language;

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string, defaultValue?: string) => string;
  isRTL: boolean;
  availableLanguages: LanguageType[];
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>('English');
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount and detect browser language
  useEffect(() => {
    const savedLanguage = localStorage.getItem('go-travel-language') as LanguageType | null;
    
    if (savedLanguage && AVAILABLE_LANGUAGES.includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      const languageMap: { [key: string]: LanguageType } = {
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
      
      const detectedLanguage = languageMap[browserLang] || 'English';
      setLanguageState(detectedLanguage);
    }
    
    setMounted(true);
  }, []);

  // Apply RTL when language changes
  useEffect(() => {
    const isRTL = language === 'Arabic';
    const htmlElement = document.documentElement;
    
    if (isRTL) {
      htmlElement.dir = 'rtl';
      htmlElement.lang = 'ar';
    } else {
      htmlElement.dir = 'ltr';
      htmlElement.lang = language.toLowerCase();
    }
  }, [language]);

  const setLanguage = (lang: LanguageType) => {
    if (AVAILABLE_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('go-travel-language', lang);
    }
  };

  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value === 'string') {
      return value;
    }

    // Fallback to English if key not found
    if (language !== 'English') {
      value = translations['English'];
      for (const k of keys) {
        value = value?.[k];
      }
      if (typeof value === 'string') {
        return value;
      }
    }

    return defaultValue || key;
  };

  const isRTL = language === 'Arabic';
  
  const availableLanguages: LanguageType[] = AVAILABLE_LANGUAGES;

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL,
        availableLanguages
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
