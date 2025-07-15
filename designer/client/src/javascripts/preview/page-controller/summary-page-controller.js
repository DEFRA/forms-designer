import { DomElements } from '~/src/javascripts/preview/dom-elements.js'
import {
  PageListenerBase
  // getTargetChecked
} from '~/src/javascripts/preview/page-controller/page-listener.js'

/**
 * @implements {SummaryPageElements}
 */
export class SummaryPagePreviewDomElements extends DomElements {
  /**
   * @type {HTMLInputElement|null}
   */
  needDeclarationNo = null
  /**
   * @type {HTMLInputElement|null}
   */
  needDeclarationYes = null
  /**
   * @type {HTMLFormElement|null}
   */
  needDeclarationForm = null
  /**
   *
   * @type {HTMLInputElement|null}
   */
  declarationTextElement = null

  constructor() {
    super()
    this.needDeclarationYes = /** @type {HTMLFormElement|null} */ (
      document.getElementById('needDeclaration-2')
    )
    this.needDeclarationNo = /** @type {HTMLFormElement|null} */ (
      document.getElementById('needDeclaration')
    )
    this.declarationTextElement = /** @type {HTMLInputElement|null} */ (
      document.getElementById('declarationText')
    )
    this.needDeclarationForm = /** @type {HTMLFormElement|null} */ (
      document.getElementById('checkAnswersForm')
    )
  }

  get declarationText() {
    return this.declarationTextElement.value || undefined
  }

  get declaration() {
    return this.needDeclarationYes.checked
  }
}

export class SummaryPagePreviewListeners extends PageListenerBase {
  // _listeners = {
  //   needDeclarationYes: {
  //     change: {
  //       /**
  //        * @param {Event} inputEvent
  //        */
  //       handleEvent: (inputEvent) => {
  //         // if (inputEvent.target.checked) {
  //         //   this._pageController
  //         // }
  //         // if (inputEvent.target.name === 'needDeclaration') {
  //         //   this._pageController.showTitle = getTargetChecked(inputEvent)
  //         // }
  //       }
  //     }
  //   }
  // }
}

/**
 * @import { SummaryPageElements } from  '~/src/form/form-editor/preview/types.js'
 */
