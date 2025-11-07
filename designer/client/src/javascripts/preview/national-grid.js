import {
  EventListeners,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'

/**
 * @implements {QuestionElements}
 */
export class NationalGridDomElements extends QuestionDomElements {
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
    // Only include instructionText if checkbox is checked
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

export class NationalGridEventListeners extends EventListeners {
  /**
   * @param {NationalGridQuestion} question
   * @param {NationalGridDomElements} baseElements
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

    const instructionTextListener = /** @type {ListenerRow} */ ([
      this.baseElements.instructionText,
      (_target) => {
        this._updateInstructionText()
      },
      'input'
    ])

    const giveInstructionsListener = /** @type {ListenerRow} */ ([
      this.baseElements.giveInstructions,
      (_target) => {
        this._updateInstructionText()
      },
      'change'
    ])

    return [...listeners, instructionTextListener, giveInstructionsListener]
  }

  /**
   * @returns {ListenerRow[]}
   */
  get highlightListeners() {
    const element = /** @type {HTMLInputElement | null} */ (
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
    return [...super._getHighlightListeners(), focusRow, blurRow]
  }
}

/**
 * @import { ListenerRow, LocationSettings, QuestionElements, NationalGridQuestion } from '@defra/forms-model'
 */
