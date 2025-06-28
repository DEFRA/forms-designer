import { ComponentType } from '~/src/components/enums.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import {
  Question,
  QuestionComponentElements
} from '~/src/form/form-editor/preview/question.js'

const DefaultListConst = {
  TextElementId: 'radioText',
  HintElementId: 'radioHint',
  Template: PreviewComponent.PATH + 'radios.njk',
  Input: 'listInput',
  RenderName: 'listInputField'
}

/**
 * @param {ListElement} listElement
 * @returns {[string, ListElement]}
 */
export function listItemMapper(listElement) {
  return [listElement.id, listElement]
}

/**
 *
 * @param { ListElement[]| undefined } listElements
 * @returns {Map<string, ListElement>}
 */
export function listsElementToMap(listElements) {
  const entries = listElements ? listElements.map(listItemMapper) : []
  return new Map(entries)
}

/**
 * @param {Item} item
 * @returns {ListElement}
 */
export function listItemToListElement(item) {
  return {
    text: item.text,
    label: {
      text: item.text,
      classes: ''
    },
    value: item.value,
    id: item.id ?? '',
    hint: item.hint
  }
}

/**
 * @implements {QuestionElements}
 */
export class ListComponentElements extends QuestionComponentElements {
  /**
   * @type {List}
   * @protected
   */
  _list

  /**
   * @param {SelectionComponentsDef} component
   * @param {List} list
   */
  constructor(component, list) {
    super(component)
    this._list = list
  }

  /**
   * @returns {BaseSettings}
   * @protected
   */
  _getValues() {
    return {
      ...super._getValues(),
      items: this._list.items.map(listItemToListElement)
    }
  }
}

/**
 * @implements {QuestionElements}
 */
export class SelectComponentElements extends ListComponentElements {
  /**
   * @returns {BaseSettings}
   * @protected
   */
  _getValues() {
    const emptyItem = /** @type {ListElement} */ ({
      id: 'da310b6e-2513-4d14-a7a1-63a93231891d',
      text: '',
      value: ''
    })
    const items = /** @type {ListElement[]} */ ([
      emptyItem,
      ...super._getValues().items
    ])
    return {
      ...super._getValues(),
      items
    }
  }
}

export class ListQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.List
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = DefaultListConst.Template
  /** @type {ListElements} */
  _listElements
  listRenderId = DefaultListConst.Input
  listRenderName = DefaultListConst.RenderName

  /**
   * @type {Map<string, ListElement>}
   * @protected
   */
  _list

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
   * @protected
   * @returns {{
   *  formGroup?: {afterInputs: {html: string}};
   *  hint: DefaultComponent;
   *  name: string;
   *  fieldset?: GovukFieldset;
   *  id: string;
   *  items: ListItemReadonly[]
   * }}
   */
  _renderInput() {
    const afterInputs =
      /** @type {{ formGroup?: { afterInputs: { html: string } } }} */ (
        this.list.length
          ? {}
          : {
              formGroup: {
                afterInputs: {
                  html: this._listElements.afterInputsHTML
                }
              }
            }
      )

    return {
      id: this.listRenderId,
      name: this.listRenderName,
      fieldset: this.fieldSet,
      hint: this.hint,
      items: this.list,
      ...afterInputs
    }
  }

  /**
   * @returns {{
   *  formGroup?: {afterInputs: {html: string}};
   *  hint: DefaultComponent;
   *  name: string;
   *  fieldset?: GovukFieldset;
   *  id: string;
   *  items: ListItemReadonly[]
   * }}
   */
  get renderInput() {
    return this._renderInput()
  }

  /**
   *
   * @param {ListElement} listElement
   */
  push(listElement) {
    this._list.set(listElement.id, listElement)
    this.render()
  }

  /**
   * @param {string} key
   */
  delete(key) {
    this._list.delete(key)
    this.render()
  }

  /**
   * @param {ListElement[]} listElements
   * @returns {Map<string, ListElement>}
   */
  createListFromElements(listElements) {
    this._list = listsElementToMap(listElements)
    return this._list
  }

  /**
   * @protected
   * @returns {ListItemReadonly[]}
   */
  _getList() {
    const iterator = /** @type {MapIterator<ListElement>} */ (
      this._list.values()
    )
    return Array.from(iterator).map((listItem) => {
      const hintText =
        this._highlight === `${listItem.id}-hint` && !listItem.hint?.text.length
          ? 'Hint text'
          : (listItem.hint?.text ?? '')

      const hint = {
        hint: hintText
          ? {
              text: hintText,
              classes: this.getHighlight(listItem.id + '-hint')
            }
          : undefined
      }

      const text = listItem.text

      return {
        ...listItem,
        text,
        ...hint,
        label: {
          text: listItem.text,
          classes: this.getHighlight(listItem.id + '-label')
        }
      }
    })
  }

  /**
   * @returns {ListItemReadonly[]}
   */
  get list() {
    const list = this._getList()

    return list.map((listItem) => {
      const text = listItem.text.length ? listItem.text : 'Item text'

      return {
        ...listItem,
        text
      }
    })
  }

  /**
   *
   * @param {string | undefined} id
   * @param {string} text
   */
  updateText(id, text) {
    if (!id) {
      return
    }

    const listItem = this._list.get(id)
    if (listItem) {
      listItem.text = text
      this.render()
    }
  }

  /**
   *
   * @param {string | undefined} id
   * @param {string} hint
   */
  updateHint(id, hint) {
    if (!id) {
      return
    }

    const listItem = this._list.get(id)
    if (listItem) {
      listItem.hint = {
        ...listItem.hint,
        text: hint
      }
      this.render()
    }
  }

  /**
   * @param {string | undefined} id
   * @param {string} value
   */
  updateValue(id, value) {
    if (!id) {
      return
    }

    const listItem = this._list.get(id)
    if (listItem) {
      listItem.value = value
      this.render()
    }
  }
}

/**
 * @import { ListElement, ListItemReadonly } from '~/src/form/form-editor/types.js'
 * @import { SelectionComponentsDef, ListComponentsDef } from '~/src/components/types.js'
 * @import { List, Item } from '~/src/form/form-definition/types.js'
 * @import { ListElements, QuestionRenderer, DefaultComponent, GovukFieldset, BaseSettings, QuestionElements } from '~/src/form/form-editor/preview/types.js'
 */
