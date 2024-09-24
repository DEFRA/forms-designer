import '@testing-library/jest-dom'

import { initI18n } from '~/src/i18n/i18n.jsx'
import translation from '~/src/i18n/translations/en.translation.json'

/**
 * Polyfill `window.matchMedia()` for GOV.UK Frontend
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: true,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

/**
 * Polyfill HTMLDialogElement methods for `<Flyout>` component
 * @see {@link https://github.com/jsdom/jsdom/issues/3294}
 */
Object.defineProperties(HTMLDialogElement.prototype, {
  show: { value: jest.fn(openDialog) },
  showModal: { value: jest.fn(openDialog) },
  close: { value: jest.fn(closeDialog) }
})

/**
 * @this {HTMLElement}
 */
function openDialog() {
  this.setAttribute('open', '')
}

/**
 *
 * @this {HTMLElement}
 */
function closeDialog() {
  this.removeAttribute('open')
}

beforeAll(async () => {
  const { style } = document.documentElement

  // Add styles for GOV.UK Frontend checks
  style.setProperty('--govuk-frontend-breakpoint-mobile', '40em')
  style.setProperty('--govuk-frontend-breakpoint-tablet', '80em')

  // Flag GOV.UK Frontend as supported
  document.body.classList.add('govuk-frontend-supported')

  await initI18n({
    resources: { en: { translation } }
  })
})

beforeEach(() => {
  document.body.innerHTML = `
    <div class="app-form-portal"></div>
  `
})
