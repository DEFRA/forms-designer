import {
  AutocompleteQuestion,
  CheckboxSortableQuestion,
  DateInputQuestion,
  EastingNorthingQuestion,
  EmailAddressQuestion,
  LatLongQuestion,
  LongAnswerQuestion,
  MonthYearQuestion,
  NationalGridQuestion,
  NumberOnlyQuestion,
  OsGridRefQuestion,
  PhoneNumberQuestion,
  Question,
  RadioSortableQuestion,
  SelectSortableQuestion,
  ShortAnswerQuestion,
  SupportingEvidenceQuestion,
  UkAddressQuestion,
  YesNoQuestion,
  govukFieldIsChecked,
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
  if (govukFieldIsChecked(govukField)) {
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
   * @type {string}
   * @protected
   */
  _userClasses = ''
  /**
   * @type {string}
   * @protected
   */
  _content = ''
  /**
   * @type {boolean}
   * @private
   */
  _largeTitle = true
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
  /**
   * @protected
   * @type {boolean}
   */
  _usePostcodeLookup = false
  /**
   * @type {string}
   * @protected
   */
  _prefix = ''
  /**
   * @type {string}
   * @protected
   */
  _suffix = ''
  /**
   * @type {string}
   * @protected
   */
  _instructionText = ''
  /**
   * @type {boolean}
   * @protected
   */
  _giveInstructions = false

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
      } else if (field.name === 'usePostcodeLookup') {
        this._usePostcodeLookup = getCheckedValue(field)
      } else if (field.name === 'classes') {
        this._userClasses = getValueAsString(field)
      } else if (field.name === 'prefix') {
        this._prefix = getValueAsString(field)
      } else if (field.name === 'suffix') {
        this._suffix = getValueAsString(field)
      } else if (field.name === 'instructionText') {
        this._instructionText = getValueAsString(field)
      } else if (field.name === 'giveInstructions') {
        this._giveInstructions = getCheckedValue(field)
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
      userClasses: this._userClasses,
      usePostcodeLookup: this._usePostcodeLookup,
      prefix: this._prefix,
      suffix: this._suffix,
      largeTitle: this._largeTitle,
      items: this._items,
      content: this._content,
      // Only include instructionText if giveInstructions is checked
      instructionText: this._giveInstructions ? this._instructionText : ''
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
  /** @type {Record<ComponentType|'Question', (q: ListElements|AutocompleteElements|NumberElements) => Question>} */ ({
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
      return new SelectSortableQuestion(questionElements, emptyRender)
    },
    /**
     * @param {NumberElements} numberElements
     * @returns {Question}
     */
    NumberField: (numberElements) => {
      return new NumberOnlyQuestion(numberElements, emptyRender)
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
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    DeclarationField: (questionElements) => {
      return new Question(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    EastingNorthingField: (questionElements) => {
      return new EastingNorthingQuestion(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    OsGridRefField: (questionElements) => {
      return new OsGridRefQuestion(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    NationalGridFieldNumberField: (questionElements) => {
      return new NationalGridQuestion(questionElements, emptyRender)
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    LatLongField: (questionElements) => {
      return new LatLongQuestion(questionElements, emptyRender)
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
 * @import { AutocompleteElements, ListElement, ListElements, NumberElements, QuestionElements, QuestionRenderer, QuestionBaseModel, GovukField, QuestionSessionState, ComponentType, PreviewQuestion } from '@defra/forms-model'
 */
