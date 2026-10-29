import type { Locale } from "./locale";
import { common } from "./dictionaries/common";
import { nav } from "./dictionaries/nav";
import { auth } from "./dictionaries/auth";
import { dashboard } from "./dictionaries/dashboard";
import { profileSettings } from "./dictionaries/profile-settings";
import { hud } from "./dictionaries/hud";
import { investigation } from "./dictionaries/investigation";
import { phasesGame } from "./dictionaries/phases-game";
import { minigames } from "./dictionaries/minigames";
import { adminPages } from "./dictionaries/admin-pages";
import { mainPages } from "./dictionaries/main-pages";
import { glossary } from "./dictionaries/glossary";

export type DictionaryTable = Record<string, Partial<Record<Locale, string>>>;

const NAMESPACES: Record<string, DictionaryTable> = {
  common,
  nav,
  auth,
  dashboard,
  profileSettings,
  hud,
  investigation,
  phasesGame,
  minigames,
  adminPages,
  mainPages,
  glossary,
};

export type TranslateVars = Record<string, string | number>;

export function translate(locale: Locale, key: string, vars?: TranslateVars): string {
  const dotIndex = key.indexOf(".");
  const namespace = dotIndex === -1 ? "" : key.slice(0, dotIndex);
  const leafKey = dotIndex === -1 ? key : key.slice(dotIndex + 1);

  const table = NAMESPACES[namespace];
  const entry = table?.[leafKey];
  const value = entry?.[locale] ?? entry?.pt ?? key;

  if (!vars) return value;
  return Object.entries(vars).reduce(
    (acc, [varName, varValue]) => acc.replaceAll(`{{${varName}}}`, String(varValue)),
    value,
  );
}
