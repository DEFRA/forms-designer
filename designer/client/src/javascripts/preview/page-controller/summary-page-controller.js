import { DomElements } from '~/src/javascripts/preview/dom-elements.js'
import {
  PageListenerBase,
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
  /**
   * @type {HTMLInputElement|null}
   */
  disableConfirmationEmail = null
  /**
   * @type {boolean}
   */
  showConfirmationEmailFallback
  /**
   * @type {string}
   */
  declarationTextFallback
  /**
   * @type {boolean}
   */
  needDeclarationFallback
  /**
   * @type {boolean}
   */
  isConfirmationEmailSettingsPanel

  /**
   * @param {SummaryPageInitialState} initialState
   */
  constructor(initialState) {
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
    this.disableConfirmationEmail = /** @type {HTMLInputElement|null} */ (
      document.getElementById('disableConfirmationEmail')
    )
    this.showConfirmationEmailFallback = initialState.showConfirmationEmail
    this.declarationTextFallback = initialState.declarationText
    this.needDeclarationFallback = initialState.needDeclaration
    this.isConfirmationEmailSettingsPanel =
      initialState.isConfirmationEmailSettingsPanel
  }

  get declarationText() {
    // If text input exists (on check-answers-settings page), read from it
    if (this.declarationTextElement) {
      return this.declarationTextElement.value
    }
    // Otherwise (on confirmation-email-settings page), read from server-provided fallback
    return this.declarationTextFallback
  }

  get declaration() {
    // If radio buttons exist (on check-answers-settings page), read from them
    if (this.needDeclarationYes || this.needDeclarationNo) {
      return this.needDeclarationYes?.checked ?? false
    }
    // Otherwise (on confirmation-email-settings page), read from server-provided fallback
    return this.needDeclarationFallback
  }

  get guidance() {
    return this.declarationText
  }

  get showConfirmationEmail() {
    // If check-box exists (on confirmation-email-settings page), read from it
    if (this.disableConfirmationEmail) {
      // If is checked, don't show confirmation email
      return !this.disableConfirmationEmail.checked
    }
    // Otherwise (on check-answers-settings page), read from server-provided fallback
    return this.showConfirmationEmailFallback
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
    disableConfirmationEmail: {
      change: {
        /**
         * @param {Event} inputEvent
         */
        handleEvent: (inputEvent) => {
          const checked = getTargetChecked(inputEvent)
          if (checked) {
            this._pageController.unsetShowConfirmationEmail()
          } else {
            this._pageController.setShowConfirmationEmail()
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
        this._summaryPageElements.disableConfirmationEmail,
        this._listeners.disableConfirmationEmail.change,
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
 * @import { SummaryPageElements, SummaryPageController, SummaryPageInitialState } from '@defra/forms-model'
 */
