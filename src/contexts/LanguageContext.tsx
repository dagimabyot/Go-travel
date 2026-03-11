import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../constants/translations';

export type LanguageType = keyof typeof translations;

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string) => string;
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
    
    if (savedLanguage && translations[savedLanguage]) {
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

  const setLanguage = (lang: LanguageType) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem('go-travel-language', lang);
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key as keyof typeof translations['English']] || key;
  };

  const isRTL = language === 'Arabic';
  
  const availableLanguages: LanguageType[] = [
    'English',
    'Spanish',
    'Amharic',
    'French',
    'Arabic',
    'German',
    'Chinese',
    'Hindi',
    'Portuguese',
    'Russian',
    'Turkish',
    'Swahili'
  ];

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
