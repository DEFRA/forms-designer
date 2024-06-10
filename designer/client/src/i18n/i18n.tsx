import i18next, { type InitOptions, type TOptions } from 'i18next'
import Backend from 'i18next-http-backend'

import enCommonTranslations from '~/src/i18n/translations/en.translation.json'

const interpolationFormats: Record<string, (value: string) => string> = {
  capitalise: (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
}

const DEFAULT_SETTINGS: InitOptions = {
  lng: 'en',
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false,
    format(value: string, format) {
      if (format && format in interpolationFormats) {
        return interpolationFormats[format](value)
      }

      return value
    }
  },
  resources: {
    en: {
      translation: enCommonTranslations
    }
  },
  backend: {
    loadPath: '/assets/translations/{{lng}}.{{ns}}.json'
  }
}

export const initI18n = (settings = DEFAULT_SETTINGS) =>
  i18next.use(Backend).init(settings)

export const i18n = (text: string, options?: TOptions) => {
  return i18next.t(text, options)
}
