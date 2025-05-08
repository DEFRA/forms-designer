import Sortable from 'sortablejs'

import {
  List,
  ListEventListeners,
  ListQuestionElements
} from '~/src/javascripts/preview/list'

const REORDER_BUTTON_HIDDEN = 'reorder-button-hidden'

export class ListSortableQuestionElements extends ListQuestionElements {
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
        child.style.cursor = cursorStyle
        if (child.tagName === 'A') {
          if (child.classList.contains('govuk-button')) {
            // Show/hide up/down buttons
            child.style = inReorderMode ? 'display: block' : 'display:none'
          } else {
            // Show/hide edit/delete links
            child.style = inReorderMode ? 'display: none' : 'display:block'
          }
        }
      })
      if (inReorderMode) {
        item.classList.add('sortable-enabled')
      } else {
        item.classList.remove('sortable-enabled')
      }
    })
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
    this.addItemButton.style = 'display: none'
    this.editOptionsButton.textContent = 'Done'
    this.editOptionsButton.classList.remove('govuk-button--inverse')
    this.setStyleOnChildren(elements, true)
    this.updateMoveButtons()
  }

  /**
   * @param {HTMLElement[]} elements
   */
  setButtonsWhenReorderingDone(elements) {
    this.addItemButton.style = 'display: block'
    this.editOptionsButton.textContent = 'Re-order'
    this.editOptionsButton.classList.add('govuk-button--inverse')
    this.setStyleOnChildren(elements, false)
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
      }
    )

    return /** @type {ListenerRow[]} */ ([
      [
        this._listSortableElements.editOptionsButton,
        (_target, e) => {
          this._listSortableElements.handleReorder(e)
          this.configureMoveButtonListeners()
        },
        'click'
      ]
    ])
  }

  configureMoveButtonListeners() {
    const allMoveButtons = this._listSortableElements.getAllMoveButtons()
    if (!this._listSortableElements.isReordering()) {
      // Add all move button listeners
      allMoveButtons.forEach((button) => {
        if (button.textContent === 'Up') {
          this.inputEventListener(
            button,
            (target, e) => {
              e.preventDefault()
              if (target.classList.contains('js-reorderable-list-up')) {
                const item = target.closest('.app-reorderable-list__item')
                const prevItem = item?.previousElementSibling
                if (prevItem && item.parentNode) {
                  item.parentNode.insertBefore(item, prevItem)
                }
                this._listQuestion.resyncPreviewAfterReorder()
                this._listSortableElements.updateMoveButtons()
                this._listSortableElements.setMoveFocus(target)
              }
            },
            'click'
          )
        }
        if (button.textContent === 'Down') {
          this.inputEventListener(
            button,
            (target, e) => {
              e.preventDefault()
              if (target.classList.contains('js-reorderable-list-down')) {
                const item = target.closest('.app-reorderable-list__item')
                const nextItem = item?.nextElementSibling
                if (nextItem && item.parentNode) {
                  item.parentNode.insertBefore(nextItem, item)
                }
                this._listQuestion.resyncPreviewAfterReorder()
                this._listSortableElements.updateMoveButtons()
                this._listSortableElements.setMoveFocus(target)
              }
            },
            'click'
          )
        }
      })
    }
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
    const listeners = new ListSortableEventListeners(
      this,
      listSortableQuestionElements,
      []
    )
    listeners.setupListeners()
  }

  resyncPreviewAfterReorder() {
    const listElements = this._listElements.sortableContainer.children
    const listElementsOptions = /** @type {HTMLInputElement[]} */ (
      Array.from(listElements)
    )
    const newList = listElementsOptions.map(
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ListQuestionElements.getListElementValues
    )
    this._list = this.createListFromElements(newList)
    this.render()
  }

  static setupPreview() {
    const elements = new ListSortableQuestionElements()
    const radio = new ListSortable(elements)
    radio.render()

    return radio
  }
}

/**
 * @import { ListElement } from '@defra/forms-model'
 * @import { ListenerRow } from '~/src/javascripts/preview/question.js'
 * @import { SortableEvent, SortableOptions } from 'sortablejs'
 */
