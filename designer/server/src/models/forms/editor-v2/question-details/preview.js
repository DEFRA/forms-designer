import {
  AutocompleteQuestion,
  CheckboxSortableQuestion,
  DateInputQuestion,
  EastingNorthingQuestion,
  EmailAddressQuestion,
  HiddenQuestion,
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
   * Field name to handler mapping
   * @type {Record<string, (field: GovukField, instance: QuestionPreviewElements) => void>}
   * @private
   * @static
   */
  static _fieldHandlers = {
    question: (field, instance) => {
      instance._question = getValueAsString(field)
    },
    hintText: (field, instance) => {
      instance._hintText = getValueAsString(field)
    },
    questionOptional: (field, instance) => {
      instance._optional = getCheckedValue(field)
    },
    shortDescription: (field, instance) => {
      instance._shortDesc = getValueAsString(field)
    },
    autoCompleteOptions: (field, instance) => {
      instance.autocompleteOptions = getValueAsString(field)
    },
    usePostcodeLookup: (field, instance) => {
      instance._usePostcodeLookup = getCheckedValue(field)
    },
    classes: (field, instance) => {
      instance._userClasses = getValueAsString(field)
    },
    prefix: (field, instance) => {
      instance._prefix = getValueAsString(field)
    },
    suffix: (field, instance) => {
      instance._suffix = getValueAsString(field)
    },
    instructionText: (field, instance) => {
      instance._instructionText = getValueAsString(field)
    },
    giveInstructions: (field, instance) => {
      instance._giveInstructions = getCheckedValue(field)
    }
  }

  /**
   *
   * @param {GovukField[]} basePageFields
   * @param {QuestionSessionState|undefined} state
   */
  constructor(basePageFields, state) {
    basePageFields.forEach((field) => {
      if (field.name && field.name in QuestionPreviewElements._fieldHandlers) {
        QuestionPreviewElements._fieldHandlers[field.name](field, this)
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
      return new EastingNorthingQuestion(
        /** @type {LocationElements} */ (questionElements),
        emptyRender
      )
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    OsGridRefField: (questionElements) => {
      return new OsGridRefQuestion(
        /** @type {LocationElements} */ (questionElements),
        emptyRender
      )
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    NationalGridFieldNumberField: (questionElements) => {
      return new NationalGridQuestion(
        /** @type {LocationElements} */ (questionElements),
        emptyRender
      )
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    LatLongField: (questionElements) => {
      return new LatLongQuestion(
        /** @type {LocationElements} */ (questionElements),
        emptyRender
      )
    },
    /**
     * @param {QuestionElements} questionElements
     * @returns {Question}
     */
    HiddenField: (questionElements) => {
      return new HiddenQuestion(questionElements, emptyRender)
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
 * @import { AutocompleteElements, ListElement, ListElements, LocationElements, NumberElements, QuestionElements, QuestionRenderer, QuestionBaseModel, GovukField, QuestionSessionState, ComponentType, PreviewQuestion } from '@defra/forms-model'
 */
