import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Pages reorder panel component', () => {
  let $headings = /** @type {Element[]} */ ([])
  let $keys = /** @type {Element[]} */ ([])
  let $values = /** @type {Element[]} */ ([])

  describe('With some pages', () => {
    beforeEach(() => {
      const { container } = renderMacro(
        'appPagesReorderPanel',
        'pages-reorder-panel/macro.njk',
        {
          params: {
            formName: 'test-form-1',
            pageNum: 1,
            pageId: 'abcDEF',
            pageTitle: 'My title',
            rows: [{ value: { text: 'Row 1' } }, { value: { text: 'Row 2' } }],
            isEndPage: false,
            showMoveButtons: false
          }
        }
      )

      $headings = container.getAllByRole('heading')
      $keys = container.getAllByRole('term')
      $values = container.getAllByRole('definition')
    })

    it('should render page widget heading', () => {
      expect($headings[0]).toHaveClass('govuk-summary-card__title')
      expect($headings[0]).toHaveTextContent('Page 1: My title')
    })

    it('should render question rows', () => {
      expect($keys[0]).toHaveClass('govuk-summary-list__key')
      expect($values[0]).toHaveTextContent('Row 1')
      expect($keys[1]).toHaveClass('govuk-summary-list__key')
      expect($values[1]).toHaveTextContent('Row 2')
    })
  })
})
