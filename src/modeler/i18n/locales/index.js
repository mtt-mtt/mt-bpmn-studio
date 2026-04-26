import { zhTranslations } from "./zh.js";

export const DEFAULT_LANGUAGE = "zh";

export const dictionaries = {
  zh: zhTranslations,
  en: {},
};

export function normalizeLanguage(language) {
  return Object.hasOwn(dictionaries, language) ? language : DEFAULT_LANGUAGE;
}
