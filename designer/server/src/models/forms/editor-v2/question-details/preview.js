import {
  govukFieldIsQuestionOptional,
  govukFieldValueIsString
} from '@defra/forms-model'

/**
 * @param {GovukField} val
 * @returns {string}
 */
export function getValueAsString(val) {
  if (govukFieldValueIsString(val)) {
    return val.value
  }
  return ''
}

/**
 * @param {GovukField} govukField
 * @returns {boolean}
 */
export function getCheckedValue(govukField) {
  if (govukFieldIsQuestionOptional(govukField)) {
    return govukField.items[0].checked
  }
  return false
}

/**
 * @implements {QuestionElements}
 */
export class QuestionPreviewElements {
  /**
   * @protected
   */
  _question = ''
  /** @protected */
  _hintText = ''
  /** @protected */
  _optional = false
  /**
   * @type {string}
   * @protected
   */
  _shortDesc = ''
  /**
   *
   * @type {ListElement[]}
   * @private
   */
  _items = []

  /**
   *
   * @param {GovukField[]} basePageFields
   */
  constructor(basePageFields) {
    basePageFields.forEach((field) => {
      if (field.name === 'question') {
        this._question = getValueAsString(field)
      } else if (field.name === 'hintText') {
        this._hintText = getValueAsString(field)
      } else if (field.name === 'questionOptional') {
        this._optional = getCheckedValue(field)
      } else if (field.name === 'shortDescription') {
        this._shortDesc = getValueAsString(field)
      }
    })
  }

  get values() {
    return {
      question: this._question,
      hintText: this._hintText,
      optional: this._optional,
      shortDesc: this._shortDesc,
      items: this._items
    }
  }

  /**
   * @param {string} _value
   */
  setPreviewHTML(_value) {
    // Not implemented for server side render
  }
}

/**
 * @implements {QuestionRenderer}
 */
export class EmptyRender {
  /**
   * @param {string} _questionBaseModel
   */
  render(_questionBaseModel) {
    // do nothing
  }
}

/**
 * @import { GovukField, ListElement, QuestionElements, QuestionRenderer } from '@defra/forms-model'
 */
