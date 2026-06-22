import { DEFAULT_LOCALE, localeToProfile, SUPPORTED_LOCALES, type LocaleKey } from "@/i18n/config"
import { UnsupportedLocale } from "@/i18n/errors"
import {
  buildPrefix,
  getLocaleInfo,
  getLocaleMsgs,
  getRelativeLocalePath,
  getSlugWithoutLocale,
  isLocaleKey,
  stripBaseAndLocale,
  translateFor,
} from "@/i18n/utils"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/i18n/config", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/i18n/config")>()
  return {
    ...original,
    localeToProfile: {
      es: {
        name: "Español",
        langTag: "es-ES",
        googleFontName: "Roboto",
        messages: {
          home: "casa",
          pageWithNo: "Página {no}",
        },
        direction: "ltr",
        default: true,
      },
      ja: {
        name: "日本語",
        langTag: "ja-JP",
        googleFontName: "Noto Sans JP",
        messages: {
          home: "家",
          pageWithNo: "ページ {no}",
        },
        direction: "ltr",
      },
    },
    SUPPORTED_LOCALES: ["es", "ja"],
    DEFAULT_LOCALE: "es",
  }
})

describe("translateFor", () => {
  it("should throw error if no locale is provided", () => {
    expect(() => translateFor(undefined)).toThrow(UnsupportedLocale)
  })

  it("should return a function that translates a key for the given locale", () => {
    const translate = translateFor("es")
    expect(translate("home")).toBe("casa")
  })

  it("should substitute placeholders in the translation", () => {
    const translate = translateFor("es")
    const translation = translate("pageWithNo", { no: "1" })
    expect(translation).toBe("Página 1")
  })
})

describe("getLocaleMsgs", () => {
  it("should return messages for a supported locale", () => {
    const locale = "es" as LocaleKey
    expect(getLocaleMsgs(locale, getLocaleInfo)).toEqual(localeToProfile[locale].messages)
  })

  it("should throw an error for an unsupported locale", () => {
    const locale = "unsupported" as LocaleKey
    expect(() => getLocaleMsgs(locale)).toThrow(UnsupportedLocale)
  })
})

describe("isLocaleKey", () => {
  it("should return true for supported locales", () => {
    SUPPORTED_LOCALES.forEach((locale) => {
      expect(isLocaleKey(locale)).toBe(true)
    })
  })

  it("should return false for unsupported locales", () => {
    expect(isLocaleKey("unsupported")).toBe(false)
  })

  it("should return false for undefined", () => {
    expect(isLocaleKey(undefined)).toBe(false)
  })
})

describe("getLocaleInfo", () => {
  it("should return the locale profile for a supported locale", () => {
    const locale = SUPPORTED_LOCALES[0]
    expect(getLocaleInfo(locale)).toEqual(localeToProfile[locale])
  })

  it("should throw error for an unsupported locale", () => {
    expect(() => getLocaleInfo("unsupported")).toThrowError(UnsupportedLocale)
  })

  it("should throw if no locale is provided", () => {
    expect(() => getLocaleInfo(undefined)).toThrowError(UnsupportedLocale)
  })
})

describe("getRelativeLocalePath", () => {
  it("should return the correct localized path for a default locale", () => {
    const path = getRelativeLocalePath(DEFAULT_LOCALE, "/posts/1")
    expect(path).toBe("/posts/1")
  })

  it("should return the correct localized path for a supported locale", () => {
    const path = getRelativeLocalePath("ja", "/posts/1")
    expect(path).toBe("/ja/posts/1")
  })

  it("should add a trailing slash", () => {
    const pathWithSlash = getRelativeLocalePath("ja", "/posts/1/")
    expect(pathWithSlash).toBe("/ja/posts/1/")
  })

  it("should not contain a trailing slash", () => {
    const pathWithoutSlash = getRelativeLocalePath("ja", "/posts/1")
    expect(pathWithoutSlash).toBe("/ja/posts/1")
  })

  it("should throw an error for an unsupported locale", () => {
    expect(() => getRelativeLocalePath("unsupported", "/posts/1")).toThrow()
  })

  it("should not remove trailing slash for root path `/`", () => {
    const isLocaleKey = (locale?: string): locale is LocaleKey => true
    expect(getRelativeLocalePath(DEFAULT_LOCALE, "/", { _isLocaleKey: isLocaleKey })).toBe("/")
  })

  it("should return `/` if no path supplied for default locale", () => {
    expect(getRelativeLocalePath(DEFAULT_LOCALE, undefined)).toBe("/")
  })

  it("should return `/` if empty path `` supplied for default locale", () => {
    expect(getRelativeLocalePath(DEFAULT_LOCALE, "")).toBe("/")
  })
})

