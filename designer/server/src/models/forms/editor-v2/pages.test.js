import { ComponentType } from '@defra/forms-model'

import {
  testFormDefinitionWithExistingSummaryDeclaration,
  testFormDefinitionWithNoPages,
  testFormDefinitionWithTwoPagesAndQuestions,
  testFormDefinitionWithTwoQuestions
} from '~/src/__stubs__/form-definition.js'
import {
  hideFirstGuidance,
  mapPageData,
  mapQuestionRows
} from '~/src/models/forms/editor-v2/pages.js'

/**
 * @param {ComponentDef[] | undefined} components
 */
function insertGuidanceAtTop(components) {
  if (!components) {
    return
  }

  components.unshift({
    id: '8045384f-b03a-49d8-bc0f-b8d2eb14765d',
    name: 'markdown',
    title: 'markdown',
    type: ComponentType.Markdown,
    content: '# line1\r\n## line2\r\n### line3',
    options: {}
  })
}

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

      const resPageSummaryExistingMarkdown = mapQuestionRows(
        testFormDefinitionWithExistingSummaryDeclaration.pages[1]
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
          text: 'This is your second question - page two (optional)'
        }
      })
      expect(resPageSummaryQuestions).toHaveLength(0)

      expect(resPageSummaryExistingMarkdown).toHaveLength(1)
      expect(resPageSummaryExistingMarkdown[0]).toEqual({
        key: {
          text: 'Markdown'
        },
        value: {
          html: '<pre class="break-on-newlines"><p class="govuk-body">Declaration text</p></pre>',
          classes: 'with-ellipsis'
        }
      })
    })
  })

  describe('hideFirstGuidance', () => {
    test('should return unchanged page if no guidance components at first position', () => {
      const [page1, page2] = testFormDefinitionWithTwoQuestions.pages
      const page1Res = hideFirstGuidance(page1)
      expect(page1Res.components).toEqual(
        testFormDefinitionWithTwoQuestions.pages[0].components
      )
      const page2Res = hideFirstGuidance(page2)
      expect(page2Res.components).toEqual(
        testFormDefinitionWithTwoQuestions.pages[1].components
      )
    })

    test('should hide guidance component if at first position', () => {
      const testFormWithTwoGuidances = {
        ...testFormDefinitionWithTwoPagesAndQuestions
      }
      const [page1, page2, page3] = testFormWithTwoGuidances.pages
      insertGuidanceAtTop(page1.components)
      insertGuidanceAtTop(page2.components)
      expect(page1.components).toHaveLength(3)
      expect(page2.components).toHaveLength(3)

      const page1Res = hideFirstGuidance(page1)
      expect(page1Res.components).toHaveLength(2)
      expect(
        page1Res.components ? page1Res.components[0].type : undefined
      ).toBe(ComponentType.TextField)
      const page2Res = hideFirstGuidance(page2)
      expect(page2Res.components).toHaveLength(2)
      expect(
        page2Res.components ? page2Res.components[0].type : undefined
      ).toBe(ComponentType.TextField)
      const page3Res = hideFirstGuidance(page3)
      expect(page3Res.components).toEqual([])
    })
  })
})

/**
 * @import { ComponentDef } from '@defra/forms-model'
 */
