import { Component } from 'govuk-frontend'

/**
 * Service header component
 *
 * A modified adaptation of the Design System header script
 * To initialise the One Login header, run:
 * new window.ServiceHeader(document.querySelector("[data-module='one-login-header']"))
 */
export class ServiceHeader extends Component {
  static moduleName = 'one-login-header'

  $navigation

  /**
   * @param {Element | null} $root - HTML element to use for header
   */
  constructor($root) {
    super($root)

    const $navigation = this.$root.querySelectorAll(
      `[data-${ServiceHeader.moduleName}-nav]`
    )

    if (!$navigation.length) {
      return
    }

    this.$navigation = $navigation

    /**
     * The header can render with one or two navigation elements which collapse
     * into dropdowns on the mobile variation. This initialises the dropdown
     * functionality for all navs that have a menu button which has:
     * 1. a class of .js-x-header-toggle
     * 2. an aria-controls attribute which can be mapped to the ID of the element
     * that should be hidden on mobile
     */
    for (const $nav of Array.from(this.$navigation)) {
      const $menuButton = $nav.querySelector('.js-x-header-toggle')
      const $menuId = $menuButton?.getAttribute('aria-controls')

      if (!($menuButton instanceof HTMLButtonElement) || !$menuId) {
        continue
      }

      const $menu = document.getElementById($menuId)
      const $menuItems = $menu?.querySelectorAll('li')

      if (!$menu || !$menuItems || $menuItems.length < 2) {
        continue
      }

      $nav.classList.add('toggle-enabled')
      this.checkMode($menu, $menuButton)

      /**
       * Handle menu button click
       *
       * When the menu button is clicked, change the visibility of the menu and then
       * sync the accessibility state and menu button state
       */
      $menuButton.addEventListener('click', () =>
        this.handleMenuButtonClick($menu, $menuButton)
      )
    }
  }

  /**
   * Sync state
   * @param {HTMLElement} $menu
   * @param {HTMLElement} $menuButton
   */
  checkMode($menu, $menuButton) {
    if (!$menu.dataset.openClass || !$menuButton.dataset.openClass) {
      return
    }

    $menuButton.setAttribute(
      'aria-expanded',
      `${$menu.classList.contains($menu.dataset.openClass)}`
    )

    const menuIsOpen = $menuButton.getAttribute('aria-expanded') === 'true'

    if ($menuButton.dataset.labelForHide && $menuButton.dataset.labelForShow) {
      $menuButton.setAttribute(
        'aria-label',
        menuIsOpen
          ? $menuButton.dataset.labelForHide
          : $menuButton.dataset.labelForShow
      )
    }

    if ($menuButton.dataset.textForHide && $menuButton.dataset.textForShow) {
      $menuButton.innerHTML = menuIsOpen
        ? $menuButton.dataset.textForHide
        : $menuButton.dataset.textForShow
    }
  }

  /**
   * Handle menu button click
   *
   * When the menu button is clicked, change the visibility of the menu and then
   * sync the accessibility state and menu button state
   * @param {HTMLElement} $menu
   * @param {HTMLElement} $menuButton
   */
  handleMenuButtonClick($menu, $menuButton) {
    if (!$menu.dataset.openClass || !$menuButton.dataset.openClass) {
      return
    }

    // Toggle menu open/closed
    $menu.classList.toggle($menu.dataset.openClass)
    $menuButton.classList.toggle($menuButton.dataset.openClass)
    this.checkMode($menu, $menuButton)
  }
}
