import { PreviewPageControllerBase } from '@defra/forms-model'

import { DomElements } from '~/src/javascripts/preview/dom-elements.js'

/**
 * @implements {PageOverviewElements}
 */
export class PagePreviewDomElements extends DomElements {
  static WRAPPER_ID = 'page-preview-inner'

  /**
   * @type {HTMLInputElement|null}
   */
  headingElement = null
  /**
   * @type {HTMLInputElement|null}
   */
  guidanceElement = null
  /**
   *
   * @type {HTMLInputElement|null}
   */
  addPageHeadingElement = null
  /**
   * @type {HTMLInputElement|null}
   */
  repeaterElement = null
  /**
   * @type {HTMLInputElement|null}
   */
  questionSetNameElement = null

  constructor() {
    super()
    this.headingElement = /** @type {HTMLInputElement|null} */ (
      document.getElementById('pageHeading')
    )
    this.guidanceElement = /** @type {HTMLInputElement|null} */ (
      document.getElementById('guidanceText')
    )
    this.addPageHeadingElement = /** @type {HTMLInputElement|null} */ (
      document.getElementById('pageHeadingAndGuidance')
    )
    this.repeaterElement = /** @type {HTMLInputElement|null} */ (
      document.getElementById('repeater')
    )
    this.questionSetNameElement = /** @type {HTMLInputElement|null} */ (
      document.getElementById('questionSetName')
    )
  }

  get guidance() {
    return this.guidanceElement?.value ?? ''
  }

  get heading() {
    return this.headingElement?.value ?? ''
  }

  get addHeading() {
    return this.addPageHeadingElement?.checked ?? false
  }

  get hasRepeater() {
    return this.repeaterElement?.checked ?? false
  }

  get repeatQuestion() {
    return this.questionSetNameElement?.value ?? undefined
  }
}

/**
 * @param {InputEvent} inputEvent
 * @returns {string}
 */
function getTargetValue(inputEvent) {
  const target = /** @type {HTMLInputElement} */ (inputEvent.target)
  return target.value
}

/**
 * @param {Event} changeEvent
 * @returns {boolean}
 */
function getTargetChecked(changeEvent) {
  const target = /** @type {HTMLInputElement} */ (changeEvent.target)
  return target.checked
}

export class PagePreviewListeners {
  /**
   * @type {PreviewPageControllerBase}
   * @private
   */
  _pageController
  /**
   * @type {PagePreviewDomElements}
   * @private
   */
  _baseElements

  _listeners = {
    addPageHeadingElement: {
      change: {
        /**
         * @param {Event} inputEvent
         */
        handleEvent: (inputEvent) => {
          this._pageController.showTitle = getTargetChecked(inputEvent)
        }
      }
    },
    heading: {
      input: {
        /**
         * @param {InputEvent} inputEvent
         */
        handleEvent: (inputEvent) => {
          this._pageController.title = getTargetValue(inputEvent)
        }
      },
      focus: {
        /**
         * @param {FocusEvent} _inputEvent
         */
        handleEvent: (_inputEvent) => {
          this._pageController.highlightTitle()
        }
      },
      blur: {
        /**
         * @param {FocusEvent} _inputEvent
         */
        handleEvent: (_inputEvent) => {
          this._pageController.clearHighlight()
        }
      }
    },
    guidance: {
      input: {
        /**
         * @param {InputEvent} inputEvent
         */
        handleEvent: (inputEvent) => {
          this._pageController.guidanceText = getTargetValue(inputEvent)
        }
      },
      focus: {
        /**
         * @param {FocusEvent} _focusEvent
         */
        handleEvent: (_focusEvent) => {
          this._pageController.highlightGuidance()
        }
      },
      blur: {
        /**
         * @param {FocusEvent} _focusEvent
         */
        handleEvent: (_focusEvent) => {
          this._pageController.clearHighlight()
        }
      }
    },
    repeaterElement: {
      change: {
        /**
         * @param {Event} inputEvent
         */
        handleEvent: (inputEvent) => {
          const checked = getTargetChecked(inputEvent)
          if (checked) {
            this._pageController.setRepeater()
          } else {
            this._pageController.unsetRepeater()
          }
        }
      }
    },
    questionSetNameElement: {
      input: {
        /**
         * @param {InputEvent} inputEvent
         */
        handleEvent: (inputEvent) => {
          this._pageController.sectionTitleText = getTargetValue(inputEvent)
        }
      },
      focus: {
        /**
         * @param {FocusEvent} _focusEvent
         */
        handleEvent: (_focusEvent) => {
          this._pageController.setHighLighted(
            PreviewPageControllerBase.HighlightClass.REPEATER
          )
        }
      },
      blur: {
        /**
         * @param {FocusEvent} _focusEvent
         */
        handleEvent: (_focusEvent) => {
          this._pageController.clearHighlight()
        }
      }
    }
  }

  /**
   *
   * @param {PreviewPageControllerBase} pageController
   * @param {PagePreviewDomElements} baseElements
   */
  constructor(pageController, baseElements) {
    this._pageController = pageController
    this._baseElements = baseElements
  }

  /**
   * @returns {[HTMLInputElement|null, EventListenerObject, string][]}
   */
  getListeners() {
    return [
      [
        this._baseElements.headingElement,
        this._listeners.heading.input,
        'input'
      ],
      [
        this._baseElements.headingElement,
        this._listeners.heading.focus,
        'focus'
      ],
      [this._baseElements.headingElement, this._listeners.heading.blur, 'blur'],
      [
        this._baseElements.guidanceElement,
        this._listeners.guidance.input,
        'input'
      ],
      [
        this._baseElements.guidanceElement,
        this._listeners.guidance.focus,
        'focus'
      ],
      [
        this._baseElements.guidanceElement,
        this._listeners.guidance.blur,
        'blur'
      ],
      [
        this._baseElements.addPageHeadingElement,
        this._listeners.addPageHeadingElement.change,
        'change'
      ],
      [
        this._baseElements.repeaterElement,
        this._listeners.repeaterElement.change,
        'change'
      ],
      [
        this._baseElements.questionSetNameElement,
        this._listeners.questionSetNameElement.input,
        'input'
      ],
      [
        this._baseElements.questionSetNameElement,
        this._listeners.questionSetNameElement.focus,
        'focus'
      ],
      [
        this._baseElements.questionSetNameElement,
        this._listeners.questionSetNameElement.blur,
        'blur'
      ]
    ]
  }

  /**
   * @private
   */
  _setListeners() {
    const listeners = this.getListeners()
    for (const [htmlInputElement, eventListener, listenerType] of listeners) {
      if (htmlInputElement) {
        htmlInputElement.addEventListener(listenerType, eventListener)
      }
    }
  }

  initListeners() {
    this._setListeners()
    this._pageController.render()
  }

  clearListeners() {
    const listeners = this.getListeners()
    for (const [htmlInputElement, eventListener, listenerType] of listeners) {
      if (htmlInputElement) {
        htmlInputElement.removeEventListener(listenerType, eventListener)
      }
    }
  }
}

/**
 * @import { PageOverviewElements, DomElementsBase } from '@defra/forms-model'
 */
