import {
  localeToProfile,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOCALES_TO_LANG,
  type LocaleProfile,
} from "@/i18n/config"
import { describe, it, expect } from "vitest"

describe("SUPPORTED_LOCALES", () => {
  it("should have at least one supported locale", () => {
    expect(SUPPORTED_LOCALES.length).toBeGreaterThan(0)
  })

  it("should contain all keys from localeToProfile", () => {
    expect(SUPPORTED_LOCALES).toEqual(Object.keys(localeToProfile))
  })

  it("should contain valid locale profiles for all supported locales", () => {
    SUPPORTED_LOCALES.forEach((locale) => {
      const profile = localeToProfile[locale]
      expect(profile).toBeDefined()
    })
  })

  it("should contain all locale keys as lowercase", () => {
    SUPPORTED_LOCALES.forEach((localeKey) => expect(localeKey).toBe(localeKey.toLowerCase()))
  })

  it("should have all locale keys complaint with BCP-47", () => {
    SUPPORTED_LOCALES.forEach((localKey) => {
      expect(() => new Intl.Locale(localKey)).not.toThrow()
    })
  })
})

describe("DEFAULT_LOCALE", () => {
  it("should have a default locale defined", () => {
    const defaultLocaleProfile: LocaleProfile = localeToProfile[DEFAULT_LOCALE]
    expect(defaultLocaleProfile).toBeDefined()
    expect(defaultLocaleProfile.default).toBe(true)
  })

  it("should be a supported locale", () => {
    expect(SUPPORTED_LOCALES).toContain(DEFAULT_LOCALE)
  })

  it.todo("should be set to locale with default property set to true", () => {
    // mostly will require us to create a function that gets the default locale
  })

  it.todo("should fallback to the first supported locale if no default is set", () => {
    // mostly will require us to create a function that gets the default locale
  })
})

describe("LOCALES_TO_LANG", () => {
  it("should map each locale to its langTag", () => {
    SUPPORTED_LOCALES.forEach((locale) => {
      expect(LOCALES_TO_LANG[locale]).toBe(localeToProfile[locale].langTag)
    })
  })

  it("should have all langTags complaint with BCP-47", () => {
    const langTags = Object.values(LOCALES_TO_LANG)
    langTags.forEach((langTag) => {
      expect(() => new Intl.Locale(langTag)).not.toThrow()
    })
  })
})
