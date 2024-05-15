import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Heading Component', () => {
  let $heading = /** @type {Element | null} */ (null)

  describe('With caption', () => {
    beforeEach(() => {
      const { document } = renderMacro('appHeading', 'heading/macro.njk', {
        params: {
          text: 'Services',
          caption: 'A page showing available services'
        }
      })

      $heading = document.querySelector('h1')
    })

    test('Should render app heading component', () => {
      expect($heading).not.toBeNull()
    })

    test('Should contain expected heading', () => {
      expect($heading).toHaveTextContent('Services')
    })

    test('Should have expected heading caption', () => {
      expect(
        $heading?.querySelector("[class^='govuk-caption']")
      ).toHaveTextContent('A page showing available services')
    })
  })
})
