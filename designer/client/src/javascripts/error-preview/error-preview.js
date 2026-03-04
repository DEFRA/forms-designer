import {
  ComponentType,
  allowedErrorTemplateFunctions
} from '@defra/forms-model'
import capitalize from 'lodash/capitalize.js'
import lowerFirst from 'lodash/lowerFirst.js'

import { fieldMappings } from '~/src/javascripts/error-preview/field-mappings'
import { updateFileUploadErrorText } from '~/src/javascripts/error-preview/file-upload/error-display'
import { setupFileTypeListeners } from '~/src/javascripts/error-preview/file-upload/file-type-handler'
import { setupFileUploadValidation } from '~/src/javascripts/error-preview/file-upload/validations'
import { updateFileUploadVisibility } from '~/src/javascripts/error-preview/file-upload/visibility'

const MIN_LENGTH_PLACEHOLDER = '[min length]'
const MAX_LENGTH_PLACEHOLDER = '[max length]'
export class ErrorPreviewDomElements {
  /**
   * @param { ErrorPreviewFieldMappingDef | undefined } advancedFieldDefs
   */
  constructor(advancedFieldDefs) {
    const shortDescEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('shortDescription')
    )
    const shortDescTargetEls = /** @type {HTMLInputElement[]} */ (
      Array.from(
        document.getElementsByClassName('error-preview-shortDescription')
      )
    )

    /**
     * @type {HTMLInputElement|null}
     */
    this.shortDesc = shortDescEl
    /**
     * @type {HTMLInputElement[]}
     */
    this.shortDescTargets = shortDescTargetEls

    const fieldEntries = advancedFieldDefs
      ? Object.entries(advancedFieldDefs)
      : []

    /**
     * @type {{ id: string, source: HTMLInputElement, target: HTMLInputElement, placeholder: string }[] }
     */
    this.advancedFields = fieldEntries.map((field) => {
      const fieldDetails =
        /** @type {{ fieldName: string, placeholder: string }} */ (field[1])

      const source = /** @type {HTMLInputElement} */ (
        document.getElementById(fieldDetails.fieldName)
      )

      return {
        id: field[0],
        source,
        target: /** @type {HTMLInputElement} */ (
          document.getElementsByClassName(`error-preview-${field[0]}`)[0]
        ),
        placeholder: fieldDetails.placeholder
      }
    })
  }

  /**
   * @param {HTMLElementOrNull[]} targets
   */
  addHighlights(targets) {
    targets.forEach((elem) => elem?.classList.add('highlight'))
  }

  /**
   * @param {HTMLElementOrNull[]} targets
   */
  removeHighlights(targets) {
    targets.forEach((elem) => elem?.classList.remove('highlight'))
  }

  /**
   * Handle lowerFirst, including taking into account if text is a placeholder (starting with '[')
   * Also preserves "OS" as it's an acronym that should stay uppercase
   * @param {string} elemText
   */
  lowerFirstEnhanced(elemText) {
    if (elemText.length > 1 && elemText.startsWith('[')) {
      return `[${lowerFirst(elemText.substring(1))}`
    }

    if (elemText.toLowerCase().startsWith('os ')) {
      return 'OS' + elemText.substring(2)
    }

    if (elemText.toLowerCase().startsWith('national grid')) {
      return 'National Grid' + elemText.substring('national grid'.length)
    }
    return lowerFirst(elemText)
  }

  /**
   * @param { HTMLElement | null } elem
   * @param {string} newText
   */
  applyTemplateFunction(elem, newText) {
    const func = elem?.dataset.templatefunc ?? ''
    if (allowedErrorTemplateFunctions.includes(func)) {
      if (func === 'lowerFirst') {
        return this.lowerFirstEnhanced(newText)
      }
      if (func === 'capitalise') {
        return capitalize(newText)
      }
    }
    return newText
  }

  /**
   * @param { HTMLInputElement | null } source
   * @param {HTMLElementOrNull[]} targets
   * @param {string} placeholder
   */
  updateText(source, targets, placeholder) {
    targets.forEach((elem) => {
      if (elem) {
        // Skip elements marked as fixed (e.g., location field base errors like "Enter easting and northing")
        // This allows validation errors to still use custom short descriptions
        if (elem.dataset.fixed === 'true') {
          return
        }

        const sourceText = source?.value ?? ''
        const newText = sourceText !== '' ? sourceText : placeholder
        const newTextFinal = elem.dataset.templatefunc
          ? this.applyTemplateFunction(elem, newText)
          : newText

        // Only capitalize if element has an explicit capitalise template function
        // Validation errors should remain lowercase (e.g. "northing for location must be...")

        elem.textContent = newTextFinal
      }
    })
  }
}

