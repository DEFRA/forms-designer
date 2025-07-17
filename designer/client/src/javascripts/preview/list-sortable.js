import Sortable from 'sortablejs'

import {
  addPathToEditorBaseUrl,
  hideHtmlElement,
  showHtmlElement
} from '~/src/javascripts/preview/helper'
import {
  ListEventListeners,
  ListQuestionDomElements
} from '~/src/javascripts/preview/list'

const APP_REORDERABLE_LIST_ITEM = '.app-reorderable-list__item'
const REORDER_BUTTON_HIDDEN = 'reorder-button-hidden'

const OK_200 = 200
const panelFocusClass = 'reorder-panel-focus'

export class ListSortableQuestionElements extends ListQuestionDomElements {
  /** @type {HTMLElement} */
  editOptionsButton
  /** @type {HTMLElement} */
  addItemButton
  /** @type {HTMLElement} */
  sortableContainer
  /** @type { Sortable | undefined } */
  sortableInstance
  /** @type { HTMLElement | undefined } */
  announcementRegion
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  announceTimeout = undefined
  /** @type {number} */
  announceDisplayTimeMs = 150
  /** @type {number} */
  announceClearTimeMs = 5000

  /**
   * @param {HTMLBuilder} htmlBuilder
   */
  constructor(htmlBuilder) {
    super(htmlBuilder)
    const editOptionsButton = /** @type {HTMLElement} */ (
      document.getElementById('edit-options-button')
    )
    const addItemButton = /** @type {HTMLElement} */ (
      document.getElementById('add-option-button')
    )
    const sortableContainer = /** @type {HTMLElement} */ (
      document.getElementById('options-container')
    )
    const announcementRegion = /** @type {HTMLElement} */ (
      document.getElementById('reorder-announcement')
    )

    this.editOptionsButton = editOptionsButton
    this.addItemButton = addItemButton
    this.sortableContainer = sortableContainer
    this.announcementRegion = announcementRegion
  }

  isReordering() {
    return this.editOptionsButton.textContent?.trim() !== 'Done'
  }

  /**
   * @param {(e: SortableEvent) => void} onStartCb
   * @param {(e: SortableEvent) => void} onEndCb
   */
  setupSortable(onStartCb, onEndCb) {
    // Initialize Sortable for the options container
    this.sortableInstance = Sortable.create(
      this.sortableContainer,
      /** @type {SortableOptions} */ ({
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'highlight-dragging',
        onStart: onStartCb,
        onEnd: onEndCb,
        disabled: true
      })
    )
  }

  /**
   * @param {Event} e
   */
  handleReorder(e) {
    const isReordering = this.isReordering()
    e.preventDefault()
    if (isReordering) {
      this.setButtonsForReorderMode(this.listElements)
    } else {
      this.setButtonsWhenReorderingDone(this.listElements)
    }

    // Enable/disable sorting
    if (this.sortableInstance) {
      this.sortableInstance.option('disabled', !isReordering)
    }
  }

  getAllMoveButtons() {
    return /** @type {HTMLElement[]} */ (
      Array.from(this.sortableContainer.querySelectorAll('a.govuk-button'))
    )
  }

  /**
   * @param {HTMLElement[]} elements
   * @param {boolean} inReorderMode
   */
  setStyleOnChildren(elements, inReorderMode) {
    elements.forEach((item) => {
      const cursorStyle = inReorderMode ? 'move' : 'default'
      item.style.cursor = cursorStyle
      const children = /** @type {HTMLElement[]} */ (
        Array.from(item.getElementsByTagName('*'))
      )
      children.forEach((child) => {
        if (child.tagName === 'A') {
          this.handleLinkOrButton(child, inReorderMode)
        } else {
          child.style.cursor = cursorStyle
        }
      })
      if (inReorderMode) {
        item.classList.add('sortable-enabled')
      } else {
        item.classList.remove('sortable-enabled')
        item.classList.remove('reorder-panel-focus')
      }
    })
  }

