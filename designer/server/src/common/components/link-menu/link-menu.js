import { Component } from 'govuk-frontend'

const ARIA_EXPANDED = 'aria-expanded'
const SHORT_TIMEOUT = 50
const ARROW_SVG =
  '<svg class="app-link-menu__toggle-arrow" width="11" height="5" viewBox="0 0 11 5" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 0L11 5L0 5L5.5 0Z" fill="currentColor"/></svg>'

/**
 * Link menu component
 *
 * Collapses a list of navigation links behind a toggle button, in the style of
 * the MOJ Design System "Button menu". The items stay plain links throughout:
 * there is no `role="button"` on them and no `role="menu"`/`role="menuitem"` on
 * the list, so assistive technology announces them as the links they are.
 *
 * Because the items are links rather than commands, this is a disclosure
 * (a button with `aria-expanded` controlling a list) rather than an ARIA menu.
 * Items therefore keep their natural tab order while the menu is open, and are
 * removed from it entirely while it is closed.
 *
 * The server renders the list unenhanced and visible, so without JavaScript
 * every link remains available.
 */
export class LinkMenu extends Component {
  static moduleName = 'app-link-menu'

  /** @type {Required<LinkMenuConfig>} */
  static defaults = Object.freeze({
    menuText: 'Actions',
    menuClasses: '',
    alignMenu: 'left'
  })

  /** @type {Required<LinkMenuConfig>} */
  config

  /** @type {HTMLElement} */
  $list

  /** @type {HTMLButtonElement} */
  $toggle

  /** @type {HTMLAnchorElement[]} */
  $items

  /**
   * @param {Element | null} $root - HTML element to use for the link menu
   * @param {LinkMenuConfig} [config] - Link menu config
   */
  constructor($root, config = {}) {
    super($root)

    const { menuText, menuClasses, alignMenu } = this.$root.dataset

    this.config = {
      menuText: config.menuText ?? menuText ?? LinkMenu.defaults.menuText,
      menuClasses:
        config.menuClasses ?? menuClasses ?? LinkMenu.defaults.menuClasses,
      alignMenu:
        config.alignMenu ??
        toAlignment(alignMenu) ??
        LinkMenu.defaults.alignMenu
    }

    const $list = this.$root.querySelector('.app-link-menu__list')

    if (!($list instanceof HTMLElement)) {
      throw new TypeError(
        'Link menu is missing its .app-link-menu__list element'
      )
    }

    if (!$list.id) {
      $list.id = `${LinkMenu.moduleName}-list`
    }

    this.$list = $list
    this.$items = Array.from($list.querySelectorAll('a[href]'))
    this.$toggle = this.createToggle()

    // A single link reads better on its own than behind a toggle, so leave the
    // list as rendered and the toggle button unattached
    if (this.$items.length > 1) {
      this.enhance()
    }
  }

  /**
   * Collapse the rendered list behind the toggle button
   */
  enhance() {
    this.$root.classList.add('app-link-menu--enhanced')

    for (const $item of this.$items) {
      // Drop the button styling applied for the no-JavaScript row
      for (const className of Array.from($item.classList)) {
        if (className.startsWith('govuk-button')) {
          $item.classList.remove(className)
        }
      }

      // Let the browser start navigating before the menu disappears
      $item.addEventListener('click', () => {
        setTimeout(() => this.closeMenu(false), SHORT_TIMEOUT)
      })
    }

    this.$list.classList.add('app-link-menu__wrapper')

    if (this.config.alignMenu === 'right') {
      this.$list.classList.add('app-link-menu__wrapper--right')
    }

    this.$list.hidden = true
    this.$root.insertBefore(this.$toggle, this.$list)

    this.$toggle.addEventListener('click', (event) => this.toggleMenu(event))
    this.$root.addEventListener('keydown', (event) => this.handleKeyDown(event))
    this.$root.addEventListener('focusout', (event) =>
      this.handleFocusOut(event)
    )

    document.addEventListener('click', (event) => {
      if (event.target instanceof Node && !this.$root.contains(event.target)) {
        this.closeMenu(false)
      }
    })
  }

