import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Page left panel component', () => {
  let $heading = /** @type {Element | null} */ (null)
  let $keys = /** @type {Element[]} */ ([])
  let $values = /** @type {Element[]} */ ([])

  describe('With no pages', () => {
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

      $heading = container.getByRole('heading')
    })

    it('should render page widget heading', () => {
      expect($heading).toHaveClass('govuk-summary-card__title')
      expect($heading).toHaveTextContent('Page 1: My title')
    })
  })

  describe('With two pages', () => {
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
            rows: [{ title: 'Row 1' }, { title: 'Row 2' }],
            isEndPage: true,
            showMoveButtons: false
          }
        }
      )

      $heading = container.getByRole('heading')
      $keys = container.getAllByRole('term')
      $values = container.getAllByRole('definition')
    })

    it('should render page widget heading', () => {
      expect($heading).toHaveClass('govuk-summary-card__title')
      expect($heading).toHaveTextContent('Page 1: My title')
    })

    it('should render question rows', () => {
      expect($keys[0]).toHaveClass('govuk-summary-list__key')
      expect($values[0]).toHaveTextContent('Row 1')
      expect($keys[1]).toHaveClass('govuk-summary-list__key')
      expect($values[1]).toHaveTextContent('Row 2')
    })
  })
})
