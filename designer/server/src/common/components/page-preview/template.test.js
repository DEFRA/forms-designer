import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Pages left panel component', () => {
  let $headings = /** @type {Element[]} */ ([])
  /** @type { Element | null} */
  let $guidanceText
  /** @type { Element | null} */
  let $button = null
  /** @type { Element | null} */
  let $buttonSpan = null

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
            components: [
              {
                model: {
                  content: '<p>Some info</p>\n',
                  id: 'markdown',
                  name: 'markdown'
                },
                questionType: 'Markdown'
              }
            ]
          }
        }
      )

      $headings = container.getAllByRole('heading')
      // $groups = container.getAllByRole('group')
      $guidanceText = container.getByText('Some info')
    })

    it('should render page heading', () => {
      expect($headings[0]).toHaveClass('govuk-heading-l dummy-class')
      expect($headings[0]).toHaveTextContent('Favourite movie genre')
    })

    it('should render the guidance text', () => {
      expect($guidanceText).toHaveTextContent('Some info')
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
            components: [
              {
                model: {
                  hint: {
                    classes: '',
                    text: ''
                  },
                  id: 'inputField',
                  label: {
                    classes: 'govuk-label--l',
                    text: 'What type of farming do you do?'
                  },
                  name: 'inputField'
                },
                questionType: 'TextField'
              },
              {
                model: {
                  hint: {
                    classes: '',
                    text: ''
                  },
                  id: 'inputField',
                  label: {
                    classes: 'govuk-label--l',
                    text: 'How many acres do you have?'
                  },
                  name: 'inputField'
                },
                questionType: 'TextField'
              }
            ]
          }
        }
      )

      $headings = container.getAllByRole('heading')
      $guidanceText = document.querySelector('.app-prose-scope')
    })

    it('should render page heading', () => {
      expect($headings[0]).toHaveClass('govuk-heading-l dummy-class')
      expect($headings[0]).toHaveTextContent('Favourite movie genre')
    })

    it('should render the guidance text', () => {
      expect($guidanceText).toBeNull()
    })
  })

  describe('With section heading and repeater button', () => {
    beforeEach(() => {
      const { container, document } = renderMacro(
        'appPagePreview',
        'page-preview/macro.njk',
        {
          params: {
            pageTitle: {
              text: '',
              classes: 'dummy-class'
            },
            sectionTitle: {
              classes: 'highlight',
              text: 'Family member name'
            },
            repeaterButton: {
              classes: 'highlight',
              text: 'family member name'
            },
            components: [
              {
                model: {
                  hint: {
                    classes: '',
                    text: ''
                  },
                  id: 'inputField',
                  label: {
                    classes: 'govuk-label--l',
                    text: 'What is the name of the family member?'
                  },
                  name: 'inputField'
                },
                questionType: 'TextField'
              }
            ]
          }
        }
      )

      $headings = container.getAllByRole('heading')
      $button = container.getByRole('button')
      $buttonSpan = document.querySelector('.govuk-button span')
    })

    it('should render page heading', () => {
      expect($headings[0]).toHaveClass(
        'govuk-caption-l govuk-!-margin-top-0 highlight'
      )
      expect($headings[0]).toHaveTextContent('Family member name')
      expect($buttonSpan).toHaveClass('highlight')
      expect($button).toHaveTextContent('Add another family member name')
    })
  })
})
