import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Heading Component', () => {
  let $heading = /** @type {Element | null} */ (null)

  describe('With caption', () => {
    beforeEach(() => {
      const { container } = renderMacro('appHeading', 'heading/macro.njk', {
        params: {
          text: 'Services',
          caption: 'A page showing available services'
        }
      })

      $heading = container.getByRole('heading', {
        level: 1
      })
    })

    it('should render app heading component', () => {
      expect($heading).toBeInTheDocument()
    })

    it('should contain expected heading', () => {
      expect($heading).toHaveTextContent('Services')
    })

    it('should have expected heading caption', () => {
      expect(
        $heading?.querySelector("[class^='govuk-caption']")
      ).toHaveTextContent('A page showing available services')
    })
  })
})
