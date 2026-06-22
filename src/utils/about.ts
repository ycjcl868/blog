import type { LocaleKey } from "@/i18n/config"
import { getEntry } from "astro:content"

/**
 * Retrieves the about page for a specific locale.
 *
 * @param locale - The locale to retrieve about page content for.
 * @returns Promise resolving to the about page entry for the specified locale or undefined if not found.
 */
export const getAboutForLocale = async (locale: LocaleKey) => getEntry("about", `about${locale}`)
