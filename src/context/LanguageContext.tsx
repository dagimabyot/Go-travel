import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../constants/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('travel_language');
    if (saved) return saved;
    
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'am', 'ar', 'es', 'it', 'de', 'zh']; // Add more as they are implemented
    return supportedLangs.includes(browserLang) ? browserLang : 'en';
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('travel_language', lang);
  };

  useEffect(() => {
    // Handle RTL
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string) => {
    if (!translations[language]) {
      return translations['en']?.[key] || key;
    }
    return translations[language][key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
