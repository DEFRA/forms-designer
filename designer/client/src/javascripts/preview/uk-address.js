import {
  Question,
  QuestionElements
} from '~/src/javascripts/preview/question.js'

export class UkAddress extends Question {
  _questionTemplate = 'ukaddressfield.njk'
  _fieldName = 'addressField'

  /**
   * @returns {UkAddress}
   */
  static setupPreview() {
    const address = new UkAddress(new QuestionElements())
    address.render()

    return address
  }
}

/**
 * @import { QuestionBaseModel } from '~/src/javascripts/preview/question.js'
 */
