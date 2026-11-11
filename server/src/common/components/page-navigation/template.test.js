import { within } from '@testing-library/dom'

import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Page navigation component', () => {
  const params = {
    extraClasses: 'app-custom-navigation',
    navItems: [
      {
        title: 'Form activity',
        href: '/admin/form-metrics/form-activity'
      },
      {
        title: 'Component usage',
        href: '/admin/form-metrics/component-usage',
        active: true
      },
      {
        title: 'Sign-in',
        href: '/admin/form-metrics/sign-in'
      }
    ]
  }

  /**
   * @param {typeof params} [overrides]
   */
  function render(overrides = {}) {
    const { document } = renderMacro(
      'appPageNavigation',
      'page-navigation/macro.njk',
      {
        params: { ...params, ...overrides }
      }
    )

    const $component = document.querySelector('.app-tab-container')

    if (!($component instanceof HTMLElement)) {
      throw new Error('Page navigation did not render')
    }

    return $component
  }

  it('should render the navigation container with extra classes', () => {
    expect(render()).toHaveClass(
      'app-tab-container',
      'app-tab-container--title-only',
      'govuk-summary-list',
      'app-custom-navigation'
    )
  })

  it('should render inactive items as labeled navigation links', () => {
    const $component = render()
    const $navigation = within($component).getAllByRole('navigation')

    expect($navigation).toHaveLength(2)
    expect($navigation[0]).toHaveAttribute('aria-label', 'Form activity')
    expect(within($navigation[0]).getByRole('link')).toHaveAttribute(
      'href',
      '/admin/form-metrics/form-activity'
    )
    expect(within($navigation[0]).getByRole('link')).toHaveTextContent(
      'Form activity'
    )
    expect($navigation[1]).toHaveAttribute('aria-label', 'Sign-in')
    expect(within($navigation[1]).getByRole('link')).toHaveAttribute(
      'href',
      '/admin/form-metrics/sign-in'
    )
  })

  it('should render the active item as a title instead of a link', () => {
    const $component = render()
    const $activeTitle = within($component).getByText('Component usage')

    expect($activeTitle).toHaveClass('editor-card-title')
    expect(
      within($component).queryByRole('link', { name: 'Component usage' })
    ).not.toBeInTheDocument()
  })

  it('should render no navigation items when the list is empty', () => {
    const $component = render({ navItems: [] })

    expect(within($component).queryAllByRole('navigation')).toHaveLength(0)
    expect(within($component).queryAllByRole('link')).toHaveLength(0)
  })
})
