import {
  ComponentType,
  DateInputQuestion,
  EmailAddressQuestion,
  ListQuestion,
  ListSortableQuestion,
  PhoneNumberQuestion,
  Question,
  RadioQuestion,
  RadioSortableQuestion,
  ShortAnswerQuestion,
  UkAddressQuestion,
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
    return new ShortAnswerQuestion(questionElements, emptyRender)
  },

  /**
   * @param {QuestionElements} questionElements
   * @returns {Question}
   */
  DateInput: (questionElements) => {
    return new DateInputQuestion(questionElements, emptyRender)
  },
  /**
   * @param {QuestionElements} questionElements
   * @returns {Question}
   */
  EmailAddress: (questionElements) => {
    return new EmailAddressQuestion(questionElements, emptyRender)
  },
  /**
   * @param {QuestionElements} questionElements
   * @returns {Question}
   */
  UkAddress: (questionElements) => {
    return new UkAddressQuestion(questionElements, emptyRender)
  },
  /**
   * @param {QuestionElements} questionElements
   * @returns {Question}
   */
  PhoneNumber: (questionElements) => {
    return new PhoneNumberQuestion(questionElements, emptyRender)
  },
  /**
   * @param {ListElements} listElements
   * @returns {Question}
   */
  List: (listElements) => {
    return new ListQuestion(listElements, emptyRender)
  },
  /**
   * @param {ListElements} listElements
   * @returns {Question}
   */
  Radio: (listElements) => {
    return new RadioQuestion(listElements, emptyRender)
  },
  /**
   * @param {ListElements} listElements
   * @returns {Question}
   */
  ListSortable: (listElements) => {
    return new ListSortableQuestion(listElements, emptyRender)
  },
  /**
   * @param {ListElements} listElements
   * @returns {Question}
   */
  RadioSortable: (listElements) => {
    return new RadioSortableQuestion(listElements, emptyRender)
  }
}

/**
 * @param {GovukField[]} govukFields
 * @param {ComponentType|undefined} componentType
 */
export function getPreviewModel(govukFields, componentType) {
  const questionOrListElements = new QuestionPreviewElements(govukFields)
  let QuestionConstructor =
    /** @type {(question: ListElements) => Question} */ (models.Question)

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
 * @import { ListElement, ListElements, QuestionElements, QuestionRenderer, QuestionBaseModel, GovukField } from '@defra/forms-model'
 */
