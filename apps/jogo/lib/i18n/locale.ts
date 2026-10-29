export type Locale = "pt" | "en";

export const DEFAULT_LOCALE: Locale = "pt";
export const LOCALE_STORAGE_KEY = "hackudinhos-locale";

export function isLocale(value: unknown): value is Locale {
  return value === "pt" || value === "en";
}
