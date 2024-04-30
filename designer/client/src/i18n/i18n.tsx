import i18next, { type InitOptions, type TOptions } from 'i18next'
import Backend from 'i18next-http-backend'
import upperFirst from 'lodash/upperFirst.js'
import * as React from 'react'

import enCommonTranslations from '~/src/i18n/translations/en.translation.json'

const interpolationFormats = {
  capitalise: (value) => upperFirst(value)
}

const DEFAULT_SETTINGS: InitOptions = {
  lng: 'en',
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false,
    format: function (value, format, lng) {
      return interpolationFormats[format]?.(value) ?? value
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

export const initI18n = (
  i18n: typeof i18next = i18next,
  settings = DEFAULT_SETTINGS
) => i18n.use(Backend).init(settings)

export type I18n = (text: string, options?: any) => string

export const i18n: I18n = (text: string, options: TOptions) => {
  return i18next.t(text, options)
}

export interface WithI18nProps {
  i18n: I18n
}

export const withI18n = <P extends WithI18nProps>(
  Component: React.ComponentType<P>
) => {
  return function WithI18n(props: Omit<P, keyof WithI18nProps>) {
    return <Component {...(props as P)} i18n={i18n} />
  }
}

export const withI18nRef = (WrappedComponent) => {
  function WithI18n({ forwardedRef, ...rest }) {
    return <WrappedComponent {...rest} i18n={i18n} ref={forwardedRef} />
  }

  const forwardRef = (props, ref) =>
    React.createElement(
      WithI18n,
      Object.assign({}, props, { forwardedRef: ref })
    )
  return React.forwardRef(forwardRef)
}
