import { LinkMenu } from '~/src/common/components/link-menu/link-menu.js'
import { renderMacro } from '~/test/helpers/component-helpers.js'

const items = [
  { text: 'Advanced settings', href: '/advanced-settings' },
  { text: 'Manage conditions', href: '/conditions' },
  { text: 'Download this form', href: '/download' }
]

describe('LinkMenu', () => {
  /** @type {HTMLElement} */
  let $root

  /** @type {Document} */
  let document

  /**
   * Render the macro and initialise the component against it
   * @param {object} [overrides]
   */
  function init(overrides = {}) {
    const rendered = renderMacro('appLinkMenu', 'link-menu/macro.njk', {
      params: {
        id: 'pages-menu',
        alignMenu: 'right',
        button: { text: 'Manage form', classes: 'govuk-button--secondary' },
        items,
        ...overrides
      }
    })

    document = rendered.document

    // GOV.UK Frontend components refuse to initialise without this
    document.body.classList.add('govuk-frontend-supported')

    const $component = document.querySelector('.app-link-menu')

    if (!($component instanceof HTMLElement)) {
      throw new Error('Link menu did not render')
    }

    new LinkMenu($component) // eslint-disable-line no-new

    return $component
  }

  /**
   * @returns {HTMLButtonElement}
   */
  function toggle() {
    const $toggle = $root.querySelector('.app-link-menu__toggle')

    if (!($toggle instanceof HTMLButtonElement)) {
      throw new Error('Toggle button was not created')
    }

    return $toggle
  }

  /**
   * @returns {HTMLElement}
   */
  function list() {
    const $list = $root.querySelector('.app-link-menu__list')

    if (!($list instanceof HTMLElement)) {
      throw new Error('List is missing')
    }

    return $list
  }

  /**
   * @returns {HTMLAnchorElement[]}
   */
  function links() {
    return Array.from($root.querySelectorAll('a[href]'))
  }

  /**
   * Click the toggle with a pointer. jsdom's `.click()` reports `detail: 0`,
   * which browsers reserve for keyboard activation, so dispatch it by hand.
   */
  function clickToggle() {
    toggle().dispatchEvent(
      new window.MouseEvent('click', { bubbles: true, detail: 1 })
    )
  }

  /**
   * @param {string} key
   * @param {Element} target
   */
  function press(key, target) {
    target.dispatchEvent(
      new window.KeyboardEvent('keydown', { key, bubbles: true })
    )
  }

  describe('enhancement', () => {
    beforeEach(() => {
      $root = init()
    })

    it('should add a toggle button labelled from the data attribute', () => {
      expect(toggle()).toHaveTextContent('Manage form')
      expect(toggle()).toHaveAttribute('type', 'button')
      expect(toggle()).toHaveClass('govuk-button', 'govuk-button--secondary')
    })

    it('should mark the toggle as a collapsed disclosure for the list', () => {
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
      expect(toggle()).toHaveAttribute('aria-controls', 'pages-menu')
      expect(list().hidden).toBe(true)
    })

    it('should not give the list or its items menu semantics', () => {
      expect(list()).not.toHaveAttribute('role')

      for (const $link of links()) {
        expect($link).not.toHaveAttribute('role')
        expect($link).not.toHaveAttribute('tabindex')
      }
    })

    it('should strip the no-JavaScript button styling from the items', () => {
      for (const $link of links()) {
        expect($link).not.toHaveClass('govuk-button')
        expect($link).not.toHaveClass('govuk-button--secondary')
        expect($link).toHaveClass('app-link-menu__item')
      }
    })

    it('should align the menu when asked to', () => {
      expect(list()).toHaveClass(
        'app-link-menu__wrapper',
        'app-link-menu__wrapper--right'
      )
    })

    it('should not align right by default', () => {
      $root = init({ alignMenu: undefined })

      expect(list()).toHaveClass('app-link-menu__wrapper')
      expect(list()).not.toHaveClass('app-link-menu__wrapper--right')
    })
  })

  describe('opening and closing', () => {
    beforeEach(() => {
      $root = init()
    })

    it('should open on click without moving focus into the menu', () => {
      clickToggle()

      expect(toggle()).toHaveAttribute('aria-expanded', 'true')
      expect(list().hidden).toBe(false)
      expect(document.activeElement).not.toBe(links()[0])
    })

    it('should close again on a second click', () => {
      clickToggle()
      clickToggle()

      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
      expect(list().hidden).toBe(true)
    })

    it('should close when clicking outside the component', () => {
      clickToggle()
      document.body.click()

      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
      expect(list().hidden).toBe(true)
    })

    it('should stay open when clicking inside the component', () => {
      clickToggle()
      list().click()

      expect(toggle()).toHaveAttribute('aria-expanded', 'true')
    })

    it('should close once focus leaves the component', () => {
      clickToggle()

      $root.dispatchEvent(
        new window.FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: document.body
        })
      )

      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    })

    it('should stay open while focus moves between its own links', () => {
      clickToggle()

      $root.dispatchEvent(
        new window.FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: links()[1]
        })
      )

      expect(toggle()).toHaveAttribute('aria-expanded', 'true')
    })

    it('should close after following a link', () => {
      jest.useFakeTimers()

      clickToggle()
      links()[0].click()
      jest.runAllTimers()

      expect(toggle()).toHaveAttribute('aria-expanded', 'false')

      jest.useRealTimers()
    })
  })

  describe('keyboard', () => {
    beforeEach(() => {
      $root = init()
    })

    it('should open and focus the first link on arrow down', () => {
      press('ArrowDown', toggle())

      expect(toggle()).toHaveAttribute('aria-expanded', 'true')
      expect(document.activeElement).toBe(links()[0])
    })

    it('should open and focus the last link on arrow up', () => {
      press('ArrowUp', toggle())

      expect(document.activeElement).toBe(links()[2])
    })

    it('should focus the first link when opened with a keyboard click', () => {
      toggle().dispatchEvent(
        new window.MouseEvent('click', { bubbles: true, detail: 0 })
      )

      expect(document.activeElement).toBe(links()[0])
    })

    it('should move between links with the arrow keys', () => {
      press('ArrowDown', toggle())
      press('ArrowDown', links()[0])

      expect(document.activeElement).toBe(links()[1])

      press('ArrowUp', links()[1])

      expect(document.activeElement).toBe(links()[0])
    })

    it('should wrap around at either end', () => {
      press('ArrowUp', toggle())
      press('ArrowDown', links()[2])

      expect(document.activeElement).toBe(links()[0])

      press('ArrowUp', links()[0])

      expect(document.activeElement).toBe(links()[2])
    })

    it('should jump to the first and last links with home and end', () => {
      press('ArrowDown', toggle())
      press('End', links()[0])

      expect(document.activeElement).toBe(links()[2])

      press('Home', links()[2])

      expect(document.activeElement).toBe(links()[0])
    })

    it('should close on escape and return focus to the toggle', () => {
      press('ArrowDown', toggle())
      press('Escape', links()[0])

      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
      expect(list().hidden).toBe(true)
      expect(document.activeElement).toBe(toggle())
    })

    it('should ignore arrow keys while closed', () => {
      press('ArrowDown', list())

      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('when there is nothing to collapse', () => {
    it('should leave a single link alone', () => {
      $root = init({ items: [items[0]] })

      expect($root.querySelector('.app-link-menu__toggle')).toBeNull()
      expect($root).not.toHaveClass('app-link-menu--enhanced')
      expect(list().hidden).toBe(false)
      expect(links()[0]).toHaveClass('govuk-button')
    })

    it('should leave an empty menu alone', () => {
      $root = init({ items: [] })

      expect($root.querySelector('.app-link-menu__toggle')).toBeNull()
      expect(list().hidden).toBe(false)
    })
  })

  describe('config', () => {
    it('should fall back to defaults when no data attributes are set', () => {
      $root = init({ button: undefined, alignMenu: undefined })

      expect(toggle()).toHaveTextContent('Actions')
      expect(toggle()).toHaveClass('govuk-button')
      expect(toggle()).not.toHaveClass('govuk-button--secondary')
    })

    it('should let a config argument win over the data attributes', () => {
      const { document: rendered } = renderMacro(
        'appLinkMenu',
        'link-menu/macro.njk',
        { params: { id: 'pages-menu', button: { text: 'Manage form' }, items } }
      )

      rendered.body.classList.add('govuk-frontend-supported')

      const $component = rendered.querySelector('.app-link-menu')

      new LinkMenu($component, { menuText: 'More', alignMenu: 'right' }) // eslint-disable-line no-new

      $root = /** @type {HTMLElement} */ ($component)

      expect(toggle()).toHaveTextContent('More')
      expect(list()).toHaveClass('app-link-menu__wrapper--right')
    })

    it('should give the list an id when the template omits one', () => {
      $root = init({ id: undefined })

      // The macro's own fallback id, still unique enough to be referenced
      expect(list().id).toBeTruthy()
      expect(toggle()).toHaveAttribute('aria-controls', list().id)
    })
  })

  describe('when the markup is wrong', () => {
    it('should throw if the list is missing', () => {
      const { document: rendered } = renderMacro(
        'appLinkMenu',
        'link-menu/macro.njk',
        { params: { items } }
      )

      rendered.body.classList.add('govuk-frontend-supported')

      const $component = rendered.querySelector('.app-link-menu')
      $component?.querySelector('.app-link-menu__list')?.remove()

      expect(() => new LinkMenu($component)).toThrow(
        'Link menu is missing its .app-link-menu__list element'
      )
    })
  })
})