describe("getSlugWithoutLocale", () => {
  it("should remove the locale prefix from the slug", () => {
    expect(getSlugWithoutLocale("ja/my-post")).toBe("my-post")
  })

  it("should return the original slug if no locale prefix is present", () => {
    expect(getSlugWithoutLocale("my-post")).toBe("my-post")
  })

  it("should handle slugs with multiple slashes", () => {
    expect(getSlugWithoutLocale("ja/category/my-post")).toBe("category/my-post")
  })

  it("should not remove parts of the slug that look like a locale", () => {
    expect(getSlugWithoutLocale("not-a-locale/my-post")).toBe("not-a-locale/my-post")
  })

  it("should return the original slug for the default locale", () => {
    expect(getSlugWithoutLocale("es/my-post")).toBe("my-post")
  })
})

describe("stripBaseAndLocale", () => {
  it("should throw error for unsupported locale", () => {
    expect(() => stripBaseAndLocale("en", "/posts/1")).toThrowError(UnsupportedLocale)
  })

  it("should throw error for undefined locale", () => {
    expect(() => stripBaseAndLocale(undefined, "/posts/1")).toThrowError(UnsupportedLocale)
  })

  describe("for '/' as Base URL", () => {
    describe("for default locale", () => {
      it("return '/' for path '/'", () => {
        const strippedPath = stripBaseAndLocale(DEFAULT_LOCALE, "/")
        expect(strippedPath).toBe("/")
      })

      it("return '/posts/1'", () => {
        const strippedPath = stripBaseAndLocale(DEFAULT_LOCALE, "/posts/1")
        expect(strippedPath).toBe("/posts/1")
      })

      it("appends trailing slash if path passed have it", () => {
        const strippedPath = stripBaseAndLocale(DEFAULT_LOCALE, "/posts/1/")
        expect(strippedPath).toBe("/posts/1/")
      })
    })

    describe("for non-default locale", () => {
      it("return '/' for path '/ja'", () => {
        const strippedPath = stripBaseAndLocale("ja", "/ja")
        expect(strippedPath).toBe("/")
      })

      it("return '/posts/1'", () => {
        const strippedPath = stripBaseAndLocale("ja", "/ja/posts/1")
        expect(strippedPath).toBe("/posts/1")
      })

      it("appends trailing slash if path passed have it", () => {
        const strippedPath = stripBaseAndLocale("ja", "/ja/posts/1/")
        expect(strippedPath).toBe("/posts/1/")
      })
    })
  })

  describe("for '/astro' as Base URL", () => {
    const _buildPrefix = (locale: LocaleKey) => buildPrefix(locale, DEFAULT_LOCALE, "/astro")

    describe("for default locale", () => {
      it("return '/' for path '/astro'", () => {
        const strippedPath = stripBaseAndLocale(DEFAULT_LOCALE, "/astro", undefined, _buildPrefix)
        expect(strippedPath).toBe("/")
      })

      it("return '/posts/1'", () => {
        const strippedPath = stripBaseAndLocale(
          DEFAULT_LOCALE,
          "/astro/posts/1",
          undefined,
          _buildPrefix,
        )
        expect(strippedPath).toBe("/posts/1")
      })

      it("appends trailing slash if path passed have it", () => {
        const strippedPath = stripBaseAndLocale(
          DEFAULT_LOCALE,
          "/astro/posts/1/",
          undefined,
          _buildPrefix,
        )
        expect(strippedPath).toBe("/posts/1/")
      })
    })

    describe("for non-default locale", () => {
      it("return '/' for path '/ja'", () => {
        const strippedPath = stripBaseAndLocale("ja", "/astro/ja", undefined, _buildPrefix)
        expect(strippedPath).toBe("/")
      })

      it("return '/posts/1'", () => {
        const strippedPath = stripBaseAndLocale("ja", "/astro/ja/posts/1", undefined, _buildPrefix)
        expect(strippedPath).toBe("/posts/1")
      })

      it("appends trailing slash if path passed have it", () => {
        const strippedPath = stripBaseAndLocale("ja", "/astro/ja/posts/1/", undefined, _buildPrefix)
        expect(strippedPath).toBe("/posts/1/")
      })
    })
  })
})

describe("buildPrefix", () => {
  describe('for root slash "/" as Base Url', () => {
    it('should return "/" for default locale "es"', () => {
      const prefix = buildPrefix(DEFAULT_LOCALE, DEFAULT_LOCALE, "/")
      expect(prefix).toBe("/")
    })

    it('should return "/ja" for non-default locale "ja"', () => {
      const prefix = buildPrefix("ja" as LocaleKey, DEFAULT_LOCALE, "/")
      expect(prefix).toBe("/ja")
    })
  })

  describe('for "/astro-paper-i18n" as Base Url', () => {
    it('should return "/astro-paper-i18n" for default locale "es"', () => {
      const prefix = buildPrefix(DEFAULT_LOCALE, DEFAULT_LOCALE, "/astro-paper-i18n")
      expect(prefix).toBe("/astro-paper-i18n")
    })

    it('should return "/astro-paper-i18n/ja" for non-default locale "ja"', () => {
      const prefix = buildPrefix("ja" as LocaleKey, DEFAULT_LOCALE, "/astro-paper-i18n")
      expect(prefix).toBe("/astro-paper-i18n/ja")
    })
  })
})
