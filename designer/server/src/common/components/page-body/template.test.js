import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Page Body Component', () => {
  let $pageBody = /** @type {Element | null} */ (null)

  describe('With child content', () => {
    beforeEach(() => {
      const { document } = renderMacro('appPageBody', 'page-body/macro.njk', {
        callBlock:
          '<p>Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.</p>'
      })

      $pageBody = document.querySelector('[data-testid="app-page-body"]')
    })

    test('Should render expected page body', () => {
      expect($pageBody).toContainHTML(
        '<p>Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.</p>'
      )
    })
  })

  describe('With text param', () => {
    beforeEach(() => {
      const { document } = renderMacro('appPageBody', 'page-body/macro.njk', {
        params: {
          text: 'Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.'
        }
      })

      $pageBody = document.querySelector('[data-testid="app-page-body"]')
    })

    test('Should render expected page body', () => {
      expect($pageBody).toHaveTextContent(
        'Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.'
      )
    })
  })

  describe('With html param', () => {
    beforeEach(() => {
      const { document } = renderMacro('appPageBody', 'page-body/macro.njk', {
        params: {
          html: '<p>Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.</p>'
        }
      })

      $pageBody = document.querySelector('[data-testid="app-page-body"]')
    })

    test('Should render expected page body', () => {
      expect($pageBody).toContainHTML(
        '<p>Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.</p>'
      )
    })
  })
})
