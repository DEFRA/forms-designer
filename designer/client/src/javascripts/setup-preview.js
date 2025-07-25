import {
  AutocompleteQuestion,
  CheckboxSortableQuestion,
  DateInputQuestion,
  EmailAddressQuestion,
  ListSortableQuestion,
  LongAnswerQuestion,
  MonthYearQuestion,
  NumberOnlyQuestion,
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
  ListSortableEventListeners,
  ListSortableQuestionElements
} from '~/src/javascripts/preview/list-sortable.js'
import { NunjucksRenderer } from '~/src/javascripts/preview/nunjucks-renderer.js'
import {
  EventListeners,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'
import {
  RadioSortableEventListeners,
  RadioSortableQuestionElements
} from '~/src/javascripts/preview/radio-sortable.js'

export const SetupPreview =
  /** @type {Record<ComponentType|'Question'|'ListSortable', () => PreviewQuestion>} */ ({
    /**
     * @returns {Question}
     */
    Question: () => {
      const questionElements = new QuestionDomElements()
      const nunjucksRenderer = new NunjucksRenderer(questionElements)
      const question = new Question(questionElements, nunjucksRenderer)
      const listeners = new EventListeners(question, questionElements)
      listeners.setupListeners()

      return question
    },
    Html: () => {
      return SetupPreview.Question()
    },
    InsetText: () => {
      return SetupPreview.Question()
    },
    Details: () => {
      return SetupPreview.Question()
    },
    List: () => {
      return SetupPreview.Question()
    },
    Markdown: () => {
      return SetupPreview.Question()
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
      const questionElements = new QuestionDomElements()
      const nunjucksRenderer = new NunjucksRenderer(questionElements)
      const numberField = new NumberOnlyQuestion(
        questionElements,
        nunjucksRenderer
      )
      const listeners = new EventListeners(numberField, questionElements)
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
      const questionElements = new QuestionDomElements()
      const nunjucksRenderer = new NunjucksRenderer(questionElements)
      const address = new UkAddressQuestion(questionElements, nunjucksRenderer)
      const listeners = new EventListeners(address, questionElements)
      listeners.setupListeners()

      return address
    },
    /**
     * @returns {UkAddressQuestion}
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
    }
  })
/**
 * @import { PreviewQuestion, ComponentType } from '@defra/forms-model'
 */
