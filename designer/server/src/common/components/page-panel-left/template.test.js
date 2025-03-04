import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Page left panel component', () => {
  let $headings = /** @type {Element[]} */ ([])
  let $keys = /** @type {Element[]} */ ([])
  let $values = /** @type {Element[]} */ ([])

  describe('With some pages', () => {
    beforeEach(() => {
      const { container } = renderMacro(
        'appPagePanelLeft',
        'page-panel-left/macro.njk',
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

  describe('With end page', () => {
    beforeEach(() => {
      const { container } = renderMacro(
        'appPagePanelLeft',
        'page-panel-left/macro.njk',
        {
          params: {
            formName: 'test-form-1',
            pageNum: 1,
            pageId: 'abcDEF',
            pageTitle: 'My title',
            rows: [],
            isEndPage: true,
            showMoveButtons: false
          }
        }
      )

      $headings = container.getAllByRole('heading')
    })

    it('should render page widget heading', () => {
      expect($headings[0]).toHaveClass('govuk-heading-m')
      expect($headings[0]).toHaveTextContent('End pages')
      expect($headings[1]).toHaveClass('govuk-summary-card__title')
      expect($headings[1]).toHaveTextContent('Check your answers')
    })
  })
})