/**
 * @typedef {[
 *   HTMLInputElement | null,
 *   (target: HTMLInputElement, e: Event) => void,
 *   keyof HTMLElementEventMap
 * ]} ListenerRow
 */

export class ErrorPreviewEventListeners {
  /**
   * @param {ErrorPreview} errorPreview
   * @param {ErrorPreviewDomElements} baseElements
   * @param {ComponentType | undefined} componentType
   */
  constructor(errorPreview, baseElements, componentType) {
    /**
     * @property {ErrorPreview} _errorPreview -
     * @protected
     */
    this._errorPreview = errorPreview
    this.baseElements = baseElements
    /**
     * @type {ComponentType | undefined}
     * @protected
     */
    this._componentType = componentType
  }

  /**
   * Get default placeholder text for error messages based on component type
   * @returns {string}
   * @protected
   */
  _getDefaultPlaceholder() {
    // All location fields now use [short description] placeholder for consistency
    return '[short description]'
  }

  /**
   * @param {HTMLElement | null} element
   * @param {(inputElement: HTMLInputElement, event: Event) => void} cb
   * @param {keyof HTMLElementEventMap} type
   * @protected
   */
  inputEventListener(element, cb, type) {
    if (element) {
      element.addEventListener(type, (e) => {
        const target = /** @type {HTMLInputElement} */ (e.target)
        cb(target, e)
      })
    }
  }

  /**
   * @private
   * @returns {ListenerRow[]}
   */
  get highlightListeners() {
    const shortDescListeners = [
      /** @type {ListenerRow} */ ([
        this.baseElements.shortDesc,
        () => {
          this.baseElements.addHighlights(this.baseElements.shortDescTargets)
        },
        'focus'
      ]),
      /** @type {ListenerRow} */ ([
        this.baseElements.shortDesc,
        () => {
          this.baseElements.removeHighlights(this.baseElements.shortDescTargets)
        },
        'blur'
      ])
    ]

    const advancedListeners = this.baseElements.advancedFields.flatMap(
      (element) => {
        const focusRow = /** @type {ListenerRow} */ ([
          element.source,
          () => {
            this.baseElements.addHighlights([element.target])
          },
          'focus'
        ])
        const blurRow = /** @type {ListenerRow} */ ([
          element.source,
          () => {
            this.baseElements.removeHighlights([element.target])
          },
          'blur'
        ])

        return /** @type {ListenerRow[]} */ [focusRow, blurRow]
      }
    )

    return [...shortDescListeners, ...advancedListeners]
  }

  /**
   * @protected
   * @returns {ListenerRow[]}
   */
  get listeners() {
    const shortDesc = /** @type {ListenerRow} */ ([
      this.baseElements.shortDesc,
      /**
       * @param {HTMLInputElement} _target
       */
      (_target) => {
        this.baseElements.updateText(
          this.baseElements.shortDesc,
          this.baseElements.shortDescTargets,
          this._getDefaultPlaceholder()
        )
      },
      'input'
    ])

    const advanced = /** @type {ListenerRow[]} */ (
      this.baseElements.advancedFields.map((field) => {
        return [
          field.source,
          /**
           * @param {HTMLInputElement} target
           */
          (target) => {
            this.baseElements.updateText(
              field.source,
              [field.target],
              field.placeholder
            )

            if (
              target.id === 'minFiles' ||
              target.id === 'maxFiles' ||
              target.id === 'exactFiles'
            ) {
              updateFileUploadErrorText(target.id, target.value)
            }

            if (target.id === 'minLength' || target.id === 'maxLength') {
              this._updateTextFieldErrorMessages()
            }
          },
          'input'
        ]
      })
    )

    return [...advanced, shortDesc, ...this.highlightListeners]
  }

