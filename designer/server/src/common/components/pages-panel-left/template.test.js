import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Pages left panel component', () => {
  let $headings = /** @type {Element[]} */ ([])
  let $keys = /** @type {Element[]} */ ([])
  let $values = /** @type {Element[]} */ ([])
  let $pageContainers = /** @type {Element[]} */ ([])

  describe('With some pages', () => {
    beforeEach(() => {
      const { container } = renderMacro(
        'appPagesPanelLeft',
        'pages-panel-left/macro.njk',
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

  describe('With some pages that have only one question', () => {
    beforeEach(() => {
      const { container, document } = renderMacro(
        'appPagesPanelLeft',
        'pages-panel-left/macro.njk',
        {
          params: {
            formName: 'test-form-1',
            pageNum: 1,
            pageId: 'abcDEF',
            pageTitle: 'My title',
            rows: [],
            isEndPage: false,
            showMoveButtons: false
          }
        }
      )

      $headings = container.getAllByRole('heading')
      $keys = container.queryAllByRole('term')
      $values = container.queryAllByRole('definition')
      $pageContainers = Array.from(
        document.getElementsByClassName('pages-panel-left-standard')
      )
    })

    it('should render page widget heading', () => {
      expect($headings[0]).toHaveClass('govuk-summary-card__title')
      expect($headings[0]).toHaveTextContent('Page 1: My title')
    })

    it('should render question rows', () => {
      expect($keys).toHaveLength(0)
      expect($values).toHaveLength(0)
      expect($pageContainers[0].classList).toContain(
        'pages-panel-left-standard-hide-declaration'
      )
    })
  })

  describe('With end page', () => {
    beforeEach(() => {
      const { container } = renderMacro(
        'appPagesPanelLeft',
        'pages-panel-left/macro.njk',
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
      expect($headings[0]).toHaveClass('govuk-summary-card__title')
      expect($headings[0]).toHaveTextContent('My title')
    })
  })

  describe('With payment page', () => {
    beforeEach(() => {
      const { container } = renderMacro(
        'appPagesPanelLeft',
        'pages-panel-left/macro.njk',
        {
          params: {
            formName: 'test-form-1',
            pageTitle: 'Payment',
            pageEditUrl: '/library/my-form/editor-v2/page/p1/questions',
            pagePreviewUrl: '/preview/page-1?force',
            rows: [
              { key: { text: 'Payment for' }, value: { text: 'Application fee' } },
              { key: { text: 'Total amount' }, value: { text: '£100.00' } }
            ],
            isPaymentPage: true
          }
        }
      )

      $headings = container.getAllByRole('heading')
      $keys = container.getAllByRole('term')
      $values = container.getAllByRole('definition')
    })

    it('should render payment card title', () => {
      expect($headings[0]).toHaveClass('govuk-summary-card__title')
      expect($headings[0]).toHaveTextContent('Payment')
    })

    it('should render payment details', () => {
      expect($keys[0]).toHaveTextContent('Payment for')
      expect($values[0]).toHaveTextContent('Application fee')
      expect($keys[1]).toHaveTextContent('Total amount')
      expect($values[1]).toHaveTextContent('£100.00')
    })
  })

  describe('With end page (no payment)', () => {
    beforeEach(() => {
      const { container } = renderMacro(
        'appPagesPanelLeft',
        'pages-panel-left/macro.njk',
        {
          params: {
            formName: 'test-form-1',
            pageNum: 1,
            pageId: 'abcDEF',
            pageTitle: 'Check your answers',
            pageEditUrl: '/library/my-form/editor-v2/page/abcDEF/check-answers-settings',
            pagePreviewUrl: '/preview/check-answers?force',
            rows: [],
            isEndPage: true
          }
        }
      )

      $headings = container.getAllByRole('heading')
    })

    it('should render only the end page card', () => {
      expect($headings).toHaveLength(1)
      expect($headings[0]).toHaveTextContent('Check your answers')
    })
  })
})
