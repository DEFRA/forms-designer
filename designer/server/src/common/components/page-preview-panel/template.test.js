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
    })

    it('should render page widget heading', () => {
      expect($headings[0]).toHaveClass('govuk-heading-l highlight')
      expect($headings[0]).toHaveTextContent('My title')
    })
  })
})

/**
 * @import { PagePreviewPanelMacro } from "@defra/forms-model";
 */
