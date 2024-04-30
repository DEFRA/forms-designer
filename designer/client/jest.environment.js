import '@testing-library/jest-dom'

import { initI18n } from './src/i18n/index.js'

beforeAll(initI18n)

beforeEach(() => {
  document.body.innerHTML = `
    <div>
      <main id="root"></main>
      <div id="portal-root"></div>
    </div>
  `
})
