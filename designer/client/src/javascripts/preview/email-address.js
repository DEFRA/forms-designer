import {
  Question,
  QuestionElements
} from '~/src/javascripts/preview/question.js'

export class EmailAddress extends Question {
  _questionTemplate = 'emailaddressfield.njk'
  _fieldName = 'emailAddressField'

  /**
   * @returns {EmailAddress}
   */
  static setupPreview() {
    const email = new EmailAddress(new QuestionElements())
    email.render()

    return email
  }
}
