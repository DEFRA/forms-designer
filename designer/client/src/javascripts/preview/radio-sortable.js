import {
  ListSortable,
  ListSortableEventListeners,
  ListSortableQuestionElements
} from '@defra/forms-designer/client/src/javascripts/preview/list-sortable'

export class RadioSortableQuestionElements extends ListSortableQuestionElements {}

export class RadioSortableEventListeners extends ListSortableEventListeners {}

export class RadioSortable extends ListSortable {
  _questionTemplate = 'radios.njk'

  /**
   * @param {RadioSortableQuestionElements} listSortableQuestionElements
   */
  init(listSortableQuestionElements) {
    const listeners = new RadioSortableEventListeners(
      this,
      listSortableQuestionElements,
      []
    )
    listeners.setupListeners()

    /**
     * @type {RadioSortableEventListeners}
     * @private
     */
    this._listeners = listeners
    this.render()
  }
}
