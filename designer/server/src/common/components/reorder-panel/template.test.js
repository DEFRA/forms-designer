import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Reorder panel component', () => {
  let $headings = /** @type {Element[]} */ ([])
  let $buttons = /** @type {Element[]} */ ([])

  describe('With some pages', () => {
    beforeEach(() => {
      const { container } = renderMacro(
        'appReorderPanel',
        'reorder-panel/macro.njk',
        {
          params: {
            itemTypeName: 'Page',
            itemNum: 1,
            itemId: 'abcDEF',
            itemTitle: 'My title',
            actions: [
              {
                html: '<button>Up</button>'
              },
              {
                html: '<button>Down</button>'
              }
            ],
            isFocus: false
          }
        }
      )

      $headings = container.getAllByRole('heading')
      $buttons = container.getAllByRole('button')
    })

    it('should render page widget heading', () => {
      expect($headings[0]).toHaveClass('govuk-summary-card__title')
      expect($headings[0]).toHaveTextContent('Page 1: My title')
      expect($buttons[0]).toHaveTextContent('Up')
      expect($buttons[1]).toHaveTextContent('Down')
    })
  })

  describe('With some questions', () => {
    beforeEach(() => {
      const { container } = renderMacro(
        'appReorderPanel',
        'reorder-panel/macro.njk',
        {
          params: {
            itemTypeName: 'Question',
            itemNum: 1,
            itemId: 'abcDEF',
            itemTitle: 'My title',
            actions: [
              {
                html: '<button>Up</button>'
              },
              {
                html: '<button>Down</button>'
              }
            ],
            isFocus: false
          }
        }
      )

      $headings = container.getAllByRole('heading')
      $buttons = container.getAllByRole('button')
    })

    it('should render page widget heading', () => {
      expect($headings[0]).toHaveClass('govuk-summary-card__title')
      expect($headings[0]).toHaveTextContent('Question 1: My title')
      expect($buttons[0]).toHaveTextContent('Up')
      expect($buttons[1]).toHaveTextContent('Down')
    })
  })
})
