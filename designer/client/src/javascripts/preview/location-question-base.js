import {
  EventListeners,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'

/**
 * Base class for location question DOM elements with instruction text support
 * @implements {QuestionElements}
 */
export class LocationQuestionDomElements extends QuestionDomElements {
  constructor() {
    super()
    const instructionTextEl = /** @type {HTMLTextAreaElement | null} */ (
      document.getElementById('instructionText')
    )
    const giveInstructionsEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('giveInstructions')
    )

    /**
     * @type {HTMLTextAreaElement|null}
     */
    this.instructionText = instructionTextEl
    /**
     * @type {HTMLInputElement|null}
     */
    this.giveInstructions = giveInstructionsEl
  }

  /**
   * @protected
   * @returns {LocationSettings}
   */
  constructValues() {
    const baseValues = super.constructValues()
    const showInstructions = this.giveInstructions?.checked ?? false

    return {
      ...baseValues,
      instructionText: showInstructions
        ? (this.instructionText?.value ?? '')
        : ''
    }
  }

  /**
   * @returns {LocationSettings}
   * @public
   */
  get values() {
    return this.constructValues()
  }
}

/**
 * Base class for location question event listeners with instruction text support
 */
export class LocationQuestionEventListeners extends EventListeners {
  /**
   * @param {any} question - The question instance with instructionText property
   * @param {LocationQuestionDomElements} baseElements
   */
  constructor(question, baseElements) {
    super(question, baseElements)
    this._question = question
    this.baseElements = baseElements
  }

  /**
   * Update the preview based on current checkbox and textarea state
   * @protected
   */
  _updateInstructionText() {
    const showInstructions =
      this.baseElements.giveInstructions?.checked ?? false
    const textValue = this.baseElements.instructionText?.value ?? ''
    this._question.instructionText = showInstructions ? textValue : ''
  }

  /**
   * @returns {ListenerRow[]}
   * @protected
   */
  _getListeners() {
    const listeners = super._getListeners()
    const additionalListeners = []

    if (this.baseElements.instructionText) {
      additionalListeners.push(
        /** @type {ListenerRow} */ ([
          this.baseElements.instructionText,
          (_target) => {
            this._updateInstructionText()
          },
          'input'
        ])
      )
    }

    if (this.baseElements.giveInstructions) {
      additionalListeners.push(
        /** @type {ListenerRow} */ ([
          this.baseElements.giveInstructions,
          (_target) => {
            this._updateInstructionText()
          },
          'change'
        ])
      )
    }

    return [...listeners, ...additionalListeners]
  }

  /**
   * @returns {ListenerRow[]}
   */
  get highlightListeners() {
    const baseListeners = super._getHighlightListeners()

    if (!this.baseElements.instructionText) {
      return baseListeners
    }

    const element = /** @type {HTMLTextAreaElement} */ (
      this.baseElements.instructionText
    )
    const highlight = /** @type {string} */ ('instructionText')

    const focusRow = /** @type {ListenerRow} */ ([
      element,
      (_target) => {
        this._question.highlight = highlight
      },
      'focus'
    ])
    const blurRow = /** @type {ListenerRow} */ ([
      element,
      (_target) => {
        this._question.highlight = null
      },
      'blur'
    ])

    return [...baseListeners, focusRow, blurRow]
  }
}

/**
 * @import { ListenerRow, LocationSettings, QuestionElements } from '@defra/forms-model'
 */
