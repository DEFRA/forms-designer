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
  if (elem instanceof HTMLElement) {
    const style = window.getComputedStyle(elem)
    if (style.display !== 'none' && style.visibility !== 'hidden') {
      if (typeof elem.focus === 'function') {
        elem.focus()
      }
    }
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
  /** @type {Sortable | null} */
  sortableInstance = null
  /** @type {number | undefined} */
  announceTimeout = undefined

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
    if (!this.container) return

    this.container.classList.add('js-enabled')

    this.initSortable()
    this.initButtonListeners()
    this.updateVisuals()
    this.updateMoveButtons()
    this.updateHiddenPageOrderData()
  }

  initSortable() {
    if (!this.container) return
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
    if (!this.container) return
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
            '.pages-reorder-panel-focus'
          )
          currentlyFocusedItems.forEach((item) => {
            item.classList.remove('pages-reorder-panel-focus')
          })
        }

        movedItem.classList.add('pages-reorder-panel-focus')
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
            .querySelectorAll('.pages-reorder-panel-focus')
            .forEach((el) => el.classList.remove('pages-reorder-panel-focus'))
        }

        movedItem.classList.add('pages-reorder-panel-focus')
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

    if (!targetItem && !moveUp)
      return { targetItem: null, insertBeforeItem: null }
    if (!targetItem && moveUp)
      return { targetItem: null, insertBeforeItem: null }

    let insertBeforeItem = null
    if (moveUp) {
      insertBeforeItem = targetItem
    } else if (targetItem) {
      insertBeforeItem = targetItem.nextElementSibling
    }

    return { targetItem, insertBeforeItem }
  }

  /**
   * Handles clicks within the container, specifically for move buttons.
   * @param {MouseEvent} event
   */
  handleButtonClick(event) {
    if (!(event.target instanceof Element)) return

    const button = event.target.closest(`button${this.jsButtonSelector}`)
    if (!(button instanceof HTMLButtonElement)) return

    event.preventDefault()

    const itemToMove = button.closest(this.listItemSelector)
    if (!(itemToMove instanceof HTMLLIElement) || !this.container) return

    const isUpButton = button.classList.contains('js-reorderable-list-up')

    const { targetItem, insertBeforeItem } = this.findMoveTarget(
      itemToMove,
      isUpButton
    )

    if (targetItem && insertBeforeItem !== itemToMove) {
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

      this.updateVisuals()
      this.updateMoveButtons()
      this.updateHiddenPageOrderData()

      const allItems = Array.from(
        querySelectorAllHelper(this.container, this.listItemSelector)
      )
      const newIndex = allItems.indexOf(itemToMove)
      if (newIndex !== -1) {
        this.announceReorder(itemToMove, newIndex + 1)
      }
      focusIfExists(button)
    }
  }

  updateVisuals() {
    if (!this.container) return
    const items = querySelectorAllHelper(this.container, this.listItemSelector)
    const totalItems = items.length
    items.forEach((item, index) => {
      if (!(item instanceof HTMLElement)) return

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
    if (!this.container) return

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
      upButtonElem.style.display = this.shouldShowButton(
        currentMovableIndex === 0
      )
    }

    if (downButtonElem) {
      downButtonElem.style.display = this.shouldShowButton(
        currentMovableIndex === movableItemCount - 1
      )
    }
  }

  /**
   * Helper to hide both buttons
   * @param {HTMLElement|null} upButton
   * @param {HTMLElement|null} downButton
   */
  hideButtons(upButton, downButton) {
    if (upButton) upButton.style.display = 'none'
    if (downButton) downButton.style.display = 'none'
  }

  /**
   * Determines button display style
   * @param {boolean} shouldHide
   * @returns {string}
   */
  shouldShowButton(shouldHide) {
    return shouldHide ? 'none' : 'inline-block'
  }

  updateHiddenPageOrderData() {
    if (!this.container || !this.pageOrderInput) return

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
    if (!this.announcementRegion || !this.container) return

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
        }, 5000)
      }
    }, 150)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = querySelectorHelper(document, '#pages-container')
  if (
    container instanceof HTMLElement &&
    container.dataset.module === 'pages-reorder'
  ) {
    // eslint-disable-next-line no-new
    new PageReorder(container)
  }
})
