import { buildEastingNorthingFieldComponent } from '~/src/__stubs__/components.js'
import { ComponentType } from '~/src/components/enums.js'
import {
  LocationPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import {
  EastingNorthingComponentPreviewElements,
  EastingNorthingQuestion
} from '~/src/form/form-editor/preview/easting-northing.js'

describe('easting-northing', () => {
  describe('EastingNorthingComponentPreviewElements', () => {
    it('should create instance from component', () => {
      const component = buildEastingNorthingFieldComponent({
        title: 'Enter easting and northing',
        hint: 'Provide coordinates',
        options: {
          instructionText: 'Use OS grid system'
        }
      })

      const elements = new EastingNorthingComponentPreviewElements(component)
      const values = /** @type {LocationSettings} */ (elements.values)

      expect(values.question).toBe('Enter easting and northing')
      expect(values.hintText).toBe('Provide coordinates')
      expect(values.instructionText).toBe('Use OS grid system')
    })
  })

  describe('EastingNorthingQuestion', () => {
    const renderer = new QuestionRendererStub(jest.fn())

    it('should create instance with correct component type', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Easting and Northing',
        instructionText: 'Enter coordinates'
      })

      const question = new EastingNorthingQuestion(elements, renderer)

      expect(question.componentType).toBe(ComponentType.EastingNorthingField)
    })

    it('should render input with easting and northing fields', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter coordinates',
        hintText: 'Provide easting and northing values',
        instructionText: 'Use OS grid reference',
        userClasses: 'custom-class'
      })

      const question = new EastingNorthingQuestion(elements, renderer)

      expect(question.renderInput).toMatchObject({
        userClasses: 'custom-class',
        fieldset: {
          legend: {
            text: 'Enter coordinates',
            classes: ''
          }
        },
        instructionText: 'Use OS grid reference',
        details: {
          classes: ''
        },
        easting: {
          classes: ''
        },
        northing: {
          classes: ''
        }
      })
    })

    it('should highlight easting field when specified', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter coordinates',
        instructionText: 'Instructions'
      })

      const question = new EastingNorthingQuestion(elements, renderer)
      question.highlight = 'easting'

      const renderInput = /** @type {EastingNorthingModel} */ (
        question.renderInput
      )
      expect(renderInput.easting?.classes).toBe(HIGHLIGHT_CLASS)
      expect(renderInput.northing?.classes).toBe('')
    })

    it('should highlight northing field when specified', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter coordinates',
        instructionText: 'Instructions'
      })

      const question = new EastingNorthingQuestion(elements, renderer)
      question.highlight = 'northing'

      const renderInput = /** @type {EastingNorthingModel} */ (
        question.renderInput
      )
      expect(renderInput.easting?.classes).toBe('')
      expect(renderInput.northing?.classes).toBe(HIGHLIGHT_CLASS)
    })

    it('should highlight question when specified', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter coordinates',
        instructionText: 'Instructions'
      })

      const question = new EastingNorthingQuestion(elements, renderer)
      question.highlight = 'question'

      expect(question.renderInput.fieldset?.legend.classes).toBe(
        HIGHLIGHT_CLASS
      )
    })

    it('should highlight instructionText when specified', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter coordinates',
        instructionText: 'Instructions'
      })

      const question = new EastingNorthingQuestion(elements, renderer)
      question.highlight = 'instructionText'

      const renderInput = /** @type {EastingNorthingModel} */ (
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

      const question = new EastingNorthingQuestion(elements, renderer)

      expect(question.renderInput.fieldset?.legend.text).toBe('Question')
    })
  })
})

/**
 * @import { EastingNorthingModel } from '~/src/form/form-editor/macros/types.js'
 * @import { LocationSettings } from '~/src/form/form-editor/preview/types.js'
 */
