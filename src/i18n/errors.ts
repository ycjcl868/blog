class I18nError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "I18nError"
  }
}

export class UnsupportedLocale extends I18nError {
  constructor(locale: string | undefined) {
    super(`Unsupported locale: ${locale}`)
    this.name = "UnsupportedLocaleError"
  }
}
