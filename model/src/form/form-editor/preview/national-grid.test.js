import { buildNationalGridFieldNumberFieldComponent } from '~/src/__stubs__/components.js'
import { ComponentType } from '~/src/components/enums.js'
import {
  LocationPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import {
  NationalGridComponentPreviewElements,
  NationalGridQuestion
} from '~/src/form/form-editor/preview/national-grid.js'

describe('national-grid', () => {
  describe('NationalGridComponentPreviewElements', () => {
    it('should create instance from component', () => {
      const component = buildNationalGridFieldNumberFieldComponent({
        title: 'Enter National Grid field number',
        hint: 'For example, SO04188589',
        options: {
          instructionText: 'Enter the 10-character field number'
        }
      })

      const elements = new NationalGridComponentPreviewElements(component)
      const values = /** @type {LocationSettings} */ (elements.values)

      expect(values.question).toBe('Enter National Grid field number')
      expect(values.hintText).toBe('For example, SO04188589')
      expect(values.instructionText).toBe('Enter the 10-character field number')
    })
  })

  describe('NationalGridQuestion', () => {
    const renderer = new QuestionRendererStub(jest.fn())

    it('should create instance with correct component type', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'National Grid field number',
        instructionText: 'Enter field number'
      })

      const question = new NationalGridQuestion(elements, renderer)

      expect(question.componentType).toBe(
        ComponentType.NationalGridFieldNumberField
      )
    })

    it('should render input with label and input classes', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter field number',
        hintText: 'Example: SO04188589',
        instructionText: 'Use National Grid format',
        userClasses: 'custom-class'
      })

      const question = new NationalGridQuestion(elements, renderer)

      expect(question.renderInput).toMatchObject({
        userClasses: 'custom-class',
        fieldset: {
          legend: {
            text: 'Enter field number',
            classes: ''
          }
        },
        label: {
          text: 'Enter field number',
          classes: ''
        },
        instructionText: 'Use National Grid format',
        details: {
          classes: ''
        },
        inputClasses: ''
      })
    })

    it('should highlight input field when specified', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter field number',
        instructionText: 'Instructions'
      })

      const question = new NationalGridQuestion(elements, renderer)
      question.highlight = 'input'

      const renderInput = /** @type {NationalGridModel} */ (
        question.renderInput
      )
      expect(renderInput.inputClasses).toBe(HIGHLIGHT_CLASS)
    })

    it('should highlight question in both legend and label when specified', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter field number',
        instructionText: 'Instructions'
      })

      const question = new NationalGridQuestion(elements, renderer)
      question.highlight = 'question'

      const renderInput = /** @type {NationalGridModel} */ (
        question.renderInput
      )
      expect(renderInput.fieldset?.legend.classes).toBe(HIGHLIGHT_CLASS)
      expect(renderInput.label?.classes).toBe(HIGHLIGHT_CLASS)
    })

    it('should highlight instructionText when specified', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter field number',
        instructionText: 'Instructions'
      })

      const question = new NationalGridQuestion(elements, renderer)
      question.highlight = 'instructionText'

      const renderInput = /** @type {NationalGridModel} */ (
        question.renderInput
      )
      expect(renderInput.details?.classes).toBe(HIGHLIGHT_CLASS)
    })

    it('should use default question text when not provided', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: '',
        instructionText: 'Instructions'
      })

      const question = new NationalGridQuestion(elements, renderer)

      const renderInput = /** @type {NationalGridModel} */ (
        question.renderInput
      )
      expect(renderInput.fieldset?.legend.text).toBe('Question')
      expect(renderInput.label?.text).toBe('Question')
    })

    it('should not highlight when highlight is null', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter field number',
        instructionText: 'Instructions'
      })

      const question = new NationalGridQuestion(elements, renderer)
      question.highlight = null

      const renderInput = /** @type {NationalGridModel} */ (
        question.renderInput
      )
      expect(renderInput.inputClasses).toBe('')
      expect(renderInput.fieldset?.legend.classes).toBe('')
      expect(renderInput.label?.classes).toBe('')
      expect(renderInput.details?.classes).toBe('')
    })
  })
})

/**
 * @import { NationalGridModel } from '~/src/form/form-editor/macros/types.js'
 * @import { LocationSettings } from '~/src/form/form-editor/preview/types.js'
 */
