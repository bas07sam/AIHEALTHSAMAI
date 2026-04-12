import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext();
const STORAGE_KEY = 'healthai-language';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en';
    } catch {
      return 'en';
    }
  });

  const isRTL = lang === 'ar';
  const t = translations[lang] || translations.en;

  // Apply lang/dir to <html> element whenever lang changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    localStorage.setItem(STORAGE_KEY, lang);

    // Set font for Arabic
    if (isRTL) {
      document.body.style.fontFamily = "var(--font-arabic)";
    } else {
      document.body.style.fontFamily = "";
    }
  }, [lang, isRTL]);

  const toggleLanguage = useCallback(() => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  }, []);

  const setLanguage = useCallback((newLang) => {
    if (newLang === 'en' || newLang === 'ar') {
      setLang(newLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, isRTL, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