  /**
   * Build the toggle button
   * @returns {HTMLButtonElement}
   */
  createToggle() {
    const $toggle = document.createElement('button')

    $toggle.type = 'button'
    $toggle.className = 'govuk-button app-link-menu__toggle'

    const extraClasses = this.config.menuClasses.split(' ').filter(Boolean)

    if (extraClasses.length) {
      $toggle.classList.add(...extraClasses)
    }

    $toggle.setAttribute(ARIA_EXPANDED, 'false')
    $toggle.setAttribute('aria-controls', this.$list.id)

    const $label = document.createElement('span')
    $label.className = 'app-link-menu__toggle-label'
    $label.appendChild(document.createTextNode(this.config.menuText))
    $label.insertAdjacentHTML('beforeend', ARROW_SVG)

    $toggle.appendChild($label)

    return $toggle
  }

  /**
   * @returns {boolean}
   */
  isOpen() {
    return this.$toggle.getAttribute(ARIA_EXPANDED) === 'true'
  }

  /**
   * Open the menu, optionally moving focus to one of its links
   * @param {number} [focusIndex] - index of the link to focus
   */
  openMenu(focusIndex) {
    this.$list.hidden = false
    this.$toggle.setAttribute(ARIA_EXPANDED, 'true')

    if (focusIndex !== undefined) {
      this.focusItem(focusIndex)
    }
  }

  /**
   * Close the menu, optionally returning focus to the toggle button
   * @param {boolean} [moveFocus] - whether to return focus to the toggle button
   */
  closeMenu(moveFocus = true) {
    this.$list.hidden = true
    this.$toggle.setAttribute(ARIA_EXPANDED, 'false')

    if (moveFocus) {
      this.$toggle.focus()
    }
  }

  /**
   * @param {MouseEvent} event - click event
   */
  toggleMenu(event) {
    if (this.isOpen()) {
      this.closeMenu()
      return
    }

    // Only move focus into the menu when opened from the keyboard
    this.openMenu(event.detail === 0 ? 0 : undefined)
  }

  /**
   * Focus the link at the given index, wrapping at either end
   * @param {number} index - index of the link to focus
   */
  focusItem(index) {
    let wrapped = index

    if (wrapped >= this.$items.length) {
      wrapped = 0
    }

    if (wrapped < 0) {
      wrapped = this.$items.length - 1
    }

    this.$items.at(wrapped)?.focus()
  }

  /**
   * @returns {number}
   */
  currentIndex() {
    const $active = document.activeElement
    return $active instanceof HTMLAnchorElement
      ? this.$items.indexOf($active)
      : -1
  }

  /**
   * @param {KeyboardEvent} event - keydown event
   */
  handleKeyDown(event) {
    if (event.key === 'Escape' && this.isOpen()) {
      event.preventDefault()
      this.closeMenu()
      return
    }

    if (event.target === this.$toggle) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        this.openMenu(0)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        this.openMenu(this.$items.length - 1)
      }

      return
    }

    const inMenu =
      event.target instanceof Node && this.$list.contains(event.target)

    if (!inMenu || !this.isOpen() || this.currentIndex() === -1) {
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.focusItem(this.currentIndex() + 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        this.focusItem(this.currentIndex() - 1)
        break
      case 'Home':
        event.preventDefault()
        this.focusItem(0)
        break
      case 'End':
        event.preventDefault()
        this.focusItem(this.$items.length - 1)
        break
    }
  }

  /**
   * Close the menu once focus leaves it, so tabbing past the last link behaves
   * the way it looks like it should
   * @param {FocusEvent} event - focusout event
   */
  handleFocusOut(event) {
    if (!this.isOpen()) {
      return
    }

    const $next = event.relatedTarget

    if ($next instanceof Node && this.$root.contains($next)) {
      return
    }

    this.closeMenu(false)
  }
}

/**
 * @param {string} [value]
 * @returns {'left' | 'right' | undefined}
 */
function toAlignment(value) {
  return value === 'left' || value === 'right' ? value : undefined
}

/**
 * @typedef {object} LinkMenuConfig
 * @property {string} [menuText] - label for the toggle button
 * @property {string} [menuClasses] - classes applied to the toggle button
 * @property {'left' | 'right'} [alignMenu] - edge the open menu aligns to
 */
