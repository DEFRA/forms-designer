import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Page right panel component', () => {
  let $heading = /** @type {Element | null} */ (null)
  let $tab = /** @type {Element | null} */ (null)
  let $row = /** @type {Element | null} */ (null)

  describe('With no pages', () => {
    beforeEach(() => {
      const { document } = renderMacro(
        'pagePanelRight',
        'page-panel-right/macro.njk',
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

      $heading = document.querySelector('#dynamic-preview-content-abcDEF p')
      $tab = document.querySelector('#tab-one-abcDEF a')
      $row = document.querySelector(
        '#preview-container-inner-abcDEF  #preview-items-abcDEF'
      )
    })

    it('should render page widget heading', () => {
      expect($heading).toHaveClass('govuk-body-s')
      expect($heading).toHaveTextContent('Preview of page 1')
    })

    it('should render question row', () => {
      expect($tab).toHaveTextContent('Preview this page in a new tab')
      expect($row).toHaveTextContent('No questions available to preview.')
    })
  })
})
