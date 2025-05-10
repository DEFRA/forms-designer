import Sortable from 'sortablejs'

import {
  addPathToEditorBaseUrl,
  hideHtmlElement,
  showHtmlElement
} from '~/src/javascripts/preview/helper'
import {
  List,
  ListEventListeners,
  ListQuestionDomElements
} from '~/src/javascripts/preview/list'

const REORDER_BUTTON_HIDDEN = 'reorder-button-hidden'

const OK_200 = 200

export class ListSortableQuestionElements extends ListQuestionDomElements {
  /** @type {HTMLElement} */
  editOptionsButton
  /** @type {HTMLElement} */
  addItemButton
  /** @type {HTMLElement} */
  sortableContainer
  /** @type { Sortable | undefined } */
  sortableInstance

  constructor() {
    super()
    const editOptionsButton = /** @type {HTMLElement} */ (
      document.getElementById('edit-options-button')
    )
    const addItemButton = /** @type {HTMLElement} */ (
      document.getElementById('add-option-button')
    )
    const sortableContainer = /** @type {HTMLElement} */ (
      document.getElementById('options-container')
    )

    this.editOptionsButton = editOptionsButton
    this.addItemButton = addItemButton
    this.sortableContainer = sortableContainer
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
      const item = target.closest('.app-reorderable-list__item')
      const prevItem = item?.previousElementSibling
      if (prevItem && item.parentNode) {
        item.parentNode.insertBefore(item, prevItem)
      }
      listenerClass._listQuestion.resyncPreviewAfterReorder()
      listenerClass._listSortableElements.updateMoveButtons()
      listenerClass._listSortableElements.setMoveFocus(target)
    }
  }

  /**
   * @param {ListSortableEventListeners} listenerClass
   * @param {HTMLElement} target
   */
  moveDown(listenerClass, target) {
    if (target.classList.contains('js-reorderable-list-down')) {
      const item = target.closest('.app-reorderable-list__item')
      const nextItem = item?.nextElementSibling
      if (nextItem && item.parentNode) {
        item.parentNode.insertBefore(nextItem, item)
      }
      listenerClass._listQuestion.resyncPreviewAfterReorder()
      listenerClass._listSortableElements.updateMoveButtons()
      listenerClass._listSortableElements.setMoveFocus(target)
    }
  }
}

export class ListSortableEventListeners extends ListEventListeners {
  /** @type {ListSortableQuestionElements} */
  _listSortableElements
  /** @type {ListSortable} */
  _listQuestion

  /**
   *
   * @param {ListSortable} question
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
      () => {
        this._listQuestion.resyncPreviewAfterReorder()
        this._listSortableElements.updateMoveButtons()
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
        this.inputEventListener(
          button,
          buttonText === 'Up'
            ? (target, e) => {
                e.preventDefault()
                this._listSortableElements.moveUp(this, target)
              }
            : (target, e) => {
                e.preventDefault()
                this._listSortableElements.moveDown(this, target)
              },
          'click'
        )
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

export class ListSortable extends List {
  /**
   * @param {ListSortableQuestionElements} listSortableQuestionElements
   */
  constructor(listSortableQuestionElements) {
    super(listSortableQuestionElements)
    const items = /** @type {ListElement[]} */ (
      listSortableQuestionElements.values.items
    )
    this._list = this.createListFromElements(items)
    this._listElements = listSortableQuestionElements
  }

  /**
   * @returns {Map<string, ListElement>}
   */
  resyncPreviewAfterReorder() {
    const newList = this._listElements.values.items
    this._list = this.createListFromElements(newList)
    this.render()
    return this._list
  }

  get listElementObjects() {
    return Array.from(this._list).map(([, value]) => ({
      id: value.id,
      text: value.text,
      hint: value.hint?.text ? { text: value.hint.text } : undefined,
      value: value.value
    }))
  }

  /**
   * @param {ListSortableQuestionElements} listSortableQuestionElements
   */
  init(listSortableQuestionElements) {
    const listeners = new ListSortableEventListeners(
      this,
      listSortableQuestionElements,
      []
    )
    listeners.setupListeners()

    /**
     * @type {ListEventListeners}
     * @private
     */
    this._listeners = listeners
    this.render()
  }

  static setupPreview() {
    const elements = new ListSortableQuestionElements()
    const listSortable = new ListSortable(elements)
    listSortable.init(elements)

    return listSortable
  }
}

/**
 * @import { ListElement } from '@defra/forms-model'
 * @import { ListenerRow } from '~/src/javascripts/preview/question.js'
 * @import { SortableEvent, SortableOptions } from 'sortablejs'
 */
