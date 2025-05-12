import { DateInput } from '@defra/forms-designer/client/src/javascripts/preview/date-input.js'
import { EmailAddress } from '@defra/forms-designer/client/src/javascripts/preview/email-address.js'
import { ListSortable } from '@defra/forms-designer/client/src/javascripts/preview/list-sortable.js'
import { List } from '@defra/forms-designer/client/src/javascripts/preview/list.js'
import { PhoneNumber } from '@defra/forms-designer/client/src/javascripts/preview/phone-number.js'
import { Question } from '@defra/forms-designer/client/src/javascripts/preview/question.js'
import { RadioSortable } from '@defra/forms-designer/client/src/javascripts/preview/radio-sortable.js'
import { Radio } from '@defra/forms-designer/client/src/javascripts/preview/radio.js'
import { ShortAnswer } from '@defra/forms-designer/client/src/javascripts/preview/short-answer.js'
import { UkAddress } from '@defra/forms-designer/client/src/javascripts/preview/uk-address.js'
import {
  ComponentType,
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
 * @implements {ListElements}
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

  afterInputsHTML = '<div class="govuk-inset-text">No items added yet.</div>'

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

const emptyRender = new EmptyRender()

export const models = {
  /**
   * @param {QuestionElements} questionElements
   * @returns {Question}
   */
  Question: (questionElements) => {
    return new Question(questionElements, emptyRender)
  },
  /**
   * @param {QuestionElements} questionElements
   * @returns {Question}
   */
  ShortAnswer: (questionElements) => {
    return new ShortAnswer(questionElements, emptyRender)
  },

  /**
   * @param {QuestionElements} questionElements
   * @returns {DateInput}
   */
  DateInput: (questionElements) => {
    return new DateInput(questionElements, emptyRender)
  },
  /**
   * @param {QuestionElements} questionElements
   * @returns {Question}
   */
  EmailAddress: (questionElements) => {
    return new EmailAddress(questionElements, emptyRender)
  },
  /**
   * @param {QuestionElements} questionElements
   * @returns {Question}
   */
  UkAddress: (questionElements) => {
    return new UkAddress(questionElements, emptyRender)
  },
  /**
   * @param {QuestionElements} questionElements
   * @returns {Question}
   */
  PhoneNumber: (questionElements) => {
    return new PhoneNumber(questionElements, emptyRender)
  },
  /**
   * @param {ListElements} listElements
   * @returns {Question}
   */
  List: (listElements) => {
    return new List(listElements, emptyRender)
  },
  /**
   * @param {ListElements} listElements
   * @returns {Question}
   */
  Radio: (listElements) => {
    return new Radio(listElements, emptyRender)
  },
  /**
   * @param {ListElements} listElements
   * @returns {Question}
   */
  ListSortable: (listElements) => {
    return new ListSortable(listElements, emptyRender)
  },
  /**
   * @param {ListElements} listElements
   * @returns {Question}
   */
  RadioSortable: (listElements) => {
    return new RadioSortable(listElements, emptyRender)
  }
}

/**
 * @param {GovukField[]} govukFields
 * @param {ComponentType|undefined} componentType
 */
export function getPreviewModel(govukFields, componentType) {
  const questionOrListElements = new QuestionPreviewElements(govukFields)
  let QuestionConstructor =
    /** @type {(question: QuestionElements) => Question} */ (models.Question)

  if (componentType === ComponentType.TextField) {
    QuestionConstructor = models.ShortAnswer
  } else if (componentType === ComponentType.DatePartsField) {
    QuestionConstructor = models.DateInput
  } else if (componentType === ComponentType.EmailAddressField) {
    QuestionConstructor = models.EmailAddress
  } else if (componentType === ComponentType.UkAddressField) {
    QuestionConstructor = models.UkAddress
  } else if (componentType === ComponentType.TelephoneNumberField) {
    QuestionConstructor = models.PhoneNumber
  } else if (componentType === ComponentType.RadiosField) {
    QuestionConstructor = models.Radio
  }

  const question = QuestionConstructor(questionOrListElements)
  return question.renderInput
}
/**
 * @import { GovukField, ListElement, ListElements, QuestionElements, QuestionRenderer, QuestionBaseModel, GovukField } from '@defra/forms-model'
 * @import { ListSortable, ListSortableQuestionElements } from '@defra/forms-designer/client/src/javascripts/preview/list-sortable.js'
 */
