import { DEFAULT_LANGUAGE, dictionaries, normalizeLanguage } from "./locales/index.js";

let currentLanguage = DEFAULT_LANGUAGE;

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(language) {
  currentLanguage = normalizeLanguage(language);
}

export default function translate(template, replacements) {
  const dictionary = dictionaries[currentLanguage] || {};
  let translated = dictionary[template] || template;

  if (replacements) {
    Object.entries(replacements).forEach(([key, value]) => {
      translated = translated.replaceAll(`{${key}}`, value);
    });
  }

  return translated;
}