  /**
   * Updates the visibility of error messages based on field changes
   * @param {{ id: string, source: HTMLInputElement }} field
   * @private
   */
  _updateErrorVisibility(field) {
    const minFilesInput = document.getElementById('minFiles')
    const maxFilesInput = document.getElementById('maxFiles')
    const exactFilesInput = document.getElementById('exactFiles')
    const minLengthInput = /** @type {HTMLInputElement | null} */ (
      document.getElementById('minLength')
    )
    const maxLengthInput = /** @type {HTMLInputElement | null} */ (
      document.getElementById('maxLength')
    )

    if (
      field.source === minFilesInput ||
      field.source === maxFilesInput ||
      field.source === exactFilesInput
    ) {
      updateFileUploadVisibility(field)
    }

    if (field.source === minLengthInput || field.source === maxLengthInput) {
      updateFileUploadVisibility(field)
    }
  }

  setupListeners() {
    for (const [el, cb, type] of this.listeners) {
      this.inputEventListener(el, cb, type)
    }

    this._updateTextFieldErrorMessages()

    const minFilesInput = /** @type {HTMLInputElement | null} */ (
      document.getElementById('minFiles')
    )
    if (minFilesInput) {
      this._updateErrorVisibility({ id: 'min', source: minFilesInput })
    }
  }

  /**
   * Updates placeholder spans with values from inputs
   * @private
   */
  _updateMinMaxPlaceholders() {
    const minLengthInput = /** @type {HTMLInputElement | null} */ (
      document.getElementById('minLength')
    )
    const maxLengthInput = /** @type {HTMLInputElement | null} */ (
      document.getElementById('maxLength')
    )

    if (!minLengthInput || !maxLengthInput) {
      return { minValue: '', maxValue: '' }
    }

    const minValue = minLengthInput.value
    const maxValue = maxLengthInput.value

    const minPlaceholderSpans = document.querySelectorAll('.error-preview-min')
    const maxPlaceholderSpans = document.querySelectorAll('.error-preview-max')

    minPlaceholderSpans.forEach((span) => {
      span.textContent = minValue || MIN_LENGTH_PLACEHOLDER
    })

    maxPlaceholderSpans.forEach((span) => {
      span.textContent = maxValue || MAX_LENGTH_PLACEHOLDER
    })

    return { minValue, maxValue }
  }

  /**
   * Updates the text in combined min/max error messages
   * @param {string} minValue - The minimum length value
   * @param {string} maxValue - The maximum length value
   * @private
   */
  _updateCombinedErrorMessages(minValue, maxValue) {
    const combinedErrorMessages = Array.from(
      document.querySelectorAll('.govuk-error-message')
    ).filter(
      (el) =>
        el.textContent?.includes('between') &&
        el.textContent.includes('characters')
    )

    combinedErrorMessages.forEach((errorMsg) => {
      // Find the last text node (the part that contains "between X and Y characters")
      const nodes = Array.from(errorMsg.childNodes)
      const shortDescNode = errorMsg.querySelector(
        '.error-preview-shortDescription'
      )
      const lastNode = nodes[nodes.length - 1]

      if (lastNode.nodeType === Node.TEXT_NODE) {
        const newText = ` must be between ${minValue || MIN_LENGTH_PLACEHOLDER} and ${maxValue || MAX_LENGTH_PLACEHOLDER} characters`
        lastNode.textContent = newText
      } else if (shortDescNode) {
        // If we can't find the text node but can find the short description,
        // we'll update the entire HTML after the short description
        const shortDescHTML = shortDescNode.outerHTML
        const remainingHTML = errorMsg.innerHTML.split(shortDescHTML)[1] || ''
        errorMsg.innerHTML = errorMsg.innerHTML.replace(
          remainingHTML,
          ` must be between ${minValue || MIN_LENGTH_PLACEHOLDER} and ${maxValue || MAX_LENGTH_PLACEHOLDER} characters`
        )
      } else {
        errorMsg.innerHTML += ` must be between ${minValue || MIN_LENGTH_PLACEHOLDER} and ${maxValue || MAX_LENGTH_PLACEHOLDER} characters`
      }
    })
  }

