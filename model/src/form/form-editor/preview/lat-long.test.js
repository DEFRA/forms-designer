import { buildLatLongFieldComponent } from '~/src/__stubs__/components.js'
import { ComponentType } from '~/src/components/enums.js'
import {
  LocationPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import {
  LatLongComponentPreviewElements,
  LatLongQuestion
} from '~/src/form/form-editor/preview/lat-long.js'

describe('lat-long', () => {
  describe('LatLongComponentPreviewElements', () => {
    it('should create instance from component', () => {
      const component = buildLatLongFieldComponent({
        title: 'Enter latitude and longitude',
        hint: 'Provide coordinates in decimal degrees',
        options: {
          instructionText: 'Use WGS84 coordinate system'
        }
      })

      const elements = new LatLongComponentPreviewElements(component)
      const values = /** @type {LocationSettings} */ (elements.values)

      expect(values.question).toBe('Enter latitude and longitude')
      expect(values.hintText).toBe('Provide coordinates in decimal degrees')
      expect(values.instructionText).toBe('Use WGS84 coordinate system')
    })
  })

  describe('LatLongQuestion', () => {
    const renderer = new QuestionRendererStub(jest.fn())

    it('should create instance with correct component type', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Latitude and Longitude',
        instructionText: 'Enter coordinates'
      })

      const question = new LatLongQuestion(elements, renderer)

      expect(question.componentType).toBe(ComponentType.LatLongField)
    })

    it('should render input with latitude and longitude fields', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter coordinates',
        hintText: 'Provide latitude and longitude values',
        instructionText: 'Use decimal degrees',
        userClasses: 'custom-class'
      })

      const question = new LatLongQuestion(elements, renderer)

      expect(question.renderInput).toMatchObject({
        userClasses: 'custom-class',
        fieldset: {
          legend: {
            text: 'Enter coordinates',
            classes: ''
          }
        },
        instructionText: 'Use decimal degrees',
        details: {
          classes: ''
        },
        latitude: {
          classes: ''
        },
        longitude: {
          classes: ''
        }
      })
    })

    it('should highlight latitude field when specified', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter coordinates',
        instructionText: 'Instructions'
      })

      const question = new LatLongQuestion(elements, renderer)
      question.highlight = 'latitude'

      const renderInput = /** @type {LatLongModel} */ (question.renderInput)
      expect(renderInput.latitude?.classes).toBe(HIGHLIGHT_CLASS)
      expect(renderInput.longitude?.classes).toBe('')
    })

    it('should highlight longitude field when specified', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter coordinates',
        instructionText: 'Instructions'
      })

      const question = new LatLongQuestion(elements, renderer)
      question.highlight = 'longitude'

      const renderInput = /** @type {LatLongModel} */ (question.renderInput)
      expect(renderInput.latitude?.classes).toBe('')
      expect(renderInput.longitude?.classes).toBe(HIGHLIGHT_CLASS)
    })

    it('should highlight question when specified', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter coordinates',
        instructionText: 'Instructions'
      })

      const question = new LatLongQuestion(elements, renderer)
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

      const question = new LatLongQuestion(elements, renderer)
      question.highlight = 'instructionText'

      const renderInput = /** @type {LatLongModel} */ (question.renderInput)
      expect(renderInput.details?.classes).toBe(HIGHLIGHT_CLASS)
    })

    it('should use default question text when not provided', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: '',
        instructionText: 'Instructions'
      })

      const question = new LatLongQuestion(elements, renderer)

      expect(question.renderInput.fieldset?.legend.text).toBe('Question')
    })

    it('should include optional suffix when question is optional', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        question: 'Enter your location',
        optional: true,
        instructionText: ''
      })

      const question = new LatLongQuestion(elements, renderer)

      expect(question.renderInput.fieldset?.legend.text).toBe(
        'Enter your location (optional)'
      )
    })
  })
})

/**
 * @import { LatLongModel } from '~/src/form/form-editor/macros/types.js'
 * @import { LocationSettings } from '~/src/form/form-editor/preview/types.js'
 */
