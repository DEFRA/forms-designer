import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { GeospatialQuestion } from '~/src/form/form-editor/preview/geospatial.js'

describe('geospatial', () => {
  const renderer = new QuestionRendererStub(jest.fn())
  describe('Geospatial', () => {
    it('should create class', () => {
      const elements = new QuestionPreviewElements(baseElements)
      const res = new GeospatialQuestion(elements, renderer)

      expect(res).toBeDefined()
      expect(res.renderInput).toEqual({
        id: 'geospatialField',
        name: 'geospatialField',
        classes: '',
        label: {
          text: 'Which quest would you like to pick?',
          classes: 'govuk-label--l',
          isPageHeading: true
        },
        hint: {
          text: 'Choose one adventure that best suits you.',
          classes: ''
        },
        previewClasses: ''
      })
      expect(res.titleText).toBe('Which quest would you like to pick?')
      expect(res.question).toBe('Which quest would you like to pick?')
      expect(res.hintText).toBe('Choose one adventure that best suits you.')
      expect(res.optional).toBeFalsy()
      expect(res.highlight).toBeNull()
    })
  })
})
