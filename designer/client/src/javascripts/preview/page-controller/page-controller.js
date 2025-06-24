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

  constructor() {
    super()
    this.headingElement = /** @type {HTMLInputElement|null} */ (
      document.getElementById('pageHeading')
    )
    this.guidanceElement = /** @type {HTMLInputElement|null} */ (
      document.getElementById('guidanceText')
    )
  }

  get guidance() {
    return this.guidanceElement?.value ?? ''
  }

  get heading() {
    return this.headingElement?.value ?? ''
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

export class PagePreviewListeners {
  /**
   * @type {PreviewPageController}
   * @private
   */
  _pageController
  /**
   * @type {PagePreviewDomElements}
   * @private
   */
  _baseElements

  _listeners = {
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
    }
  }

  /**
   *
   * @param {PreviewPageController} pageController
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
 * @import { PageOverviewElements, PreviewPageController, DomElementsBase } from '@defra/forms-model'
 */
