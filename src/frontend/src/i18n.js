import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend'; // To load translations from /public/locales

i18n
  // Load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(HttpApi)
  // Detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    supportedLngs: ['en', 'fr', 'es', 'ar'], // Define supported languages
    fallbackLng: 'en', // Fallback language if detected language is not supported
    debug: process.env.NODE_ENV === 'development', // Enable debug output in development
    detection: {
      // Order and from where user language should be detected
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      // Caches detection results in localStorage
      caches: ['localStorage', 'cookie'],
    },
    backend: {
      // Path where resources get loaded from
      loadPath: '/locales/{{lng}}/translation.json',
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    react: {
      useSuspense: true, // Use React Suspense for loading translations
    },
    // RTL languages
    rtl: ['ar', 'he', 'fa', 'ur']
  });

export default i18n;
