import I18next, { type InitOptions, type TOptions } from 'i18next'
import Backend, { type HttpBackendOptions } from 'i18next-http-backend'
import lowerFirst from 'lodash/lowerFirst.js'
import upperFirst from 'lodash/upperFirst.js'

const DEFAULT_SETTINGS: InitOptions<HttpBackendOptions> = {
  lng: 'en',
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false,
    skipOnVariables: false
  },
  backend: {
    loadPath: '/assets/translations/{{lng}}.{{ns}}.json'
  }
}

export const initI18n = async (settings = DEFAULT_SETTINGS) => {
  await I18next.use(Backend).init(settings)

  I18next.services.formatter?.add('lowerFirst', lowerFirst)
  I18next.services.formatter?.add('upperFirst', upperFirst)
}

type TOptionsArray = Omit<TOptions, 'returnObject'> & {
  returnObjects: true
}

function i18next(text: string, options: TOptionsArray): string[]
function i18next(text: string, options?: TOptions): string
function i18next(text: string, options?: TOptions): string | string[] {
  return I18next.t(text, { ...options })
}

export const i18n = i18next
