import {
  PagePreviewDomElements,
  PagePreviewListeners
} from '~/src/javascripts/preview/page-controller/page-controller.js'

/**
 * @implements {PageOverviewElements}
 */
export class ReorderQuestionsPagePreviewDomElements extends PagePreviewDomElements {
  /**
   * @type {HTMLInputElement[]}
   */
  questionUpDownButtonElements = []

  /**
   * @type {HTMLInputElement|null}
   */
  listItemOrderElement = null

  constructor() {
    super()
    this.questionUpDownButtonElements = /** @type {HTMLInputElement[]} */ (
      Array.from(document.getElementsByClassName('reorder-button-js'))
    )
    this.listItemOrderElement = /** @type {HTMLInputElement|null} */ (
      document.getElementById('itemOrder')
    )
  }

  findActiveReorderElement() {
    return /** @type {HTMLInputElement | null } */ (
      document.querySelector('.reorder-panel-focus')
    )
  }
}

export class ReorderQuestionsPagePreviewListeners extends PagePreviewListeners {
  /**
   *
   * @param {ReorderQuestionsPageController} pageController
   * @param {ReorderQuestionsPagePreviewDomElements} baseElements
   */
  constructor(pageController, baseElements) {
    super(pageController, baseElements)
    this._pageController = pageController
    this._baseElements = baseElements
  }

  _reorderListeners = {
    questionUpDownButtonElement: {
      focus: {
        /**
         * @param {FocusEvent} _focusEvent
         */
        handleEvent: (_focusEvent) => {
          const questionId =
            _focusEvent.target instanceof HTMLButtonElement
              ? _focusEvent.target.dataset.questionid
              : undefined
          if (questionId) {
            this._pageController.highlightQuestion(questionId)
          }
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
    listItemOrder: {
      change: {
        /**
         * @param {{ target: HTMLInputElement | null }} _inputEvent
         */
        handleEvent: (_inputEvent) => {
          this._pageController.reorderComponents(_inputEvent.target?.value)
          this._pageController.render()

          // Re-assert highlight on question
          const buttonElem = this._baseElements.findActiveReorderElement()
          if (buttonElem) {
            const questionId = buttonElem.dataset.id

            if (questionId) {
              this._pageController.highlightQuestion(questionId)
            }
          }
        }
      }
    }
  }

  getUpDownListeners() {
    return {
      upDownButtonListenersFocus:
        this._baseElements.questionUpDownButtonElements.map((butt) => {
          return [
            butt,
            this._reorderListeners.questionUpDownButtonElement.focus,
            'focus'
          ]
        }),
      upDownButtonListenersBlur:
        this._baseElements.questionUpDownButtonElements.map((butt) => {
          return [
            butt,
            this._reorderListeners.questionUpDownButtonElement.blur,
            'blur'
          ]
        })
    }
  }

  /**
   * @returns {[HTMLInputElement|null, EventListenerObject, string][]}
   */
  getListeners() {
    const upDownListeners = this.getUpDownListeners()

    const allListeners = [
      ...super.getListeners(),
      [
        this._baseElements.listItemOrderElement,
        this._reorderListeners.listItemOrder.change,
        'change'
      ],
      ...upDownListeners.upDownButtonListenersFocus,
      ...upDownListeners.upDownButtonListenersBlur
    ]

    return /** @type {[HTMLInputElement, EventListenerObject, string][]} */ (
      allListeners
    )
  }
}

/**
 * @import { PageOverviewElements, ReorderQuestionsPageController } from '@defra/forms-model'
 */
