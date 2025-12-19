// Country code to language code mapping
export const countryToLanguage: Record<string, string> = {
  // Major countries and their primary languages
  IN: 'hi', // India - Hindi
  PK: 'ur', // Pakistan - Urdu
  BD: 'bn', // Bangladesh - Bengali
  US: 'en', // United States - English
  GB: 'en', // United Kingdom - English
  CA: 'en', // Canada - English
  AU: 'en', // Australia - English
  NZ: 'en', // New Zealand - English
  ES: 'es', // Spain - Spanish
  MX: 'es', // Mexico - Spanish
  AR: 'es', // Argentina - Spanish
  CO: 'es', // Colombia - Spanish
  CL: 'es', // Chile - Spanish
  PE: 'es', // Peru - Spanish
  VE: 'es', // Venezuela - Spanish
  FR: 'fr', // France - French
  BE: 'fr', // Belgium - French
  DE: 'de', // Germany - German
  AT: 'de', // Austria - German
  // Note: CH (Switzerland) and CA (Canada) have multiple languages
  // Using primary language based on browser detection instead
  IT: 'it', // Italy - Italian
  PT: 'pt', // Portugal - Portuguese
  BR: 'pt', // Brazil - Portuguese
  RU: 'ru', // Russia - Russian
  CN: 'zh', // China - Chinese
  TW: 'zh', // Taiwan - Chinese
  HK: 'zh', // Hong Kong - Chinese
  JP: 'ja', // Japan - Japanese
  KR: 'ko', // South Korea - Korean
  SA: 'ar', // Saudi Arabia - Arabic
  AE: 'ar', // UAE - Arabic
  EG: 'ar', // Egypt - Arabic
  TR: 'tr', // Turkey - Turkish
  NL: 'nl', // Netherlands - Dutch
  PL: 'pl', // Poland - Polish
  TH: 'th', // Thailand - Thai
  VN: 'vi', // Vietnam - Vietnamese
  ID: 'id', // Indonesia - Indonesian
  PH: 'tl', // Philippines - Tagalog
}

// Language code to display name and flag mapping
export const languageInfo: Record<string, { name: string; nativeName: string; flag: string }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  hi: { name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  nl: { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  pl: { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  tr: { name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  th: { name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  ur: { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
}

// Get language from country code
export function getLanguageFromCountry(countryCode: string): string {
  return countryToLanguage[countryCode.toUpperCase()] || 'en'
}

// Get language from browser language
export function getLanguageFromBrowser(browserLang: string): string {
  // Extract language code from browser language (e.g., 'en-US' -> 'en', 'hi-IN' -> 'hi')
  const langCode = browserLang.split('-')[0].toLowerCase()
  
  // Check if we support this language
  if (languageInfo[langCode]) {
    return langCode
  }
  
  return 'en' // Default to English
}

// Supported languages list
export const supportedLanguages = Object.keys(languageInfo)