  /**
   * Controls visibility of error messages based on which inputs have values
   * @param {string} minValue - The minimum length value
   * @param {string} maxValue - The maximum length value
   * @private
   */
  _updateErrorVisibilityForTextFields(minValue, maxValue) {
    const hasMin = Boolean(minValue && minValue !== '0')
    const hasMax = Boolean(maxValue && maxValue !== '0')

    const allErrorMessages = document.querySelectorAll('.govuk-error-message')

    allErrorMessages.forEach((msg) => {
      const htmlMsg = /** @type {HTMLElement} */ (msg)
      const text = htmlMsg.textContent ?? ''

      const isMinOnly = text.includes('or more') && !text.includes('between')
      const isMaxOnly = text.includes('or less') && !text.includes('between')
      const isCombined = text.includes('between') && text.includes('characters')

      htmlMsg.style.display = this._getMessageDisplayValue(
        isMinOnly,
        isMaxOnly,
        isCombined,
        hasMin,
        hasMax
      )
    })
  }

  /**
   * Determines the display value for error messages based on their type and available values
   * @param {boolean} isMinOnly - Whether the message is for minimum length only
   * @param {boolean} isMaxOnly - Whether the message is for maximum length only
   * @param {boolean} isCombined - Whether the message is for combined min/max
   * @param {boolean} hasMin - Whether a minimum value is available
   * @param {boolean} hasMax - Whether a maximum value is available
   * @returns {string} The display value ('none' or '')
   * @private
   */
  _getMessageDisplayValue(isMinOnly, isMaxOnly, isCombined, hasMin, hasMax) {
    // Show min-only message when min is set (regardless of max)
    if (isMinOnly && hasMin) {
      return ''
    }
    // Show max-only message when max is set (regardless of min)
    if (isMaxOnly && hasMax) {
      return ''
    }
    // Show combined message when both are set
    if (isCombined && hasMin && hasMax) {
      return ''
    }
    return 'none'
  }

  /**
   * Main function that updates all min/max error message text and visibility
   * @private
   */
  _updateTextFieldErrorMessages() {
    const result = this._updateMinMaxPlaceholders()

    const { minValue, maxValue } = result
    if (!minValue && !maxValue) {
      return
    }

    this._updateCombinedErrorMessages(minValue, maxValue)
    this._updateErrorVisibilityForTextFields(minValue, maxValue)
  }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ErrorPreview {
  /**
   * @param {ErrorPreviewDomElements} htmlElements
   * @param {ComponentType | undefined} componentType
   */
  constructor(htmlElements, componentType) {
    /**
     * @type {ErrorPreviewDomElements}
     * @private
     */
    this._htmlElements = htmlElements

    const listeners = new ErrorPreviewEventListeners(
      this,
      htmlElements,
      componentType
    )
    listeners.setupListeners()

    /**
     * @type {ErrorPreviewEventListeners}
     * @protected
     */
    this._listeners = listeners
  }

  /**
   * @param {ComponentType} componentType
   * @returns {ErrorPreview}
   */
  static setupPreview(componentType) {
    const advancedFields = fieldMappings[componentType]

    const question = new ErrorPreview(
      new ErrorPreviewDomElements(advancedFields),
      componentType
    )

    if (componentType === ComponentType.FileUploadField) {
      setupFileTypeListeners()
    }

    return question
  }

  /**
   * Set up file upload validation helper
   * @static
   */
  static setupFileUploadValidation() {
    setupFileUploadValidation()
  }
}

/**
 * @import { ErrorPreviewFieldMappingDef, HTMLElementOrNull, HTMLInputElementOrNull, ListenerRow } from '@defra/forms-model'
 */