  /**
   * @param {HTMLElement} el
   * @param {boolean} inReorderMode
   */
  handleLinkOrButton(el, inReorderMode) {
    if (el.classList.contains('govuk-button')) {
      // Show/hide up/down buttons
      if (inReorderMode) {
        showHtmlElement(el)
        return
      }

      hideHtmlElement(el)
      return
    }

    // Show/hide edit/delete links
    if (!inReorderMode) {
      showHtmlElement(el)
      return
    }

    hideHtmlElement(el)
  }

  updateMoveButtons() {
    const allMoveButtons = this.getAllMoveButtons()
    allMoveButtons.forEach((button, idx) => {
      if (idx === 0 || idx === allMoveButtons.length - 1) {
        button.classList.add(REORDER_BUTTON_HIDDEN)
      } else {
        button.classList.remove(REORDER_BUTTON_HIDDEN)
      }
    })
  }

  /**
   * @param { Element | null } movedItem - The list item that was moved.
   */
  setItemFocus(movedItem) {
    if (movedItem instanceof HTMLElement) {
      const currentlyFocusedItems = this.sortableContainer.querySelectorAll(
        `.${panelFocusClass}`
      )
      currentlyFocusedItems.forEach((item) => {
        item.classList.remove(panelFocusClass)
      })
      movedItem.setAttribute('tabindex', '-1')
      movedItem.classList.add('reorder-panel-focus')
    }
  }

  /**
   * @param {HTMLElement} source
   */
  setMoveFocus(source) {
    if (source.classList.contains(REORDER_BUTTON_HIDDEN)) {
      const nearButton = /** @type { HTMLElement | null } */ (
        source.nextElementSibling ?? source.previousElementSibling
      )
      if (nearButton) {
        nearButton.focus()
      }
      return
    }
    source.focus()
  }

  /**
   * @param {HTMLElement[]} elements
   */
  setButtonsForReorderMode(elements) {
    hideHtmlElement(this.addItemButton)
    this.editOptionsButton.textContent = 'Done'
    this.editOptionsButton.classList.remove('govuk-button--inverse')
    this.setStyleOnChildren(elements, true)
    this.updateMoveButtons()
  }

  /**
   * @param {HTMLElement[]} elements
   */
  setButtonsWhenReorderingDone(elements) {
    showHtmlElement(this.addItemButton)
    this.editOptionsButton.textContent = 'Re-order'
    this.editOptionsButton.classList.add('govuk-button--inverse')
    this.setStyleOnChildren(elements, false)
  }

  /**
   * @param {ListSortableEventListeners} listenerClass
   * @param {HTMLElement} target
   */
  moveUp(listenerClass, target) {
    if (target.classList.contains('js-reorderable-list-up')) {
      const item = target.closest(APP_REORDERABLE_LIST_ITEM)
      const prevItem = item?.previousElementSibling
      if (prevItem && item.parentNode) {
        item.parentNode.insertBefore(item, prevItem)
      }
      listenerClass._listQuestion.resyncPreviewAfterReorder()
      listenerClass._listSortableElements.updateMoveButtons()
      listenerClass._listSortableElements.setMoveFocus(target)
      listenerClass._listSortableElements.setItemFocus(item)
    }
  }

  /**
   * @param {ListSortableEventListeners} listenerClass
   * @param {HTMLElement} target
   */
  moveDown(listenerClass, target) {
    if (target.classList.contains('js-reorderable-list-down')) {
      const item = target.closest(APP_REORDERABLE_LIST_ITEM)
      const nextItem = item?.nextElementSibling
      if (nextItem && item.parentNode) {
        item.parentNode.insertBefore(nextItem, item)
      }
      listenerClass._listQuestion.resyncPreviewAfterReorder()
      listenerClass._listSortableElements.updateMoveButtons()
      listenerClass._listSortableElements.setMoveFocus(target)
      listenerClass._listSortableElements.setItemFocus(item)
    }
  }

