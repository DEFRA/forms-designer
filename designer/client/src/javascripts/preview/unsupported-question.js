import { DomElements } from '~/src/javascripts/preview/dom-elements.js'

/**
 * @class UnsupportedQuestionDomElements
 * @classdesc
 * This class is responsible for interaction with the Document Object Model
 * and provides an interface for external interactions.
 * @implements {QuestionElements}
 */
export class UnsupportedQuestionDomElements extends DomElements {
  /**
   * @returns {BaseSettings}
   * @public
   */
  get values() {
    return {
      question: '',
      hintText: '',
      optional: true,
      shortDesc: '',
      userClasses: '',
      items: [],
      content: ''
    }
  }
}

/**
 * @import { BaseSettings, QuestionElements } from '@defra/forms-model'
 */
