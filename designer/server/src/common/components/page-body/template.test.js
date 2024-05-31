import { beforeEach, describe, expect, test } from '@jest/globals'
import { outdent } from 'outdent'

import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Page body component', () => {
  let $heading = /** @type {Element | null} */ (null)
  let $paragraph = /** @type {Element | null} */ (null)

  describe('With child content', () => {
    beforeEach(() => {
      const { document } = renderMacro('appPageBody', 'page-body/macro.njk', {
        callBlock: outdent`
          <h1 class="govuk-heading-xl">
            You have signed out
          </h1>
          <p class="govuk-body-l">
            Sign in to access and create forms.
          </p>
        `
      })

      $heading = document.querySelector('h1')
      $paragraph = document.querySelector('p')
    })

    test('Should render child heading', () => {
      expect($heading).toHaveClass('govuk-heading-xl')
      expect($heading).toHaveTextContent('You have signed out')
    })

    test('Should render child paragraph', () => {
      expect($paragraph).toHaveClass('govuk-body-l')
      expect($paragraph).toHaveTextContent(
        'Sign in to access and create forms.'
      )
    })
  })

  describe('With child content and heading', () => {
    beforeEach(() => {
      const { document } = renderMacro('appPageBody', 'page-body/macro.njk', {
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

      $heading = document.querySelector('h1')
      $paragraph = document.querySelector('p')
    })

    test('Should render configured heading', () => {
      expect($heading).toHaveClass('govuk-heading-xl')
      expect($heading).toHaveTextContent('You have signed out')
    })

    test('Should render child paragraph', () => {
      expect($paragraph).toHaveClass('govuk-body-l')
      expect($paragraph).toHaveTextContent(
        'Sign in to access and create forms.'
      )
    })
  })
})
