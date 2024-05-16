import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Page Body Component', () => {
  /** @type {HTMLElement | null} */
  let $pageBody = null

  /** @type {NodeListOf<HTMLElement>} */
  let $rows

  /** @type {NodeListOf<HTMLElement>} */
  let $columns

  describe('With child content', () => {
    beforeEach(() => {
      const { document } = renderMacro('appPageBody', 'page-body/macro.njk', {
        params: {
          attributes: {
            'data-testid': 'app-page-body'
          }
        },
        callBlock:
          '<p class="govuk-body">Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.</p>'
      })

      $pageBody = document.querySelector('[data-testid="app-page-body"]')
    })

    test('Should render expected page body', () => {
      expect($pageBody).toContainHTML(
        '<p class="govuk-body">Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.</p>'
      )
    })
  })

  describe('With text param', () => {
    beforeEach(() => {
      const { document } = renderMacro('appPageBody', 'page-body/macro.njk', {
        params: {
          text: 'Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.',
          attributes: {
            'data-testid': 'app-page-body'
          }
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
          html: '<p class="govuk-body">Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.</p>',
          attributes: {
            'data-testid': 'app-page-body'
          }
        }
      })

      $pageBody = document.querySelector('[data-testid="app-page-body"]')
    })

    test('Should render expected page body', () => {
      expect($pageBody).toContainHTML(
        '<p class="govuk-body">Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.</p>'
      )
    })
  })

  describe('With multiple rows', () => {
    beforeEach(() => {
      const { document } = renderMacro('appPageBody', 'page-body/macro.njk', {
        params: [
          {
            text: 'Row 1, Column 1'
          },
          {
            text: 'Row 2, Column 1'
          }
        ]
      })

      $rows = document.querySelectorAll('.govuk-grid-row')
      $columns = document.querySelectorAll("[class^='govuk-grid-column']")
    })

    test('Should render 2 rows', () => {
      expect($rows).toHaveLength(2)
    })

    test('Should render 1 column per row', () => {
      expect($columns).toHaveLength(2)

      expect($rows[0]).toContainElement($columns[0])
      expect($rows[1]).toContainElement($columns[1])
    })

    test('Should render expected contents', () => {
      expect($columns[0]).toContainHTML('Row 1, Column 1')
      expect($columns[1]).toContainHTML('Row 2, Column 1')
    })
  })

  describe('With multiple rows and columns', () => {
    beforeEach(() => {
      const { document } = renderMacro('appPageBody', 'page-body/macro.njk', {
        params: [
          [
            {
              text: 'Row 1, Column 1'
            },
            {
              text: 'Row 1, Column 2'
            }
          ],
          [
            {
              text: 'Row 2, Column 1'
            },
            {
              text: 'Row 2, Column 2'
            }
          ]
        ]
      })

      $rows = document.querySelectorAll('.govuk-grid-row')
      $columns = document.querySelectorAll("[class^='govuk-grid-column']")
    })

    test('Should render 2 rows', () => {
      expect($rows).toHaveLength(2)
    })

    test('Should render 2 columns per row', () => {
      expect($columns).toHaveLength(4)

      expect($rows[0]).toContainElement($columns[0])
      expect($rows[0]).toContainElement($columns[1])
      expect($rows[1]).toContainElement($columns[2])
      expect($rows[1]).toContainElement($columns[3])
    })

    test('Should render expected contents', () => {
      expect($columns[0]).toContainHTML('Row 1, Column 1')
      expect($columns[1]).toContainHTML('Row 1, Column 2')
      expect($columns[2]).toContainHTML('Row 2, Column 1')
      expect($columns[3]).toContainHTML('Row 2, Column 2')
    })
  })
})
