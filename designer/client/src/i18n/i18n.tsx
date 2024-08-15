import i18next, { type InitOptions, type TOptions } from 'i18next'
import Backend from 'i18next-http-backend'
import lowerFirst from 'lodash/lowerFirst.js'
import upperFirst from 'lodash/upperFirst.js'

import enCommonTranslations from '~/src/i18n/translations/en.translation.json'

const DEFAULT_SETTINGS: InitOptions = {
  lng: 'en',
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false,
    skipOnVariables: false
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

export const initI18n = async (settings = DEFAULT_SETTINGS) => {
  await i18next.use(Backend).init(settings)

  i18next.services.formatter?.add('lowerFirst', lowerFirst)
  i18next.services.formatter?.add('upperFirst', upperFirst)
}

export const i18n = (text: string, options?: TOptions) => {
  return i18next.t(text, options)
}
