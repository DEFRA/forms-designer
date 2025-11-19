import { buildOsGridRefFieldComponent } from '~/src/__stubs__/components.js'
import { ComponentType } from '~/src/components/enums.js'
import {
  LocationPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import {
  OsGridRefComponentPreviewElements,
  OsGridRefQuestion
} from '~/src/form/form-editor/preview/os-grid-ref.js'

describe('os-grid-ref', () => {
  describe('OsGridRefComponentPreviewElements', () => {
    it('should create instance from component', () => {
      const component = buildOsGridRefFieldComponent({
        title: 'Enter OS grid reference',
        hint: 'For example, TQ123456',
        options: {
          instructionText: 'Enter the 12-character reference'
        }
      })

      const elements = new OsGridRefComponentPreviewElements(component)
      const values = /** @type {LocationSettings} */ (elements.values)

      expect(values.question).toBe('Enter OS grid reference')
      expect(values.hintText).toBe('For example, TQ123456')
      expect(values.instructionText).toBe('Enter the 12-character reference')
    })
  })

  describe('OsGridRefQuestion', () => {
    const renderer = new QuestionRendererStub(jest.fn())

    it('should create instance with correct component type', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'OS grid reference',
        instructionText: 'Enter reference'
      })

      const question = new OsGridRefQuestion(elements, renderer)

      expect(question.componentType).toBe(ComponentType.OsGridRefField)
    })

    it('should render input with label and input classes', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter grid reference',
        hintText: 'Example: TQ123456',
        instructionText: 'Use OS grid format',
        userClasses: 'custom-class'
      })

      const question = new OsGridRefQuestion(elements, renderer)

      expect(question.renderInput).toMatchObject({
        userClasses: 'custom-class',
        fieldset: {
          legend: {
            text: 'Enter grid reference',
            classes: ''
          }
        },
        label: {
          text: 'Enter grid reference',
          classes: ''
        },
        instructionText: 'Use OS grid format',
        details: {
          classes: ''
        },
        inputClasses: ''
      })
    })

    it('should highlight input field when specified', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter grid reference',
        instructionText: 'Instructions'
      })

      const question = new OsGridRefQuestion(elements, renderer)
      question.highlight = 'input'

      const renderInput = /** @type {OsGridRefModel} */ (question.renderInput)
      expect(renderInput.inputClasses).toBe(HIGHLIGHT_CLASS)
    })

    it('should highlight question in both legend and label when specified', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter grid reference',
        instructionText: 'Instructions'
      })

      const question = new OsGridRefQuestion(elements, renderer)
      question.highlight = 'question'

      const renderInput = /** @type {OsGridRefModel} */ (question.renderInput)
      expect(renderInput.fieldset?.legend.classes).toBe(HIGHLIGHT_CLASS)
      expect(renderInput.label?.classes).toBe(HIGHLIGHT_CLASS)
    })

    it('should highlight instructionText when specified', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter grid reference',
        instructionText: 'Instructions'
      })

      const question = new OsGridRefQuestion(elements, renderer)
      question.highlight = 'instructionText'

      const renderInput = /** @type {OsGridRefModel} */ (question.renderInput)
      expect(renderInput.details?.classes).toBe(HIGHLIGHT_CLASS)
    })

    it('should use default question text when not provided', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: '',
        instructionText: 'Instructions'
      })

      const question = new OsGridRefQuestion(elements, renderer)

      const renderInput = /** @type {OsGridRefModel} */ (question.renderInput)
      expect(renderInput.fieldset?.legend.text).toBe('Question')
      expect(renderInput.label?.text).toBe('Question')
    })

    it('should not highlight when highlight is null', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter grid reference',
        instructionText: 'Instructions'
      })

      const question = new OsGridRefQuestion(elements, renderer)
      question.highlight = null

      const renderInput = /** @type {OsGridRefModel} */ (question.renderInput)
      expect(renderInput.inputClasses).toBe('')
      expect(renderInput.fieldset?.legend.classes).toBe('')
      expect(renderInput.label?.classes).toBe('')
      expect(renderInput.details?.classes).toBe('')
    })
  })
})

/**
 * @import { OsGridRefModel } from '~/src/form/form-editor/macros/types.js'
 * @import { LocationSettings } from '~/src/form/form-editor/preview/types.js'
 */
