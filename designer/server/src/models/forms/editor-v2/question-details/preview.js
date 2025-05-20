import {
  AutocompleteQuestion,
  CheckboxSortableQuestion,
  DateInputQuestion,
  EmailAddressQuestion,
  ListQuestion,
  LongAnswerQuestion,
  MonthYearQuestion,
  NumberOnlyQuestion,
  PhoneNumberQuestion,
  Question,
  RadioSortableQuestion,
  ShortAnswerQuestion,
  SupportingEvidenceQuestion,
  UkAddressQuestion,
  YesNoQuestion,
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
 * Gets a list from QuestionSessionState
 * @param {QuestionSessionState|undefined} state
 * @returns {ListElement[]}
 */
export function getListFromState(state) {
  return (
    state?.listItems?.map((item) => {
      const text = item.text ?? ''
      return {
        id: item.id ?? '',
        text,
        value: item.value ?? '',
        label: {
          classes: '',
          text
        }
      }
    }) ?? []
  )
}

/**
 * @implements {ListElements}
 * @implements {AutocompleteElements}
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
   * @type {string}
   */
  autocompleteOptions = ''

  afterInputsHTML = '<div class="govuk-inset-text">No items added yet.</div>'

  /**
   *
   * @param {GovukField[]} basePageFields
   * @param {QuestionSessionState|undefined} state
   */
  constructor(basePageFields, state) {
    basePageFields.forEach((field) => {
      if (field.name === 'question') {
        this._question = getValueAsString(field)
      } else if (field.name === 'hintText') {
        this._hintText = getValueAsString(field)
      } else if (field.name === 'questionOptional') {
        this._optional = getCheckedValue(field)
      } else if (field.name === 'shortDescription') {
        this._shortDesc = getValueAsString(field)
      } else if (field.name === 'autoCompleteOptions') {
        this.autocompleteOptions = getValueAsString(field)
      } else {
        // sonarlint
      }
    })
    this._items = getListFromState(state)
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

  /**
   * @param {HTMLElement} _value
   */
  setPreviewDOM(_value) {
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

export const ModelFactory =
  /** @type {Record<ComponentType|'Question', (q: ListElements|AutocompleteElements) => Question>} */ ({
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    TextField: (questionElements) => {
      return new ShortAnswerQuestion(questionElements, emptyRender)
    },
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
    MultilineTextField: (questionElements) => {
      return new LongAnswerQuestion(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    YesNoField: (questionElements) => {
      return new YesNoQuestion(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    MonthYearField: (questionElements) => {
      return new MonthYearQuestion(questionElements, emptyRender)
    },
    /**
     * @param {ListElements} questionElements
     * @returns {Question}
     */
    SelectField: (questionElements) => {
      return new ListQuestion(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    NumberField: (questionElements) => {
      return new NumberOnlyQuestion(questionElements, emptyRender)
    },
    /**
     * @param {AutocompleteElements} questionElements
     * @returns {Question}
     */
    AutocompleteField: (questionElements) => {
      return new AutocompleteQuestion(questionElements, emptyRender)
    },
    /**
     * @param {ListElements} questionElements
     * @returns {CheckboxSortableQuestion}
     */
    CheckboxesField: (questionElements) => {
      return new CheckboxSortableQuestion(questionElements, emptyRender)
    },

    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    DatePartsField: (questionElements) => {
      return new DateInputQuestion(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    EmailAddressField: (questionElements) => {
      return new EmailAddressQuestion(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    UkAddressField: (questionElements) => {
      return new UkAddressQuestion(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    TelephoneNumberField: (questionElements) => {
      return new PhoneNumberQuestion(questionElements, emptyRender)
    },
    /**
     * @param {ListElements} listElements
     * @returns {Question}
     */
    RadiosField: (listElements) => {
      return new RadioSortableQuestion(listElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    Html: (questionElements) => {
      return new Question(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    InsetText: (questionElements) => {
      return new Question(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    Details: (questionElements) => {
      return new Question(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    List: (questionElements) => {
      return new Question(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    Markdown: (questionElements) => {
      return new Question(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    FileUploadField: (questionElements) => {
      return new SupportingEvidenceQuestion(questionElements, emptyRender)
    }
  })

/**
 * @param {ComponentType|undefined|'Question'} componentType
 * @param {QuestionPreviewElements} questionOrListElements
 * @returns {Question}
 */
export function getPreviewConstructor(componentType, questionOrListElements) {
  let QuestionConstructor = ModelFactory.Question

  if (componentType) {
    QuestionConstructor = ModelFactory[componentType]
  }

  return QuestionConstructor(questionOrListElements)
}

/**
 * @param {GovukField[]} govukFields
 * @param {QuestionSessionState|undefined} state
 * @param {ComponentType|undefined} componentType
 */
export function getPreviewModel(govukFields, state, componentType) {
  const questionOrListElements = new QuestionPreviewElements(govukFields, state)

  const question = getPreviewConstructor(componentType, questionOrListElements)
  return question.renderInput
}
/**
 * @import { AutocompleteElements, ListElement, ListElements, QuestionElements, QuestionRenderer, QuestionBaseModel, GovukField, QuestionSessionState, ComponentType, PreviewQuestion } from '@defra/forms-model'
 */
