import type translation from '~/src/i18n/translations/en.translation.json' with { type: 'json' }

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof translation
    }
  }
}
