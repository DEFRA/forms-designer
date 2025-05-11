import { DateInput } from '~/src/javascripts/preview/date-input.js'
import { EmailAddress } from '~/src/javascripts/preview/email-address.js'
import {
  ListSortable,
  ListSortableQuestionElements
} from '~/src/javascripts/preview/list-sortable.js'
import {
  List,
  ListQuestionDomElements
} from '~/src/javascripts/preview/list.js'
import { NunjucksRenderer } from '~/src/javascripts/preview/nunjucks-renderer.js'
import { PhoneNumber } from '~/src/javascripts/preview/phone-number.js'
import {
  Question,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'
import {
  RadioSortable,
  RadioSortableQuestionElements
} from '~/src/javascripts/preview/radio-sortable.js'
import {
  Radio,
  RadioQuestionDomElements
} from '~/src/javascripts/preview/radio.js'
import { ShortAnswer } from '~/src/javascripts/preview/short-answer.js'
import { UkAddress } from '~/src/javascripts/preview/uk-address.js'

export const SetupPreview = {
  /**
   * @returns {Question}
   */
  Question() {
    const questionElements = new QuestionDomElements()
    const nunjucksRenderer = new NunjucksRenderer(questionElements)
    const question = new Question(questionElements, nunjucksRenderer)

    question.init(questionElements)

    return question
  },
  /**
   * @returns {ShortAnswer}
   */
  ShortAnswer() {
    const questionElements = new QuestionDomElements()
    const nunjucksRenderer = new NunjucksRenderer(questionElements)
    const textfield = new ShortAnswer(questionElements, nunjucksRenderer)

    textfield.init(questionElements)

    return textfield
  },
  /**
   * @returns {DateInput}
   */
  DateInput() {
    const questionElements = new QuestionDomElements()
    const nunjucksRenderer = new NunjucksRenderer(questionElements)
    const dateInputField = new DateInput(questionElements, nunjucksRenderer)
    dateInputField.init(questionElements)

    return dateInputField
  },
  EmailAddress() {
    const questionElements = new QuestionDomElements()
    const nunjucksRenderer = new NunjucksRenderer(questionElements)
    const email = new EmailAddress(questionElements, nunjucksRenderer)
    email.init(questionElements)

    return email
  },
  UkAddress() {
    const questionElements = new QuestionDomElements()
    const nunjucksRenderer = new NunjucksRenderer(questionElements)
    const address = new UkAddress(questionElements, nunjucksRenderer)
    address.init(questionElements)

    return address
  },
  PhoneNumber() {
    const questionElements = new QuestionDomElements()
    const nunjucksRenderer = new NunjucksRenderer(questionElements)
    const address = new PhoneNumber(questionElements, nunjucksRenderer)
    address.init(questionElements)

    return address
  },
  List() {
    const elements = new ListQuestionDomElements(NunjucksRenderer)
    const nunjucksRenderer = new NunjucksRenderer(elements)
    const list = new List(elements, nunjucksRenderer)
    list.render()

    return list
  },
  Radio() {
    const elements = new RadioQuestionDomElements(NunjucksRenderer)
    const nunjucksRenderer = new NunjucksRenderer(elements)
    const radio = new Radio(elements, nunjucksRenderer)
    radio.init(elements)

    return radio
  },
  ListSortable() {
    const elements = new ListSortableQuestionElements(NunjucksRenderer)
    const nunjucksRenderer = new NunjucksRenderer(elements)
    const listSortable = new ListSortable(elements, nunjucksRenderer)
    listSortable.init(elements)

    return listSortable
  },
  RadioSortable() {
    const elements = new RadioSortableQuestionElements(NunjucksRenderer)
    const nunjucksRenderer = new NunjucksRenderer(elements)
    const radio = new RadioSortable(elements, nunjucksRenderer)
    radio.init(elements)

    return radio
  }
}
