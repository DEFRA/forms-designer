import {
  ComponentType,
  allowedErrorTemplateFunctions
} from '@defra/forms-model'
import lowerFirst from 'lodash/lowerFirst.js'

import { fieldMappings } from '~/src/javascripts/error-preview/field-mappings'
import { updateFileUploadErrorText } from '~/src/javascripts/error-preview/file-upload/error-display'
import { setupFileTypeListeners } from '~/src/javascripts/error-preview/file-upload/file-type-handler'
import {
  setupFileUploadValidation,
  setupFormSubmissionCleanup
} from '~/src/javascripts/error-preview/file-upload/validations'
import { updateFileUploadVisibility } from '~/src/javascripts/error-preview/file-upload/visibility'

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const fieldEntries = advancedFieldDefs
      ? Object.entries(advancedFieldDefs)
      : []

    /**
     * @type {{ id: string, source: HTMLInputElement, target: HTMLInputElement, placeholder: string }[] }
     */
    this.advancedFields = fieldEntries.map((field) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
   * @param {string} elemText
   */
  lowerFirstEnhanced(elemText) {
    if (elemText.length > 1 && elemText.startsWith('[')) {
      return `[${lowerFirst(elemText.substring(1))}`
    }
    return lowerFirst(elemText)
  }

  /**
   * @param { HTMLInputElement | null } elem
   * @param {string} newText
   */
  applyTemplateFunction(elem, newText) {
    const func = elem?.dataset.templatefunc ?? ''
    if (allowedErrorTemplateFunctions.includes(func)) {
      if (func === 'lowerFirst') {
        return this.lowerFirstEnhanced(newText)
      }
    }

    return newText
  }

  /**
   * @param { HTMLInputElement | null } source
   * @param {HTMLInputElementOrNull[]} targets
   * @param {string} placeholder
   */
  updateText(source, targets, placeholder) {
    targets.forEach((elem) => {
      if (elem) {
        const sourceText = source?.value ?? ''
        const newText = sourceText !== '' ? sourceText : placeholder
        const newTextFinal = elem.dataset.templatefunc
          ? this.applyTemplateFunction(elem, newText)
          : newText
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
   */
  constructor(errorPreview, baseElements) {
    /**
     * @property {ErrorPreview} _errorPreview -
     * @protected
     */
    this._errorPreview = errorPreview
    this.baseElements = baseElements
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
          '[Short description]'
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
    const minLengthInput = document.getElementById('minLength')

    // Handle file upload field visibility if this is a file field
    if (
      field.source === minFilesInput ||
      field.source === maxFilesInput ||
      field.source === exactFilesInput
    ) {
      updateFileUploadVisibility(field)
    }

    // Handle text field min/max if this is a text field
    if (field.source === minLengthInput) {
      updateFileUploadVisibility(field)
    }
  }

  setupListeners() {
    for (const [el, cb, type] of this.listeners) {
      this.inputEventListener(el, cb, type)
    }

    const minLengthInput = /** @type {HTMLInputElement | null} */ (
      document.getElementById('minLength')
    )
    if (minLengthInput) {
      this._updateErrorVisibility({ id: 'min', source: minLengthInput })
    }

    const minFilesInput = /** @type {HTMLInputElement | null} */ (
      document.getElementById('minFiles')
    )
    if (minFilesInput) {
      this._updateErrorVisibility({ id: 'min', source: minFilesInput })
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ErrorPreview {
  /**
   * @param {ErrorPreviewDomElements} htmlElements
   */
  constructor(htmlElements) {
    /**
     * @type {ErrorPreviewDomElements}
     * @private
     */
    this._htmlElements = htmlElements

    const listeners = new ErrorPreviewEventListeners(this, htmlElements)
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const advancedFields = fieldMappings[componentType]

    const question = new ErrorPreview(
      new ErrorPreviewDomElements(advancedFields)
    )

    if (componentType === ComponentType.FileUploadField) {
      // Set up file type handling
      setupFileTypeListeners()

      // Set up form submission cleanup
      setupFormSubmissionCleanup()
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
