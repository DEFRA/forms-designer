import {
  DateInputQuestion,
  EmailAddressQuestion,
  ListSortableQuestion,
  PhoneNumberQuestion,
  Question,
  RadioSortableQuestion,
  ShortAnswerQuestion,
  UkAddressQuestion
} from '@defra/forms-model'

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

export const SetupPreview = {
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
  ListSortable: () => {
    const elements = new ListSortableQuestionElements(NunjucksRenderer)
    const nunjucksRenderer = new NunjucksRenderer(elements)
    const listSortable = new ListSortableQuestion(elements, nunjucksRenderer)
    const listeners = new ListSortableEventListeners(listSortable, elements, [])
    listeners.setupListeners()

    return listSortable
  }
}
