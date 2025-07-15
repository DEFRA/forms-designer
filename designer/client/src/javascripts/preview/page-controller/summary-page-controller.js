import { DomElements } from '~/src/javascripts/preview/dom-elements.js'
import {
  PageListenerBase,
  // getTargetChecked
  getTargetChecked,
  getTargetValue
} from '~/src/javascripts/preview/page-controller/page-listener.js'

/**
 * @implements {SummaryPageElements}
 */
export class SummaryPagePreviewDomElements extends DomElements {
  /**
   * @readonly
   * @type {string}
   */
  heading = 'Check your answers before sending your form'

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
    this.needDeclarationYes = /** @type {HTMLInputElement|null} */ (
      document.getElementById('needDeclaration-2')
    )
    this.needDeclarationNo = /** @type {HTMLInputElement|null} */ (
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
    return this.declarationTextElement?.value ?? ''
  }

  get declaration() {
    return this.needDeclarationYes?.checked ?? false
  }

  get guidance() {
    return this.declarationText
  }
}

export class SummaryPagePreviewListeners extends PageListenerBase {
  /**
   * @private
   * @type {SummaryPagePreviewDomElements}
   */
  _summaryPageElements

  /**
   * @type {SummaryPageController}
   * @protected
   */
  _pageController

  _listeners = {
    needDeclarationYes: {
      change: {
        /**
         * @param {Event} inputEvent
         */
        handleEvent: (inputEvent) => {
          const checked = getTargetChecked(inputEvent)
          if (checked) {
            this._pageController.setMakeDeclaration()
          }
        }
      }
    },
    needDeclarationNo: {
      change: {
        /**
         * @param {Event} inputEvent
         */
        handleEvent: (inputEvent) => {
          const checked = getTargetChecked(inputEvent)
          if (checked) {
            this._pageController.unsetMakeDeclaration()
          }
        }
      }
    },
    declarationTextElement: {
      focus: {
        /**
         * @param {Event} _inputEvent
         */
        handleEvent: (_inputEvent) => {
          this._pageController.highlightDeclaration()
        }
      },
      blur: {
        /**
         * @param {Event} _inputEvent
         */
        handleEvent: (_inputEvent) => {
          this._pageController.unhighlightDeclaration()
        }
      },
      input: {
        /**
         * @param {InputEvent} inputEvent
         */
        handleEvent: (inputEvent) => {
          this._pageController.declarationText = getTargetValue(inputEvent)
        }
      }
    }
  }

  /**
   * @param {SummaryPageController} pageController
   * @param {SummaryPagePreviewDomElements} summaryPreviewElements
   */
  constructor(pageController, summaryPreviewElements) {
    super(pageController, summaryPreviewElements)
    this._summaryPageElements = summaryPreviewElements
    this._pageController = pageController
  }

  /**
   * @returns {[HTMLInputElement|null, EventListenerObject, string][]}
   */
  getListeners() {
    return [
      [
        this._summaryPageElements.needDeclarationYes,
        this._listeners.needDeclarationYes.change,
        'change'
      ],
      [
        this._summaryPageElements.needDeclarationNo,
        this._listeners.needDeclarationNo.change,
        'change'
      ],
      [
        this._summaryPageElements.declarationTextElement,
        this._listeners.declarationTextElement.focus,
        'focus'
      ],
      [
        this._summaryPageElements.declarationTextElement,
        this._listeners.declarationTextElement.blur,
        'blur'
      ],
      [
        this._summaryPageElements.declarationTextElement,
        this._listeners.declarationTextElement.input,
        'input'
      ]
    ]
  }
}

/**
 * @import { SummaryPageElements, SummaryPageController } from '@defra/forms-model'
 */
