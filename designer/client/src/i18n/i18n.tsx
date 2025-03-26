import I18next, { type InitOptions } from 'i18next'
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

export const initI18n = async (settings?: InitOptions<HttpBackendOptions>) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  await I18next.use(Backend).init({ ...DEFAULT_SETTINGS, ...settings })

  I18next.services.formatter?.add('lowerFirst', lowerFirst)
  I18next.services.formatter?.add('upperFirst', upperFirst)
}

export const i18n = I18next.t
