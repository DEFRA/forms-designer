import { testFormDefinitionWithSections } from '~/src/__stubs__/form-definition.js'
import { renameSectionViewModel } from '~/src/models/forms/editor-v2/rename-section.js'

describe('editor-v2 - rename-section model', () => {
  describe('renameSectionViewModel', () => {
    test('should throw if section not found', () => {
      expect(() =>
        renameSectionViewModel(
          testFormDefinitionWithSections,
          'missing-section-id',
          'http://return-url',
          undefined
        )
      ).toThrow('Section not found with id missing-section-id')
    })

    test('should return model if valid section', () => {
      const model = renameSectionViewModel(
        testFormDefinitionWithSections,
        'section1Id',
        'http://return-url',
        undefined
      )
      expect(model).toBeDefined()
    })
  })
})
