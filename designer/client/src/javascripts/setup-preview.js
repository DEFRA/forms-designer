import {
  AutocompleteQuestion,
  CheckboxSortableQuestion,
  DateInputQuestion,
  DeclarationQuestion,
  EastingNorthingQuestion,
  EmailAddressQuestion,
  LatLongQuestion,
  ListSortableQuestion,
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
  YesNoQuestion
} from '@defra/forms-model'

import { AutocompleteRenderer } from '~/src/javascripts/preview/autocomplete-renderer.js'
import {
  AutocompleteDOMElements,
  AutocompleteListeners
} from '~/src/javascripts/preview/autocomplete.js'
import {
  DeclarationDomElements,
  DeclarationEventListeners
} from '~/src/javascripts/preview/declaration.js'
import {
  EastingNorthingDomElements,
  EastingNorthingEventListeners
} from '~/src/javascripts/preview/easting-northing.js'
import {
  LatLongDomElements,
  LatLongEventListeners
} from '~/src/javascripts/preview/lat-long.js'
import {
  ListSortableEventListeners,
  ListSortableQuestionElements
} from '~/src/javascripts/preview/list-sortable.js'
import {
  NationalGridDomElements,
  NationalGridEventListeners
} from '~/src/javascripts/preview/national-grid.js'
import {
  NumberDomElements,
  NumberEventListeners
} from '~/src/javascripts/preview/number'
import { NunjucksRenderer } from '~/src/javascripts/preview/nunjucks-renderer.js'
import {
  OsGridRefDomElements,
  OsGridRefEventListeners
} from '~/src/javascripts/preview/os-grid-ref.js'
import {
  EventListeners,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'
import {
  RadioSortableEventListeners,
  RadioSortableQuestionElements
} from '~/src/javascripts/preview/radio-sortable.js'
import {
  UkAddressDomElements,
  UkAddressEventListeners
} from '~/src/javascripts/preview/uk-address'

const SetupPreviewDefaultQuestion = () => {
  const questionElements = new QuestionDomElements()
  const nunjucksRenderer = new NunjucksRenderer(questionElements)
  const question = new Question(questionElements, nunjucksRenderer)
  const listeners = new EventListeners(question, questionElements)
  listeners.setupListeners()

  return question
}

export const SetupPreviewPartial =
  /** @type {Partial<Record<PreviewType, () => PreviewQuestion>>} */ ({
    /**
     * @returns {Question}
     */
    Question: () => {
      return SetupPreviewDefaultQuestion()
    },
    Html: () => {
      return SetupPreviewDefaultQuestion()
    },
    InsetText: () => {
      return SetupPreviewDefaultQuestion()
    },
    Details: () => {
      return SetupPreviewDefaultQuestion()
    },
    List: () => {
      return SetupPreviewDefaultQuestion()
    },
    Markdown: () => {
      return SetupPreviewDefaultQuestion()
    },
    /**
     * @returns {ShortAnswerQuestion}
     */
    TextField: () => {
      const questionElements = new QuestionDomElements()
      const nunjucksRenderer = new NunjucksRenderer(questionElements)
      const textfield = new ShortAnswerQuestion(
        questionElements,
        nunjucksRenderer
      )
      const listeners = new EventListeners(textfield, questionElements)
      listeners.setupListeners()

      return textfield
    },
    /**
     * @returns {NumberOnlyQuestion}
     */
    NumberField: () => {
      const numberElements = new NumberDomElements()
      const nunjucksRenderer = new NunjucksRenderer(numberElements)
      const numberField = new NumberOnlyQuestion(
        numberElements,
        nunjucksRenderer
      )
      const listeners = new NumberEventListeners(numberField, numberElements)
      listeners.setupListeners()

      return numberField
    },
    MultilineTextField: () => {
      const questionElements = new QuestionDomElements()
      const nunjucksRenderer = new NunjucksRenderer(questionElements)
      const textfield = new LongAnswerQuestion(
        questionElements,
        nunjucksRenderer
      )
      const listeners = new EventListeners(textfield, questionElements)
      listeners.setupListeners()

      return textfield
    },
    /**
     * @returns {DateInputQuestion}
     */
    DatePartsField: () => {
      const questionElements = new QuestionDomElements()
      const nunjucksRenderer = new NunjucksRenderer(questionElements)
      const dateInputField = new DateInputQuestion(
        questionElements,
        nunjucksRenderer
      )
      const listeners = new EventListeners(dateInputField, questionElements)
      listeners.setupListeners()

      return dateInputField
    },
    /**
     * @returns {MonthYearQuestion}
     */
    MonthYearField: () => {
      const questionElements = new QuestionDomElements()
      const nunjucksRenderer = new NunjucksRenderer(questionElements)
      const dateInputField = new MonthYearQuestion(
        questionElements,
        nunjucksRenderer
      )
      const listeners = new EventListeners(dateInputField, questionElements)
      listeners.setupListeners()

      return dateInputField
    },
    /**
     * @returns {EmailAddressQuestion}
     */
    EmailAddressField: () => {
      const questionElements = new QuestionDomElements()
      const nunjucksRenderer = new NunjucksRenderer(questionElements)
      const email = new EmailAddressQuestion(questionElements, nunjucksRenderer)
      const listeners = new EventListeners(email, questionElements)
      listeners.setupListeners()

      return email
    },
    /**
     * @returns {SupportingEvidenceQuestion}
     */
    FileUploadField: () => {
      const questionElements = new QuestionDomElements()
      const nunjucksRenderer = new NunjucksRenderer(questionElements)
      const supportingEvidenceQuestion = new SupportingEvidenceQuestion(
        questionElements,
        nunjucksRenderer
      )
      const listeners = new EventListeners(
        supportingEvidenceQuestion,
        questionElements
      )
      listeners.setupListeners()

      return supportingEvidenceQuestion
    },
    /**
     * @returns {UkAddressQuestion}
     */
    UkAddressField: () => {
      const questionElements = new UkAddressDomElements()
      const nunjucksRenderer = new NunjucksRenderer(questionElements)
      const address = new UkAddressQuestion(questionElements, nunjucksRenderer)
      const listeners = new UkAddressEventListeners(address, questionElements)
      listeners.setupListeners()

      return address
    },
    /**
     * @returns {YesNoQuestion}
     */
    YesNoField: () => {
      const questionElements = new QuestionDomElements()
      const nunjucksRenderer = new NunjucksRenderer(questionElements)
      const yesNoQuestion = new YesNoQuestion(
        questionElements,
        nunjucksRenderer
      )
      const listeners = new EventListeners(yesNoQuestion, questionElements)
      listeners.setupListeners()

      return yesNoQuestion
    },
    /**
     * @returns {PhoneNumberQuestion}
     */
    TelephoneNumberField: () => {
      const questionElements = new QuestionDomElements()
      const nunjucksRenderer = new NunjucksRenderer(questionElements)
      const phoneNumber = new PhoneNumberQuestion(
        questionElements,
        nunjucksRenderer
      )
      const listeners = new EventListeners(phoneNumber, questionElements)
      listeners.setupListeners()

      return phoneNumber
    },
    /**
     * @returns {RadioSortableQuestion}
     */
    RadiosField: () => {
      const elements = new RadioSortableQuestionElements(NunjucksRenderer)
      const nunjucksRenderer = new NunjucksRenderer(elements)
      const radio = new RadioSortableQuestion(elements, nunjucksRenderer)
      const listeners = new RadioSortableEventListeners(radio, elements, [])
      listeners.setupListeners()

      return radio
    },
    /**
     * @returns {SelectSortableQuestion}
     */
    SelectField: () => {
      const elements = new ListSortableQuestionElements(NunjucksRenderer)
      const nunjucksRenderer = new NunjucksRenderer(elements)
      const select = new SelectSortableQuestion(elements, nunjucksRenderer)
      const listeners = new ListSortableEventListeners(select, elements, [])
      listeners.setupListeners()

      return select
    },
    /**
     * @returns {CheckboxSortableQuestion}
     */
    CheckboxesField: () => {
      const elements = new ListSortableQuestionElements(NunjucksRenderer)
      const nunjucksRenderer = new NunjucksRenderer(elements)
      const radio = new CheckboxSortableQuestion(elements, nunjucksRenderer)
      const listeners = new ListSortableEventListeners(radio, elements, [])
      listeners.setupListeners()

      return radio
    },
    /**
     * @returns {AutocompleteQuestion}
     */
    AutocompleteField: () => {
      const elements = new AutocompleteDOMElements()
      const nunjucksRenderer = new AutocompleteRenderer(elements)
      const autocompleteQuestion = new AutocompleteQuestion(
        elements,
        nunjucksRenderer
      )
      const listeners = new AutocompleteListeners(
        autocompleteQuestion,
        elements
      )
      listeners.setupListeners()

      return autocompleteQuestion
    },
    /**
     * @returns {ListSortableQuestion}
     */
    ListSortable: () => {
      const elements = new ListSortableQuestionElements(NunjucksRenderer)
      const nunjucksRenderer = new NunjucksRenderer(elements)
      const listSortable = new ListSortableQuestion(elements, nunjucksRenderer)
      const listeners = new ListSortableEventListeners(
        listSortable,
        elements,
        []
      )
      listeners.setupListeners()

      return listSortable
    },
    DeclarationField: () => {
      const declarationElements = new DeclarationDomElements()
      const nunjucksRenderer = new NunjucksRenderer(declarationElements)
      const declarationField = new DeclarationQuestion(
        declarationElements,
        nunjucksRenderer
      )
      const listeners = new DeclarationEventListeners(
        declarationField,
        declarationElements
      )
      listeners.setupListeners()

      return declarationField
    },
    /**
     * @returns {EastingNorthingQuestion}
     */
    EastingNorthingField: () => {
      const eastingNorthingElements = new EastingNorthingDomElements()
      const nunjucksRenderer = new NunjucksRenderer(eastingNorthingElements)
      const eastingNorthingField = new EastingNorthingQuestion(
        eastingNorthingElements,
        nunjucksRenderer
      )
      const listeners = new EastingNorthingEventListeners(
        eastingNorthingField,
        eastingNorthingElements
      )
      listeners.setupListeners()

      return eastingNorthingField
    },
    /**
     * @returns {OsGridRefQuestion}
     */
    OsGridRefField: () => {
      const osGridRefElements = new OsGridRefDomElements()
      const nunjucksRenderer = new NunjucksRenderer(osGridRefElements)
      const osGridRefField = new OsGridRefQuestion(
        osGridRefElements,
        nunjucksRenderer
      )
      const listeners = new OsGridRefEventListeners(
        osGridRefField,
        osGridRefElements
      )
      listeners.setupListeners()

      return osGridRefField
    },
    /**
     * @returns {NationalGridQuestion}
     */
    NationalGridFieldNumberField: () => {
      const nationalGridElements = new NationalGridDomElements()
      const nunjucksRenderer = new NunjucksRenderer(nationalGridElements)
      const nationalGridField = new NationalGridQuestion(
        nationalGridElements,
        nunjucksRenderer
      )
      const listeners = new NationalGridEventListeners(
        nationalGridField,
        nationalGridElements
      )
      listeners.setupListeners()

      return nationalGridField
    },
    /**
     * @returns {LatLongQuestion}
     */
    LatLongField: () => {
      const latLongElements = new LatLongDomElements()
      const nunjucksRenderer = new NunjucksRenderer(latLongElements)
      const latLongField = new LatLongQuestion(
        latLongElements,
        nunjucksRenderer
      )
      const listeners = new LatLongEventListeners(latLongField, latLongElements)
      listeners.setupListeners()

      return latLongField
    },
    HiddenField: () => {
      return SetupPreviewDefaultQuestion()
    }
  })

/**
 * @param {PreviewType} type
 * @returns {PreviewQuestion}
 */
export function SetupPreview(type) {
  const preview = SetupPreviewPartial[type]
  return preview ? preview() : SetupPreviewDefaultQuestion()
}

/**
 * @import { PreviewType, PreviewQuestion } from '@defra/forms-model'
 */
