import { beforeEach, describe, expect, test } from '@jest/globals'

import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Breadcrumbs Component', () => {
  let $breadcrumbs = /** @type {Element | null} */ (null)

  beforeEach(() => {
    const { document } = renderMacro(
      'appBreadcrumbs',
      'breadcrumbs/macro.njk',
      {
        params: {
          items: [
            {
              text: 'Deployments',
              href: '/deployments'
            },
            {
              text: 'Magic service'
            }
          ]
        }
      }
    )

    $breadcrumbs = document.querySelector('[data-testid="app-breadcrumbs"]')
  })

  test('Should render expected number of breadcrumbs', () => {
    expect(
      $breadcrumbs?.querySelectorAll(
        '[data-testid="app-breadcrumbs-list-item"]'
      )
    ).toHaveLength(2)
  })

  test('First breadcrumb should be a link', () => {
    const $firstBreadcrumbLink = $breadcrumbs
      ?.querySelector('[data-testid="app-breadcrumbs-list-item"]')
      ?.querySelector('[data-testid="app-breadcrumbs-link"]')

    expect($firstBreadcrumbLink).toHaveAttribute('href', '/deployments')
    expect($firstBreadcrumbLink).toHaveAttribute(
      'class',
      'app-breadcrumbs__link'
    )
  })

  test('Last breadcrumb should not be a link', () => {
    const $lastBreadcrumb = $breadcrumbs?.querySelector(
      '[data-testid="app-breadcrumbs-list-item"]:last-of-type'
    )

    expect($lastBreadcrumb).not.toContainHTML('class="app-breadcrumbs__link"')
  })
})