  /**
   * Announces the reorder action to screen readers via the live region.
   * @param {HTMLElement} movedItem - The list item that was moved.
   */
  announceReorder(movedItem) {
    if (!this.announcementRegion) {
      return
    }

    const listItem = /** @type { HTMLElement | null } */ (
      movedItem.closest(APP_REORDERABLE_LIST_ITEM)
    )
    const listItems = /** @type {HTMLElement[]} */ (
      Array.from(
        this.sortableContainer.querySelectorAll(APP_REORDERABLE_LIST_ITEM)
      )
    )
    const newPositionIdx = listItems.findIndex(
      (x) => x.dataset.id === listItem?.dataset.id
    )

    const optionTitle = listItem?.dataset.text?.trim() ?? 'Item'
    const totalItems = listItems.length

    const message = `List reordered, ${optionTitle} is now option ${newPositionIdx + 1} of ${totalItems}.`

    clearTimeout(this.announceTimeout)
    this.announceTimeout = setTimeout(() => {
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

export class ListSortableEventListeners extends ListEventListeners {
  /** @type {ListSortableQuestionElements} */
  _listSortableElements
  /** @type {ListSortableQuestion} */
  _listQuestion

  /**
   *
   * @param {ListSortableQuestion} question
   * @param {ListSortableQuestionElements} listQuestionElements
   * @param {HTMLElement[]} listElements
   */
  constructor(question, listQuestionElements, listElements) {
    super(question, listQuestionElements, listElements)
    this._listQuestion = question
    this._listSortableElements = listQuestionElements
  }

  /**
   * @returns {ListenerRow[]}
   */
  get customListeners() {
    this._listSortableElements.setupSortable(
      () => {
        // Do nothing
      },
      (e) => {
        this._listQuestion.resyncPreviewAfterReorder()
        this._listSortableElements.updateMoveButtons()
        this._listSortableElements.setItemFocus(e.item)
        this._listSortableElements.announceReorder(e.item)
      }
    )

    return /** @type {ListenerRow[]} */ ([
      [
        this._listSortableElements.editOptionsButton,
        (_target, e) => {
          this._listSortableElements.handleReorder(e)
          this.configureMoveButtonListeners()
          if (this._listSortableElements.isReordering()) {
            this.updateStateInSession()
          }
        },
        'click'
      ]
    ])
  }

  configureMoveButtonListeners() {
    const allMoveButtons = this._listSortableElements.getAllMoveButtons()
    if (this._listSortableElements.isReordering()) {
      return
    }
    // Add all move button listeners
    allMoveButtons.forEach((button) => {
      const buttonText = button.textContent
      if (buttonText === 'Up' || buttonText === 'Down') {
        const existingListener = button.dataset.clickHandler
        if (!existingListener) {
          this.inputEventListener(
            button,
            buttonText === 'Up'
              ? (target, e) => {
                  e.preventDefault()
                  this._listSortableElements.moveUp(this, target)
                  this._listSortableElements.announceReorder(target)
                }
              : (target, e) => {
                  e.preventDefault()
                  this._listSortableElements.moveDown(this, target)
                  this._listSortableElements.announceReorder(target)
                },
            'click'
          )
          button.dataset.clickHandler = 'set'
        }
      }
    })
  }

  // TODO: could be moved into an api class
  updateStateInSession() {
    const url = addPathToEditorBaseUrl(window.location.href, '/state/', true)

    const listElements = this._listQuestion.listElementObjects

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ listItems: listElements }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((resp) => {
        if (resp.status !== OK_200) {
          this._listElements.redirectToErrorPage()
          return 'error'
        }
        return 'ok'
      })
      .catch((_err) => {
        this._listElements.redirectToErrorPage()
        return 'error'
      })
  }
}

/**
 * @import { ListElement, QuestionRenderer, HTMLBuilder, ListElements, ListSortableQuestion, ListenerRow } from '@defra/forms-model'
 * @import { SortableEvent, SortableOptions } from 'sortablejs'
 */
