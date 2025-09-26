import upperFirst from 'lodash/upperFirst.js'

import { renderView } from '~/test/helpers/component-helpers.js'

const contextStub = {
  getAssetPath: () => 'dummy'
}

describe('Phase banner', () => {
  const selectorPhaseBanner = '.govuk-footer__meta-custom'
  const selectorTag = '.govuk-tag'

  it.each([
    {
      context: {
        ...contextStub,
        config: { phase: 'alpha' }
      }
    },
    {
      context: {
        ...contextStub,
        config: { phase: 'beta' }
      }
    }
  ])(
    "should render for '$context.config.phase' phase (via config)",
    ({ context }) => {
      renderView('layouts/page.njk', { context })

      const $phaseBanner = document.querySelector(selectorPhaseBanner)
      const $phaseTag = $phaseBanner?.querySelector(selectorTag)

      expect($phaseBanner).toBeInTheDocument()
      expect($phaseTag).toContainHTML(upperFirst(context.config.phase))
    }
  )

  it("should not render for 'live' phase (via config)", () => {
    renderView('layouts/page.njk', {
      context: {
        ...contextStub,
        config: { phase: 'live' }
      }
    })

    const $phaseBanner = document.querySelector(selectorPhaseBanner)
    expect($phaseBanner).not.toBeInTheDocument()
  })

  it('should not render by default', () => {
    renderView('layouts/page.njk', { context: contextStub })

    const $phaseBanner = document.querySelector(selectorPhaseBanner)
    expect($phaseBanner).not.toBeInTheDocument()
  })
})
