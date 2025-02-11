import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Page left panel component', () => {
  let $heading = /** @type {Element | null} */ (null)
  let $rowLabel = /** @type {Element | null} */ (null)
  let $rowText = /** @type {Element | null} */ (null)

  describe('With no pages', () => {
    beforeEach(() => {
      const { container } = renderMacro(
        'pagePanelLeft',
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

      $heading = container.getByRole('heading', {
        level: 2
      })
      $rowLabel = container.getByRole('term')
      $rowText = container.getByRole('definition')
    })

    it('should render page widget heading', () => {
      expect($heading).toHaveClass('govuk-summary-card__title')
      expect($heading).toHaveTextContent('Page 1: My title')
    })

    it('should render question row', () => {
      expect($rowLabel).toHaveClass('govuk-summary-list__key')
      expect($rowLabel).toHaveTextContent('Questions')
      expect($rowText).toHaveClass('govuk-summary-list__value')
      expect($rowText).toHaveTextContent('No questions added.')
    })
  })
})
