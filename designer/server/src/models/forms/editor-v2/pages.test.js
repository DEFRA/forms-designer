import {
  testFormDefinitionWithNoPages,
  testFormDefinitionWithTwoPagesAndQuestions,
  testFormDefinitionWithTwoQuestions
} from '~/src/__stubs__/form-definition.js'
import {
  mapPageData,
  mapQuestionRows
} from '~/src/models/forms/editor-v2/pages.js'

describe('editor-v2 - pages model', () => {
  describe('mapPageData', () => {
    test('should return unchanged definition if no pages', () => {
      const res = mapPageData(testFormDefinitionWithNoPages)
      expect(res).toEqual(testFormDefinitionWithNoPages)
    })
    test('should populate page title from first question title', () => {
      const definitionWithNoPageTitles = {
        ...testFormDefinitionWithTwoQuestions
      }
      definitionWithNoPageTitles.pages[0].title = ''
      const res = mapPageData(definitionWithNoPageTitles)
      expect(res.pages[0].title).toBe('This is your first question')
    })
    test('should populate page titles from first question title on multiple pages', () => {
      const definitionWithNoPageTitles = {
        ...testFormDefinitionWithTwoPagesAndQuestions
      }
      definitionWithNoPageTitles.pages[0].title = ''
      definitionWithNoPageTitles.pages[1].title = ''
      const res = mapPageData(definitionWithNoPageTitles)
      expect(res.pages[0].title).toBe('This is your first question')
      expect(res.pages[1].title).toBe('This is your first question - page two')
    })
  })

  describe('mapQuestionRows', () => {
    test('should map question rows', () => {
      const resPageOneQuestions = mapQuestionRows(
        testFormDefinitionWithTwoPagesAndQuestions.pages[0]
      )
      const resPageTwoQuestions = mapQuestionRows(
        testFormDefinitionWithTwoPagesAndQuestions.pages[1]
      )
      const resPageSummaryQuestions = mapQuestionRows(
        testFormDefinitionWithTwoPagesAndQuestions.pages[2]
      )

      expect(resPageOneQuestions).toHaveLength(2)
      expect(resPageOneQuestions[0]).toEqual({
        key: {
          text: 'Question 1'
        },
        value: {
          text: 'This is your first question'
        }
      })
      expect(resPageOneQuestions[1]).toEqual({
        key: {
          text: 'Question 2'
        },
        value: {
          text: 'This is your second question'
        }
      })

      expect(resPageTwoQuestions).toHaveLength(2)
      expect(resPageTwoQuestions[0]).toEqual({
        key: {
          text: 'Question 1'
        },
        value: {
          text: 'This is your first question - page two'
        }
      })
      expect(resPageTwoQuestions[1]).toEqual({
        key: {
          text: 'Question 2'
        },
        value: {
          text: 'This is your second question - page two'
        }
      })
      expect(resPageSummaryQuestions).toHaveLength(0)
    })
  })
})
