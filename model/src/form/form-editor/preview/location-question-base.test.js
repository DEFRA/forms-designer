import { buildEastingNorthingFieldComponent } from '~/src/__stubs__/components.js'
import {
  LocationPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import {
  LocationQuestion,
  LocationQuestionComponentPreviewElements
} from '~/src/form/form-editor/preview/location-question-base.js'

describe('location-question-base', () => {
  describe('LocationQuestionComponentPreviewElements', () => {
    it('should create instance with instruction text', () => {
      const component = buildEastingNorthingFieldComponent({
        title: 'Enter coordinates',
        hint: 'Provide easting and northing',
        options: {
          instructionText: 'Use the OS grid reference system'
        }
      })

      const elements = new LocationQuestionComponentPreviewElements(component)
      const values = /** @type {LocationSettings} */ (elements.values)

      expect(values.question).toBe('Enter coordinates')
      expect(values.hintText).toBe('Provide easting and northing')
      expect(values.instructionText).toBe('Use the OS grid reference system')
    })

    it('should handle empty instruction text', () => {
      const component = buildEastingNorthingFieldComponent({
        title: 'Enter coordinates',
        options: {}
      })

      const elements = new LocationQuestionComponentPreviewElements(component)
      const values = /** @type {LocationSettings} */ (elements.values)

      expect(values.instructionText).toBe('')
    })

    it('should handle undefined instructionText in options', () => {
      const component = buildEastingNorthingFieldComponent({
        title: 'Enter coordinates',
        options: {
          instructionText: undefined
        }
      })

      const elements = new LocationQuestionComponentPreviewElements(component)
      const values = /** @type {LocationSettings} */ (elements.values)

      expect(values.instructionText).toBe('')
    })
  })

  describe('LocationQuestion', () => {
    const renderer = new QuestionRendererStub(jest.fn())

    it('should create instance and get instructionText', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        instructionText: 'Please enter accurate coordinates'
      })

      const question = new LocationQuestion(elements, renderer)

      expect(question.instructionText).toBe('Please enter accurate coordinates')
    })

    it('should set instructionText and trigger render', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        instructionText: 'Initial instruction'
      })

      const question = new LocationQuestion(elements, renderer)

      expect(question.instructionText).toBe('Initial instruction')

      question.instructionText = 'Updated instruction'

      expect(question.instructionText).toBe('Updated instruction')
      expect(renderer.renderMock).toHaveBeenCalled()
    })

    it('should handle empty instruction text', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        instructionText: ''
      })

      const question = new LocationQuestion(elements, renderer)

      expect(question.instructionText).toBe('')
    })

    it('should update instruction text multiple times', () => {
      const elements = new LocationPreviewElements({
        ...baseElements,
        instructionText: 'First'
      })

      const question = new LocationQuestion(elements, renderer)

      question.instructionText = 'Second'
      expect(question.instructionText).toBe('Second')

      question.instructionText = 'Third'
      expect(question.instructionText).toBe('Third')

      expect(renderer.renderMock).toHaveBeenCalledTimes(2)
    })
  })
})

/**
 * @import { LocationSettings } from '~/src/form/form-editor/preview/types.js'
 */
