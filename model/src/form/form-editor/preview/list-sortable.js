import { ListQuestion } from '~/src/form/form-editor/preview/list.js'

export class ListSortableQuestion extends ListQuestion {
  /**
   * @param {ListElements} listElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(listElements, questionRenderer) {
    super(listElements, questionRenderer)
    const items = /** @type {ListElement[]} */ (listElements.values.items)
    this._list = this.createListFromElements(items)
    this._listElements = listElements
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
}

/**
 * @import {ListElement} from '~/src/form/form-editor/types.js'
 * @import { QuestionRenderer, ListElements } from '~/src/form/form-editor/preview/types.js'
 */
