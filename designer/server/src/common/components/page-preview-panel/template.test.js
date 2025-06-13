import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Page preview panel component', () => {
  let $headings = /** @type {Element[]} */ ([])

  describe('With some pages', () => {
    beforeEach(() => {
      const params = /** @type {PagePreviewPanelMacro} */ ({
        /**
         * @readonly
         */
        pageTitle: { classes: 'highlight', text: 'My title' },
        /**
         * @readonly
         */
        components: [],
        /**
         * @readonly
         */
        guidance: {
          text: '',
          classes: ''
        }
      })
      const { container } = renderMacro(
        'appPagePreviewPanel',
        'page-preview-panel/macro.njk',
        {
          params
        }
      )

      $headings = container.getAllByRole('heading')
      // $keys = container.getAllByRole('term')
      // $values = container.getAllByRole('definition')
    })

    it('should render page widget heading', () => {
      expect($headings[1]).toHaveClass('govuk-heading-l highlight')
      expect($headings[1]).toHaveTextContent('My title')
    })

    // it('should render question rows', () => {
    //   expect($keys[0]).toHaveClass('govuk-summary-list__key')
    //   expect($values[0]).toHaveTextContent('Row 1')
    //   expect($keys[1]).toHaveClass('govuk-summary-list__key')
    //   expect($values[1]).toHaveTextContent('Row 2')
    // })
  })
})

/**
 * @import { PagePreviewPanelMacro } from "@defra/forms-model";
 */
