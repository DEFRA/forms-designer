import Sortable from 'sortablejs'

/**
 * Query selector helper returning a specific element type or null.
 * @template {Element} T
 * @param {Document | Element} rootElement
 * @param {string} selector
 * @returns {T | null}
 */
export function querySelectorHelper(rootElement, selector) {
  return rootElement.querySelector(selector)
}

/**
 * Query selector all helper returning a NodeListOf specific elements.
 * @template {Element} T
 * @param {Document | Element} rootElement
 * @param {string} selector
 * @returns {NodeListOf<T>}
 */
export function querySelectorAllHelper(rootElement, selector) {
  return rootElement.querySelectorAll(selector)
}

/**
 * Focuses an element if it exists and is visible.
 * @param {Element | null} elem
 */
export function focusIfExists(elem) {
  if (
    elem instanceof HTMLElement &&
    typeof elem.focus === 'function' &&
    window.getComputedStyle(elem).display !== 'none' &&
    window.getComputedStyle(elem).visibility !== 'hidden'
  ) {
    elem.focus()
  }
}

export class PageReorder {
  /** @type {HTMLOListElement | null} */
  container = null
  /** @type {HTMLInputElement | null} */
  pageOrderInput = null
  /** @type {HTMLElement | null} */
  announcementRegion = null
  /** @type {string} */
  checkAnswersItemSelector = '.check-answers-item'
  /** @type {string} */
  listItemSelector = '.app-reorderable-list__item'
  /** @type {string} */
  pageTitleSelector = '.page-title'
  /** @type {string} */
  jsButtonSelector = '.reorder-button-js'
  /** @type {string} */
  noJsButtonSelector = '.reorder-button-no-js'
  /** @type {string} */
  panelFocusClass = 'pages-reorder-panel-focus'
  /** @type {Sortable | null} */
  sortableInstance = null
  /** @type {number | undefined} */
  announceTimeout = undefined
  /** @type {number} */
  announceDisplayTimeMs = 150
  /** @type {number} */
  announceClearTimeMs = 5000

  /**
   * @param {Element} containerElement
   */
  constructor(containerElement) {
    if (!(containerElement instanceof HTMLOListElement)) {
      return
    }
    this.container = containerElement

    this.pageOrderInput = querySelectorHelper(document, '#pageOrder')
    this.announcementRegion = querySelectorHelper(
      document,
      '#reorder-announcement'
    )

    if (!this.pageOrderInput || !this.announcementRegion) {
      return
    }

    this.init()
  }

  init() {
    if (!this.container) {
      return
    }

    this.container.classList.add('js-enabled')
    this.container.classList.add('pages-container')

    this.initSortable()
    this.initButtonListeners()
    this.updateVisuals()
    this.updateMoveButtons()
    this.updateHiddenPageOrderData()
  }

