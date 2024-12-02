import { outdent } from 'outdent'

import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Page body component', () => {
  let $heading = /** @type {Element | null} */ (null)
  let $paragraph = /** @type {Element | null} */ (null)

  describe('With child content', () => {
    beforeEach(() => {
      const { container } = renderMacro('appPageBody', 'page-body/macro.njk', {
        callBlock: outdent`
          <h1 class="govuk-heading-xl">
            You have signed out
          </h1>
          <p class="govuk-body-l">
            Sign in to access and create forms.
          </p>
        `
      })

      $heading = container.getByRole('heading', {
        level: 1
      })

      $paragraph = container.getByRole('paragraph')
    })

    it('should render child heading', () => {
      expect($heading).toHaveClass('govuk-heading-xl')
      expect($heading).toHaveTextContent('You have signed out')
    })

    it('should render child paragraph', () => {
      expect($paragraph).toHaveClass('govuk-body-l')
      expect($paragraph).toHaveTextContent(
        'Sign in to access and create forms.'
      )
    })
  })

  describe('With child content and heading', () => {
    beforeEach(() => {
      const { container } = renderMacro('appPageBody', 'page-body/macro.njk', {
        params: {
          heading: {
            text: 'You have signed out',
            caption: 'This is the one'
          }
        },
        callBlock: outdent`
          <p class="govuk-body-l">
            Sign in to access and create forms.
          </p>
        `
      })

      $heading = container.getByRole('heading', {
        level: 1
      })

      $paragraph = container.getByRole('paragraph')
    })

    it('should render configured heading', () => {
      expect($heading).toHaveClass('govuk-heading-xl')
      expect($heading).toHaveTextContent('You have signed out')
    })

    it('should render child paragraph', () => {
      expect($paragraph).toHaveClass('govuk-body-l')
      expect($paragraph).toHaveTextContent(
        'Sign in to access and create forms.'
      )
    })
  })
})
