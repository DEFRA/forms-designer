import {
  buildDefinition,
  buildFileUploadPage,
  buildMetaData,
  buildQuestionPage,
  buildSummaryPage
} from '~/src/__stubs__/form-definition.js'
import {
  hasUnderlyingHeadingData,
  questionsViewModel
} from '~/src/models/forms/editor-v2/questions.js'

describe('editor-v2 - questions model', () => {
  describe('hasUnderlyingData', () => {
    test('should return true if value 1 supplied', () => {
      expect(hasUnderlyingHeadingData('value', undefined)).toBeTruthy()
      expect(hasUnderlyingHeadingData('value', '')).toBeTruthy()
    })
    test('should return true if value 2 supplied', () => {
      expect(hasUnderlyingHeadingData(undefined, 'value')).toBeTruthy()
      expect(hasUnderlyingHeadingData('', 'value')).toBeTruthy()
    })
    test('should return true if both values supplied', () => {
      expect(hasUnderlyingHeadingData('val1', 'val2')).toBeTruthy()
    })
    test('should return false if neither value supplied', () => {
      expect(hasUnderlyingHeadingData(undefined, undefined)).toBeFalsy()
      expect(hasUnderlyingHeadingData(undefined, '')).toBeFalsy()
      expect(hasUnderlyingHeadingData('', undefined)).toBeFalsy()
      expect(hasUnderlyingHeadingData('', '')).toBeFalsy()
    })
  })

  describe('questionsViewModel', () => {
    const metadata = buildMetaData()
    const pageId = '85e5c8da-88f5-4009-a821-7d7de1364318'

    it('should not show repeater option if page type is FileUpload controller', () => {
      const definition = buildDefinition({
        pages: [buildFileUploadPage({ id: pageId }), buildSummaryPage()],
        engine: 'V2'
      })

      const modelResult = questionsViewModel(metadata, definition, pageId)
      expect(modelResult.fields.repeater).toBeUndefined()
    })

    it('should show repeater option if page type is FileUpload controller', () => {
      const definition = buildDefinition({
        pages: [buildQuestionPage({ id: pageId }), buildSummaryPage()],
        engine: 'V2'
      })
      const modelResult = questionsViewModel(metadata, definition, pageId)
      expect(modelResult.fields.repeater).toBeDefined()
    })
  })
})
