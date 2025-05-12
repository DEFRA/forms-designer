import {
  DateInputQuestion,
  EmailAddressQuestion,
  ListQuestion,
  ListSortableQuestion,
  PhoneNumberQuestion,
  Question,
  RadioQuestion,
  RadioSortableQuestion,
  ShortAnswerQuestion,
  UkAddressQuestion
} from '@defra/forms-model'

import {
  ListSortableEventListeners,
  ListSortableQuestionElements
} from '~/src/javascripts/preview/list-sortable.js'
import {
  ListEventListeners,
  ListQuestionDomElements
} from '~/src/javascripts/preview/list.js'
import { NunjucksRenderer } from '~/src/javascripts/preview/nunjucks-renderer.js'
import {
  EventListeners,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'
import {
  RadioSortableEventListeners,
  RadioSortableQuestionElements
} from '~/src/javascripts/preview/radio-sortable.js'
import {
  RadioEventListeners,
  RadioQuestionDomElements
} from '~/src/javascripts/preview/radio.js'

export const SetupPreview = {
  Question() {
    const questionElements = new QuestionDomElements()
    const nunjucksRenderer = new NunjucksRenderer(questionElements)
    const question = new Question(questionElements, nunjucksRenderer)
    const listeners = new EventListeners(question, questionElements)
    listeners.setupListeners()

    return question
  },
  ShortAnswer() {
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
  DateInput() {
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
  EmailAddress() {
    const questionElements = new QuestionDomElements()
    const nunjucksRenderer = new NunjucksRenderer(questionElements)
    const email = new EmailAddressQuestion(questionElements, nunjucksRenderer)
    const listeners = new EventListeners(email, questionElements)
    listeners.setupListeners()

    return email
  },
  UkAddress() {
    const questionElements = new QuestionDomElements()
    const nunjucksRenderer = new NunjucksRenderer(questionElements)
    const address = new UkAddressQuestion(questionElements, nunjucksRenderer)
    const listeners = new EventListeners(address, questionElements)
    listeners.setupListeners()

    return address
  },
  PhoneNumber() {
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
  List() {
    const elements = new ListQuestionDomElements(NunjucksRenderer)
    const nunjucksRenderer = new NunjucksRenderer(elements)
    const list = new ListQuestion(elements, nunjucksRenderer)
    const listeners = new ListEventListeners(list, elements, [])
    listeners.setupListeners()

    return list
  },
  Radio() {
    const elements = new RadioQuestionDomElements(NunjucksRenderer)
    const nunjucksRenderer = new NunjucksRenderer(elements)
    const radio = new RadioQuestion(elements, nunjucksRenderer)
    const listeners = new RadioEventListeners(radio, elements, [])
    listeners.setupListeners()

    return radio
  },
  ListSortable() {
    const elements = new ListSortableQuestionElements(NunjucksRenderer)
    const nunjucksRenderer = new NunjucksRenderer(elements)
    const listSortable = new ListSortableQuestion(elements, nunjucksRenderer)
    const listeners = new ListSortableEventListeners(listSortable, elements, [])
    listeners.setupListeners()

    return listSortable
  },
  RadioSortable() {
    const elements = new RadioSortableQuestionElements(NunjucksRenderer)
    const nunjucksRenderer = new NunjucksRenderer(elements)
    const radio = new RadioSortableQuestion(elements, nunjucksRenderer)
    const listeners = new RadioSortableEventListeners(radio, elements, [])
    listeners.setupListeners()

    return radio
  }
}