  initSortable() {
    if (!this.container) {
      return
    }

    this.sortableInstance = Sortable.create(this.container, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'highlight-dragging',
      filter: this.checkAnswersItemSelector,
      preventOnFilter: false,
      onEnd: (evt) => this.handleSortableEnd(evt),
      disabled: false
    })
  }

  initButtonListeners() {
    if (!this.container) {
      return
    }

    this.container.addEventListener('click', (event) =>
      this.handleButtonClick(event)
    )
  }

  /**
   * Handles the end of a drag-and-drop operation.
   * @param {Sortable.SortableEvent} evt - The event fired by SortableJS.
   */
  handleSortableEnd(evt) {
    const movedItem = evt.item
    if (evt.newIndex !== undefined) {
      this.updateVisuals()
      this.updateMoveButtons()
      this.updateHiddenPageOrderData()
      this.announceReorder(movedItem, evt.newIndex + 1)

      if (movedItem instanceof HTMLElement) {
        movedItem.setAttribute('tabindex', '-1')
        focusIfExists(movedItem)

        if (this.container) {
          const currentlyFocusedItems = querySelectorAllHelper(
            this.container,
            `.${this.panelFocusClass}`
          )
          currentlyFocusedItems.forEach((item) => {
            item.classList.remove(this.panelFocusClass)
          })
        }

        movedItem.classList.add(this.panelFocusClass)
      }
    } else {
      this.updateVisuals()
      this.updateMoveButtons()
      this.updateHiddenPageOrderData()

      if (movedItem instanceof HTMLElement) {
        movedItem.setAttribute('tabindex', '-1')
        focusIfExists(movedItem)

        if (this.container) {
          this.container
            .querySelectorAll(`.${this.panelFocusClass}`)
            .forEach((el) => el.classList.remove(this.panelFocusClass))
        }

        movedItem.classList.add(this.panelFocusClass)
      }
    }
  }

  /**
   * Finds the target list item and insertion point for button moves.
   * @param {HTMLElement} itemToMove - The list item being moved.
   * @param {boolean} moveUp - True if moving up, false if moving down.
   * @returns {{ targetItem: Element | null, insertBeforeItem: Element | null }}
   */
  findMoveTarget(itemToMove, moveUp) {
    let targetItem = moveUp
      ? itemToMove.previousElementSibling
      : itemToMove.nextElementSibling

    while (targetItem?.matches(this.checkAnswersItemSelector)) {
      targetItem = moveUp
        ? targetItem.previousElementSibling
        : targetItem.nextElementSibling
    }

    if (!targetItem && !moveUp) {
      return { targetItem: null, insertBeforeItem: null }
    }
    if (!targetItem && moveUp) {
      return { targetItem: null, insertBeforeItem: null }
    }

    let insertBeforeItem = null
    if (moveUp) {
      insertBeforeItem = targetItem
    } else {
      insertBeforeItem = targetItem?.nextElementSibling ?? null
    }

    return { targetItem, insertBeforeItem }
  }

  /**
   * Handles clicks within the container, specifically for move buttons.
   * @param {MouseEvent} event
   */
  handleButtonClick(event) {
    if (!(event.target instanceof Element)) {
      return
    }

    const button = event.target.closest(`button${this.jsButtonSelector}`)
    if (!(button instanceof HTMLButtonElement)) {
      return
    }

    event.preventDefault()

    const itemToMove = button.closest(this.listItemSelector)
    if (!(itemToMove instanceof HTMLLIElement) || !this.container) {
      return
    }

    const isUpButtonOriginallyClicked = button.classList.contains(
      'js-reorderable-list-up'
    )

    const { targetItem, insertBeforeItem } = this.findMoveTarget(
      itemToMove,
      isUpButtonOriginallyClicked
    )

    if (targetItem && insertBeforeItem !== itemToMove) {
      this.moveItemInDom(itemToMove, insertBeforeItem)
      this.updatePanelFocus(itemToMove)

      this.updateVisuals()
      this.updateMoveButtons()
      this.updateHiddenPageOrderData()
      this.announceSuccessfulMove(itemToMove)
      this.focusAfterMove(itemToMove, isUpButtonOriginallyClicked)
    }
  }

  /**
   * Moves the item in the DOM.
   * @param {HTMLLIElement} itemToMove
   * @param {Element | null} insertBeforeItem
   */
  moveItemInDom(itemToMove, insertBeforeItem) {
    if (!this.container) {
      return
    }

    if (insertBeforeItem) {
      this.container.insertBefore(itemToMove, insertBeforeItem)
    } else {
      const fixedItem = querySelectorHelper(
        this.container,
        this.checkAnswersItemSelector
      )
      if (fixedItem) {
        this.container.insertBefore(itemToMove, fixedItem)
      } else {
        this.container.appendChild(itemToMove)
      }
    }
  }

  /**
   * Updates the focus highlight class on panels.
   * @param {HTMLLIElement} movedItem
   */
  updatePanelFocus(movedItem) {
    if (!this.container) {
      return
    }

    const currentlyFocusedItemsNodeList = querySelectorAllHelper(
      this.container,
      `.${this.panelFocusClass}`
    )
    currentlyFocusedItemsNodeList.forEach((item) => {
      item.classList.remove(this.panelFocusClass)
    })

    if (movedItem instanceof HTMLElement) {
      movedItem.classList.add(this.panelFocusClass)
      movedItem.setAttribute('tabindex', '-1')
    }
  }

  /**
   * Announces the successful move and updates related data.
   * @param {HTMLLIElement} movedItem
   */
  announceSuccessfulMove(movedItem) {
    if (!this.container) {
      return
    }

    const allItemsNodeList = querySelectorAllHelper(
      this.container,
      this.listItemSelector
    )
    const allItems = Array.from(allItemsNodeList)
    const newIndex = allItems.indexOf(movedItem)
    if (newIndex !== -1) {
      this.announceReorder(movedItem, newIndex + 1)
    }
  }

  /**
   * Focuses the appropriate element after a move operation.
   * @param {HTMLLIElement} movedItem
   * @param {boolean} wasUpButtonClick
   */
  focusAfterMove(movedItem, wasUpButtonClick) {
    const upButtonOnMovedItem = querySelectorHelper(
      movedItem,
      `.js-reorderable-list-up`
    )
    const downButtonOnMovedItem = querySelectorHelper(
      movedItem,
      `.js-reorderable-list-down`
    )

    const isButtonFocusable = (/** @type {Element | null} */ button) =>
      button instanceof HTMLElement &&
      window.getComputedStyle(button).display !== 'none'

    /** @type {Element | null} */
    let elementToFocus = movedItem

    if (wasUpButtonClick && isButtonFocusable(upButtonOnMovedItem)) {
      // Case 1: Up button clicked, Up button still visible
      elementToFocus = upButtonOnMovedItem
    } else if (wasUpButtonClick && isButtonFocusable(downButtonOnMovedItem)) {
      // Case 2: Up button clicked, Up button hidden, Down button visible
      elementToFocus = downButtonOnMovedItem
    } else if (!wasUpButtonClick && isButtonFocusable(downButtonOnMovedItem)) {
      // Case 3: Down button clicked, Down button still visible
      elementToFocus = downButtonOnMovedItem
    } else if (!wasUpButtonClick && isButtonFocusable(upButtonOnMovedItem)) {
      // Case 4: Down button clicked, Down button hidden, Up button visible
      elementToFocus = upButtonOnMovedItem
    }

    focusIfExists(elementToFocus)
  }

  updateVisuals() {
    if (!this.container) {
      return
    }

    const items = querySelectorAllHelper(this.container, this.listItemSelector)
    const totalItems = items.length
    items.forEach((item, index) => {
      if (!(item instanceof HTMLElement)) {
        return
      }

      const numberElement = querySelectorHelper(item, '.page-number')
      if (numberElement) {
        numberElement.textContent = `Page ${index + 1}`
      }

      const titleElement = querySelectorHelper(item, this.pageTitleSelector)
      const title = titleElement?.textContent?.trim() ?? 'this page'
      const currentPosition = index + 1 // 1-based index

      const upButton = querySelectorHelper(
        item,
        this.jsButtonSelector + '.js-reorderable-list-up'
      )
      const downButton = querySelectorHelper(
        item,
        this.jsButtonSelector + '.js-reorderable-list-down'
      )

      if (upButton) {
        upButton.setAttribute(
          'aria-label',
          `Button, Move page: Up, Page ${currentPosition} of ${totalItems}: ${title}`
        )
      }
      if (downButton) {
        downButton.setAttribute(
          'aria-label',
          `Button, Move page: Down, Page ${currentPosition} of ${totalItems}: ${title}`
        )
      }
    })
  }

  updateMoveButtons() {
    if (!this.container) {
      return
    }

    const itemsNodeList = querySelectorAllHelper(
      this.container,
      this.listItemSelector
    )

    const htmlItems = Array.from(itemsNodeList).filter(
      (item) => item instanceof HTMLElement
    )

    const movableItems = this.getMovableItems(htmlItems)
    const movableItemCount = movableItems.length

    htmlItems.forEach((item) => {
      const buttons = this.getButtonElements(item)
      const isFixed = item.matches(this.checkAnswersItemSelector)

      this.updateButtonVisibility(
        buttons,
        isFixed,
        movableItems,
        item,
        movableItemCount
      )
    })
  }

  /**
   * Filters out non-movable items
   * @param {HTMLElement[]} items
   * @returns {HTMLElement[]}
   */
  getMovableItems(items) {
    return items.filter(
      (item) =>
        item instanceof HTMLElement &&
        !item.matches(this.checkAnswersItemSelector)
    )
  }

  /**
   * Gets up and down button elements for an item
   * @param {HTMLElement} item
   * @returns {{upButtonElem: HTMLElement|null, downButtonElem: HTMLElement|null}}
   */
  getButtonElements(item) {
    const upButton = querySelectorHelper(item, '.js-reorderable-list-up')
    const downButton = querySelectorHelper(item, '.js-reorderable-list-down')

    return {
      upButtonElem: upButton instanceof HTMLElement ? upButton : null,
      downButtonElem: downButton instanceof HTMLElement ? downButton : null
    }
  }

  /**
   * Updates button visibility based on item position
   * @param {{upButtonElem: HTMLElement|null, downButtonElem: HTMLElement|null}} buttons
   * @param {boolean} isFixed
   * @param {HTMLElement[]} movableItems
   * @param {HTMLElement} item
   * @param {number} movableItemCount
   */
  updateButtonVisibility(
    buttons,
    isFixed,
    movableItems,
    item,
    movableItemCount
  ) {
    const { upButtonElem, downButtonElem } = buttons

    if (isFixed) {
      this.hideButtons(upButtonElem, downButtonElem)
      return
    }

    const currentMovableIndex = movableItems.indexOf(item)

    if (upButtonElem) {
      upButtonElem.style.display =
        currentMovableIndex === 0
          ? this.getHideButtonStyle()
          : this.getShowButtonStyle()
    }

    if (downButtonElem) {
      downButtonElem.style.display =
        currentMovableIndex === movableItemCount - 1
          ? this.getHideButtonStyle()
          : this.getShowButtonStyle()
    }
  }

  /**
   * Helper to hide both buttons
   * @param {HTMLElement|null} upButton
   * @param {HTMLElement|null} downButton
   */
  hideButtons(upButton, downButton) {
    if (upButton) {
      upButton.style.display = this.getHideButtonStyle()
    }

    if (downButton) {
      downButton.style.display = this.getHideButtonStyle()
    }
  }

  /**
   * Returns the display style for hiding a button.
   * @returns {string}
   */
  getHideButtonStyle() {
    return 'none'
  }

  /**
   * Returns the display style for showing a button.
   * @returns {string}
   */
  getShowButtonStyle() {
    return 'inline-block'
  }

  updateHiddenPageOrderData() {
    if (!this.container || !this.pageOrderInput) {
      return
    }

    const items = querySelectorAllHelper(this.container, this.listItemSelector)
    /** @type {string[]} */
    const pageOrderIds = []
    items.forEach((item) => {
      if (item instanceof HTMLElement) {
        const pageId = item.dataset.id
        if (pageId) {
          pageOrderIds.push(pageId)
        }
      }
    })

    this.pageOrderInput.value = pageOrderIds.join(',')
  }

  /**
   * Announces the reorder action to screen readers via the live region.
   * @param {HTMLElement} movedItem - The list item that was moved.
   * @param {number} newPosition - The new 1-based position of the item.
   */
  announceReorder(movedItem, newPosition) {
    if (!this.announcementRegion || !this.container) {
      return
    }

    const titleElement = querySelectorHelper(movedItem, this.pageTitleSelector)
    const pageTitle = titleElement?.textContent?.trim() ?? 'Item'
    const totalItems = querySelectorAllHelper(
      this.container,
      this.listItemSelector
    ).length

    const message = `List reordered, ${pageTitle} is now page ${newPosition} of ${totalItems}.`

    clearTimeout(this.announceTimeout)
    this.announceTimeout = window.setTimeout(() => {
      if (this.announcementRegion) {
        this.announcementRegion.textContent = message
        setTimeout(() => {
          if (
            this.announcementRegion &&
            this.announcementRegion.textContent === message
          ) {
            this.announcementRegion.textContent = ''
          }
        }, this.announceClearTimeMs)
      }
    }, this.announceDisplayTimeMs)
  }
}

/**
 * Initializes the page reorder functionality for matching containers.
 * @param {Element} container - The container to initialize page reordering on.
 * @returns {PageReorder|null} The PageReorder instance or null if not applicable.
 */
export function initPageReorder(container) {
  if (
    container instanceof HTMLElement &&
    container.dataset.module === 'pages-reorder'
  ) {
    return new PageReorder(container)
  }
  return null
}

document.addEventListener('DOMContentLoaded', () => {
  const container = querySelectorHelper(document, '#pages-container')
  if (container) {
    initPageReorder(container)
  }
})
