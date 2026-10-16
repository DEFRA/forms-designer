import { i18n } from '~/src/i18n/i18n.jsx'

describe('I18n', () => {
  test('i18n translates correctly', () => {
    const translation = i18n('Test')
    expect(translation).toBe('For testing purpose, do not delete it')
  })
})
