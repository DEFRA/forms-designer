import { within } from '@testing-library/dom'

import { renderMacro } from '~/test/helpers/component-helpers.js'

const params = {
  id: 'pages-menu',
  alignMenu: 'right',
  button: {
    text: 'Manage form',
    classes: 'govuk-button--secondary'
  },
  items: [
    { text: 'Advanced settings', href: '/advanced-settings' },
    { text: 'Manage conditions', href: '/conditions' },
    { text: 'Download this form', href: '/download' }
  ]
}

describe('Link menu component', () => {
  /** @type {HTMLElement} */
  let $component

  /**
   * @param {object} [overrides]
   */
  function render(overrides = {}) {
    const { document } = renderMacro('appLinkMenu', 'link-menu/macro.njk', {
      params: { ...params, ...overrides }
    })

    const $root = document.querySelector('.app-link-menu')

    if (!($root instanceof HTMLElement)) {
      throw new Error('Link menu did not render')
    }

    return $root
  }

  beforeEach(() => {
    $component = render()
  })

  it('should render the component root with the module hook', () => {
    expect($component).toHaveAttribute('data-module', 'app-link-menu')
  })

  it('should pass the toggle button config through as data attributes', () => {
    expect($component).toHaveAttribute('data-menu-text', 'Manage form')
    expect($component).toHaveAttribute(
      'data-menu-classes',
      'govuk-button--secondary'
    )
    expect($component).toHaveAttribute('data-align-menu', 'right')
  })

  it('should render every item as a visible link', () => {
    const $links = within($component).getAllByRole('link')

    expect($links).toHaveLength(3)
    expect($links[0]).toHaveTextContent('Advanced settings')
    expect($links[0]).toHaveAttribute('href', '/advanced-settings')
    expect($links[1]).toHaveTextContent('Manage conditions')
    expect($links[2]).toHaveTextContent('Download this form')
  })

  it('should not give the links button semantics', () => {
    const $links = within($component).getAllByRole('link')

    for (const $link of $links) {
      expect($link).not.toHaveAttribute('role')
    }

    expect(within($component).queryAllByRole('button')).toHaveLength(0)
  })

  it('should render the items as a list, referenced by the given id', () => {
    const $list = within($component).getByRole('list')

    expect($list).toHaveAttribute('id', 'pages-menu')
    expect(within($list).getAllByRole('listitem')).toHaveLength(3)
  })

  it('should style the items as secondary buttons for the no-JavaScript row', () => {
    const $links = within($component).getAllByRole('link')

    expect($links[0]).toHaveClass(
      'govuk-button',
      'govuk-button--secondary',
      'app-link-menu__item'
    )
  })

  it('should append item classes', () => {
    $component = render({
      items: [
        { text: 'Download this form', href: '/download', classes: 'app-custom' }
      ]
    })

    expect(within($component).getByRole('link')).toHaveClass('app-custom')
  })

  it('should append item attributes', () => {
    $component = render({
      items: [
        {
          text: 'Preview form',
          href: '/preview',
          attributes: { target: '_blank' }
        }
      ]
    })

    expect(within($component).getByRole('link')).toHaveAttribute(
      'target',
      '_blank'
    )
  })

  it('should append root classes and attributes', () => {
    $component = render({
      classes: 'app-custom-menu',
      attributes: { 'data-testid': 'menu' }
    })

    expect($component).toHaveClass('app-link-menu', 'app-custom-menu')
    expect($component).toHaveAttribute('data-testid', 'menu')
  })

  it('should omit optional data attributes when not configured', () => {
    $component = render({ button: undefined, alignMenu: undefined })

    expect($component).not.toHaveAttribute('data-menu-text')
    expect($component).not.toHaveAttribute('data-align-menu')
  })
})
