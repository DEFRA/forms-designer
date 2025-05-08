import {
  Question,
  QuestionElements
} from '~/src/javascripts/preview/question.js'

export class PhoneNumber extends Question {
  _questionTemplate = 'telephonenumberfield.njk'
  _fieldName = 'phoneNumberField'

  /**
   * @returns {PhoneNumber}
   */
  static setupPreview() {
    const address = new PhoneNumber(new QuestionElements())
    address.render()

    return address
  }
}

/**
 * @import { QuestionBaseModel } from '~/src/javascripts/preview/question.js'
 */
