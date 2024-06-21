import '@testing-library/jest-dom'

import { initI18n } from './src/i18n/i18n.jsx'

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

beforeAll(async () => {
  const { style } = document.documentElement

  // Add styles for GOV.UK Frontend checks
  style.setProperty('--govuk-frontend-breakpoint-mobile', '40em')
  style.setProperty('--govuk-frontend-breakpoint-tablet', '80em')

  // Flag GOV.UK Frontend as supported
  document.body.classList.add('govuk-frontend-supported')

  await initI18n()
})

beforeEach(() => {
  document.body.innerHTML = `
    <div class="app-form-portal"></div>
  `
})
