import {
  testFormDefinitionWithNoPages,
  testFormDefinitionWithTwoPagesAndQuestions,
  testFormDefinitionWithTwoQuestions
} from '~/src/__stubs__/form-definition.js'
import { setPageHeadings } from '~/src/models/forms/editor-v2/pages.js'

describe('editor-v2 - pages model', () => {
  describe('setPageHeadings', () => {
    test('should return unchanged definition if no pages', () => {
      const res = setPageHeadings(testFormDefinitionWithNoPages)
      expect(res).toEqual(testFormDefinitionWithNoPages)
    })
    test('should return unchanged if page titles already set', () => {
      const res = setPageHeadings(testFormDefinitionWithTwoQuestions)
      expect(res).toEqual(testFormDefinitionWithTwoQuestions)
    })
    test('should populate page title from first question title', () => {
      const definitionWithNoPageTitles = {
        ...testFormDefinitionWithTwoQuestions
      }
      definitionWithNoPageTitles.pages[0].title = ''
      const res = setPageHeadings(definitionWithNoPageTitles)
      expect(res.pages[0].title).toBe('This is your first question')
    })
    test('should populate page titles from first question title on multiple pages', () => {
      const definitionWithNoPageTitles = {
        ...testFormDefinitionWithTwoPagesAndQuestions
      }
      definitionWithNoPageTitles.pages[0].title = ''
      definitionWithNoPageTitles.pages[1].title = ''
      const res = setPageHeadings(definitionWithNoPageTitles)
      expect(res.pages[0].title).toBe('This is your first question')
      expect(res.pages[1].title).toBe('This is your first question - page two')
    })
  })
})
