require('@testing-library/jest-dom')
require('../test/testServer')
const { initI18n } = require('./src/i18n')

initI18n()

beforeEach(() => {
  document.body.innerHTML = `
    <div>
      <main id="root"></main>
      <div id="portal-root"></div>
    </div>
  `
})
