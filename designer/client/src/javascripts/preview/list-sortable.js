import Sortable from 'sortablejs'

import {
  List,
  ListEventListeners,
  ListQuestionElements
} from '~/src/javascripts/preview/list'

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
      Array.from(this.sortableContainer.querySelectorAll('a .govuk-button'))
    )
  }

  /**
   * @param {HTMLElement[]} elements
   */
  setStyleOnChildren(elements) {
    const isReordering = this.isReordering()
    elements.forEach((item) => {
      const cursorStyle = isReordering ? 'move' : 'default'
      item.style.cursor = cursorStyle
      const children = /** @type {HTMLElement[]} */ (
        Array.from(item.getElementsByTagName('*'))
      )
      children.forEach((child) => {
        child.style.cursor = cursorStyle
        if (child.tagName === 'A') {
          if (child.classList.contains('govuk-button')) {
            // Show/hide up/down buttons
            child.style = isReordering ? 'display: block' : 'display:none'
          } else {
            // Show/hide edit/delete links
            child.style = isReordering ? 'display: none' : 'display:block'
          }
        }
      })
      if (isReordering) {
        item.classList.add('sortable-enabled')
      } else {
        item.classList.remove('sortable-enabled')
      }
    })
  }

  /**
   * @param {HTMLElement[]} elements
   */
  setButtonsForReorderMode(elements) {
    this.addItemButton.style = 'display: none'
    this.editOptionsButton.textContent = 'Done'
    this.editOptionsButton.classList.remove('govuk-button--inverse')
    this.setStyleOnChildren(elements)
  }

  /**
   * @param {HTMLElement[]} elements
   */
  setButtonsWhenReorderingDone(elements) {
    this.addItemButton.style = 'display: block'
    this.editOptionsButton.textContent = 'Re-order'
    this.editOptionsButton.classList.add('govuk-button--inverse')
    this.setStyleOnChildren(elements)
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
    if (this._listSortableElements.isReordering()) {
      // Add all move button listeners
      allMoveButtons.forEach((button) => {
        if (button.textContent === 'Up') {
          this.inputEventListener(
            button,
            (_e) => {
              // console.log('up', e)
            },
            'click'
          )
        }
        if (button.textContent === 'Down') {
          this.inputEventListener(
            button,
            (_e) => {
              // console.log('down', e)
            },
            'click'
          )
        }
      })
    } else {
      // Remove all move button listeners
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
