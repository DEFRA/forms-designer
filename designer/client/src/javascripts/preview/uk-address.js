import {
  Question,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'

export class UkAddress extends Question {
  _questionTemplate = 'ukaddressfield.njk'
  _fieldName = 'addressField'

  /**
   * @returns {UkAddress}
   */
  static setupPreview() {
    const questionElements = new QuestionDomElements()
    const address = new UkAddress(questionElements)
    address.init(questionElements)

    return address
  }
}

/**
 * @import { QuestionBaseModel } from '~/src/javascripts/preview/question.js'
 */
