import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Pages left panel component', () => {
  let $headings = /** @type {Element[]} */ ([])
  /** @type { Element | null} */
  let $guidanceText

  describe('With guidance and some components', () => {
    beforeEach(() => {
      const { container } = renderMacro(
        'appPagePreview',
        'page-preview/macro.njk',
        {
          params: {
            pageTitle: {
              text: 'Favourite movie genre',
              classes: 'dummy-class'
            },
            guidance: {
              text: 'Guidance text',
              classes: 'guidance-classes'
            },
            components: []
          }
        }
      )

      $headings = container.getAllByRole('heading')
      // $groups = container.getAllByRole('group')
      $guidanceText = container.getByText('Guidance text')
    })

    it('should render page heading', () => {
      expect($headings[0]).toHaveClass('govuk-heading-l dummy-class')
      expect($headings[0]).toHaveTextContent('Favourite movie genre')
    })

    it('should render the guidance text', () => {
      expect($guidanceText).toHaveTextContent('Guidance text')
      expect($guidanceText).toHaveClass(
        'govuk-body govuk-!-padding-bottom-4 guidance-classes'
      )
    })
  })

  describe('Without guidance', () => {
    beforeEach(() => {
      const { container, document } = renderMacro(
        'appPagePreview',
        'page-preview/macro.njk',
        {
          params: {
            pageTitle: {
              text: 'Favourite movie genre',
              classes: 'dummy-class'
            },
            guidance: {
              text: '',
              classes: ''
            },
            components: []
          }
        }
      )

      $headings = container.getAllByRole('heading')
      $guidanceText = document.querySelector('p.govuk-body')
    })

    it('should render page heading', () => {
      expect($headings[0]).toHaveClass('govuk-heading-l dummy-class')
      expect($headings[0]).toHaveTextContent('Favourite movie genre')
    })

    it('should render the guidance text', () => {
      expect($guidanceText).toBeNull()
    })
  })
})
