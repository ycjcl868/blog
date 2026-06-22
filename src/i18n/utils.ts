import { UnsupportedLocale } from "@/i18n/errors"
import { type GetLocaleOptions, getRelativeLocaleUrl } from "astro:i18n"
import {
  type LocaleKey,
  type LocaleProfile,
  DEFAULT_LOCALE,
  localeToProfile,
  SUPPORTED_LOCALES,
} from "@/i18n/config"
import type { I18nKeys, I18nStrings } from "@/i18n/types"

export function translateFor(
  locale: string | undefined,
  _isLocaleKey: (locale: string | undefined) => locale is LocaleKey = isLocaleKey,
  _getLocaleMsgs: (locale: LocaleKey) => I18nStrings = getLocaleMsgs,
) {
  if (!_isLocaleKey(locale)) throw new UnsupportedLocale(locale)
  const msgs = _getLocaleMsgs(locale)

  return (key: I18nKeys, substitutions?: Record<string, string | number>) => {
    let translation = msgs[key]

    for (const key in substitutions) {
      const value = substitutions[key]
      translation = translation.replace(`{${key}}`, String(value))
    }

    return translation
  }
}

export function getLocaleMsgs(
  locale: LocaleKey,
  getLocaleConfig: (locale: LocaleKey) => LocaleProfile = getLocaleInfo,
): I18nStrings {
  return getLocaleConfig(locale).messages
}

export function isLocaleKey(
  locale: string | undefined,
  supportedLocales: LocaleKey[] = SUPPORTED_LOCALES,
): locale is LocaleKey {
  if (typeof locale !== "string") return false
  return supportedLocales.includes(locale as LocaleKey)
}

export function getLocaleInfo(
  locale?: string,
  _isLocaleKey: (locale?: string) => locale is LocaleKey = isLocaleKey,
): LocaleProfile {
  if (!_isLocaleKey(locale)) throw new UnsupportedLocale(locale)

  return localeToProfile[locale]
}

export function getRelativeLocalePath(
  locale: string | undefined,
  path: string = "/",
  {
    _isLocaleKey = isLocaleKey,
    ...options
  }: GetLocaleOptions & {
    _isLocaleKey?: (locale?: string) => locale is LocaleKey
  } = {},
): string {
  if (!_isLocaleKey(locale)) throw new UnsupportedLocale(locale)

  const localizedPath = getRelativeLocaleUrl(locale, path, options)

  const hasTrailingSlash = path.endsWith("/") || localizedPath === "/"

  if (hasTrailingSlash) return localizedPath

  return localizedPath.replace(/\/+$/, "")
}

export function stripBaseAndLocale(
  locale: string | undefined,
  path: string,
  _isLocaleKey: (locale?: string) => locale is LocaleKey = isLocaleKey,
  _buildPrefix: (locale: LocaleKey) => string = buildPrefix,
): string {
  if (!_isLocaleKey(locale)) throw new UnsupportedLocale(locale)

  const prefix = _buildPrefix(locale)

  return new URL(path.slice(prefix.length), "http://foo.com").pathname
}

export function buildPrefix(
  locale: LocaleKey,
  defaultLocale: LocaleKey = DEFAULT_LOCALE,
  baseUrl: string = import.meta.env.BASE_URL,
): string {
  const isDefaultLocale = locale === defaultLocale
  const baseWithLocale = baseUrl.replace(/\/+$/, "") + (isDefaultLocale ? "" : `/${locale}`)

  return new URL(baseWithLocale, "http://foo.com").pathname
}

export function getSlugWithoutLocale(slug: string) {
  const slugParts = slug.split("/")
  if (slugParts.length > 1 && SUPPORTED_LOCALES.includes(slugParts[0] as LocaleKey)) {
    return slugParts.slice(1).join("/")
  }
  return slug
}
