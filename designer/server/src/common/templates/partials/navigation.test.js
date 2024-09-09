import upperFirst from 'lodash/upperFirst.js'

import { renderView } from '~/test/helpers/component-helpers.js'

describe('Navigation partial', () => {
  describe('Service header', () => {
    const selectorHeader = '.one-login-header'

    it('should render by default', () => {
      const { document } = renderView('partials/navigation.njk')
      const $header = document.querySelector(selectorHeader)

      expect($header).toBeInTheDocument()
    })

    it('should render account name when authenticated', () => {
      const { document } = renderView('partials/navigation.njk', {
        context: {
          authedUser: { displayName: 'John Smith' },
          isAuthenticated: true,
          isAuthorized: false
        }
      })

      const $header = document.querySelector(selectorHeader)
      const $navLinks = $header?.querySelectorAll(
        `${selectorHeader}__nav__link`
      )

      expect($navLinks).toHaveLength(2)
      expect($navLinks?.[0]).toContainHTML('John Smith')
      expect($navLinks?.[1]).toContainHTML('Sign out')
    })

    it('should not render account name by default', () => {
      const { document } = renderView('partials/navigation.njk')

      const $header = document.querySelector(selectorHeader)
      const $navLinks = $header?.querySelectorAll(
        `${selectorHeader}__nav__link`
      )

      expect($navLinks).toHaveLength(1)
      expect($navLinks?.[0]).toContainHTML('Sign in')
    })
  })

  describe('Service navigation', () => {
    const selectorNavigation = `.service-header`

    it('should render menu when signed in and is a form user (authorized)', () => {
      const { document } = renderView('partials/navigation.njk', {
        context: {
          navigation: [],
          isAuthenticated: true,
          isAuthorized: true,
          isFormsUser: true
        }
      })

      const $navigation = document.querySelector(selectorNavigation)
      expect($navigation).toBeInTheDocument()
    })

    it.each([
      {
        example: 'signed in (unauthorized)',
        context: {
          navigation: [],
          isAuthenticated: true,
          isAuthorized: false,
          isFormsUser: false
        }
      },
      {
        example: 'signed in (not a forms user)',
        context: {
          navigation: [],
          isAuthenticated: true,
          isAuthorized: true,
          isFormsUser: false
        }
      },
      {
        example: 'signed out',
        context: {
          navigation: [],
          isAuthenticated: false,
          isAuthorized: false,
          isFormsUser: false
        }
      }
    ])('should not render menu when $example', ({ context }) => {
      const { document } = renderView('partials/navigation.njk', { context })

      const $navigation = document.querySelector(selectorNavigation)
      expect($navigation).not.toBeInTheDocument()
    })

    it('should not render menu by default', () => {
      const { document } = renderView('partials/navigation.njk')
      const $navigation = document.querySelector(selectorNavigation)

      expect($navigation).not.toBeInTheDocument()
    })
  })

  describe('Phase banner', () => {
    const selectorPhaseBanner = '.govuk-phase-banner'
    const selectorTag = '.govuk-tag'

    it.each([
      {
        context: {
          config: { phase: 'alpha' }
        }
      },
      {
        context: {
          config: { phase: 'beta' }
        }
      }
    ])(
      "should render for '$context.config.phase' phase (via config)",
      ({ context }) => {
        const { document } = renderView('partials/navigation.njk', { context })

        const $phaseBanner = document.querySelector(selectorPhaseBanner)
        const $phaseTag = $phaseBanner?.querySelector(selectorTag)

        expect($phaseBanner).toBeInTheDocument()
        expect($phaseTag).toContainHTML(upperFirst(context.config.phase))
      }
    )

    it("should not render for 'live' phase (via config)", () => {
      const { document } = renderView('partials/navigation.njk', {
        context: {
          config: { phase: 'live' }
        }
      })

      const $phaseBanner = document.querySelector(selectorPhaseBanner)
      expect($phaseBanner).not.toBeInTheDocument()
    })

    it('should not render by default', () => {
      const { document } = renderView('partials/navigation.njk')

      const $phaseBanner = document.querySelector(selectorPhaseBanner)
      expect($phaseBanner).not.toBeInTheDocument()
    })
  })
})
