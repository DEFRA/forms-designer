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

  /**
   * @param {HTMLElement[]} elements
   * @param {string} styleToSetForCursor
   * @param { string | undefined } styleToAddOnItem
   * @param { string | undefined } styleToRemoveOnItem
   */
  setStyleOnChildren(
    elements,
    styleToSetForCursor,
    styleToAddOnItem,
    styleToRemoveOnItem
  ) {
    elements.forEach((item) => {
      item.style.cursor = styleToSetForCursor
      const children = /** @type {HTMLElement[]} */ (
        Array.from(item.getElementsByTagName('*'))
      )
      children.forEach((child) => {
        child.style.cursor = styleToSetForCursor
      })
      if (styleToAddOnItem) {
        item.classList.add(styleToAddOnItem)
      }
      if (styleToRemoveOnItem) {
        item.classList.remove(styleToRemoveOnItem)
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
    this.setStyleOnChildren(elements, 'move', 'sortable-enabled', undefined)
  }

  /**
   * @param {HTMLElement[]} elements
   */
  setButtonsWhenReorderingDone(elements) {
    this.addItemButton.style = 'display: block'
    this.editOptionsButton.textContent = 'Re-order'
    this.editOptionsButton.classList.add('govuk-button--inverse')
    this.setStyleOnChildren(elements, 'default', undefined, 'sortable-enabled')
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
        },
        'click'
      ]
    ])
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
