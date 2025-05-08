import {
  Question,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'

export class PhoneNumber extends Question {
  _questionTemplate = 'telephonenumberfield.njk'
  _fieldName = 'phoneNumberField'

  /**
   * @returns {PhoneNumber}
   */
  static setupPreview() {
    const questionElements = new QuestionDomElements()
    const address = new PhoneNumber(questionElements)
    address.init(questionElements)

    return address
  }
}

/**
 * @import { QuestionBaseModel } from '~/src/javascripts/preview/question.js'
 */
