import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Breadcrumbs Component', () => {
  let $breadcrumbs = /** @type {Element | null} */ (null)

  beforeEach(() => {
    renderMacro('appBreadcrumbs', 'breadcrumbs/macro.njk', {
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
    })

    $breadcrumbs = document.querySelector('.app-breadcrumbs')
  })

  test('Should render expected number of breadcrumbs', () => {
    expect(
      $breadcrumbs?.querySelectorAll('.app-breadcrumbs__list-item')
    ).toHaveLength(2)
  })

  test('First breadcrumb should be a link', () => {
    const $firstBreadcrumbLink = $breadcrumbs
      ?.querySelector('.app-breadcrumbs__list-item')
      ?.querySelector('.app-breadcrumbs__link')

    expect($firstBreadcrumbLink).toHaveAttribute('href', '/deployments')
    expect($firstBreadcrumbLink).toHaveAttribute(
      'class',
      'app-breadcrumbs__link'
    )
  })

  test('Last breadcrumb should not be a link', () => {
    const $lastBreadcrumb = $breadcrumbs?.querySelector(
      '.app-breadcrumbs__list-item:last-of-type'
    )

    expect($lastBreadcrumb).not.toContainHTML('class="app-breadcrumbs__link"')
  })
})
