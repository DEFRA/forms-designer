import { ComponentType } from '@defra/forms-model'

import {
  testFormDefinitionWithAGuidancePage,
  testFormDefinitionWithExistingGuidance,
  testFormDefinitionWithExistingSummaryDeclaration,
  testFormDefinitionWithNoPages,
  testFormDefinitionWithNoQuestions,
  testFormDefinitionWithRepeater,
  testFormDefinitionWithTwoPagesAndQuestions,
  testFormDefinitionWithTwoQuestions
} from '~/src/__stubs__/form-definition.js'
import {
  determineEditUrl,
  hideFirstGuidance,
  isGuidancePage,
  mapMarkdown,
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
      const res = mapPageData('slug', testFormDefinitionWithNoPages)
      expect(res).toEqual(testFormDefinitionWithNoPages)
    })
    test('should populate page title from first question title', () => {
      const definitionWithNoPageTitles = {
        ...testFormDefinitionWithTwoQuestions
      }
      definitionWithNoPageTitles.pages[0].title = ''
      const res = mapPageData('slug', definitionWithNoPageTitles)
      expect(res.pages[0].title).toBe('This is your first question')
    })
    test('should populate page titles from first question title on multiple pages', () => {
      const definitionWithNoPageTitles = {
        ...testFormDefinitionWithTwoPagesAndQuestions
      }
      definitionWithNoPageTitles.pages[0].title = ''
      definitionWithNoPageTitles.pages[1].title = ''
      const res = mapPageData('slug', definitionWithNoPageTitles)
      expect(res.pages[0].title).toBe('This is your first question')
      expect(res.pages[1].title).toBe('This is your first question - page two')
    })
  })

  describe('mapQuestionRows', () => {
    test('should map question rows', () => {
      const resPageOneQuestions = mapQuestionRows(
        testFormDefinitionWithTwoPagesAndQuestions,
        testFormDefinitionWithTwoPagesAndQuestions.pages[0]
      )
      const resPageTwoQuestions = mapQuestionRows(
        testFormDefinitionWithTwoPagesAndQuestions,
        testFormDefinitionWithTwoPagesAndQuestions.pages[1]
      )
      const resPageSummaryQuestions = mapQuestionRows(
        testFormDefinitionWithTwoPagesAndQuestions,
        testFormDefinitionWithTwoPagesAndQuestions.pages[2]
      )
      const resPageSummaryExistingMarkdown = mapQuestionRows(
        testFormDefinitionWithExistingSummaryDeclaration,
        testFormDefinitionWithExistingSummaryDeclaration.pages[1]
      )
      const resPageSummaryRepeater = mapQuestionRows(
        testFormDefinitionWithRepeater,
        testFormDefinitionWithRepeater.pages[0]
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
          text: 'Declaration'
        },
        value: {
          html: '<pre class="break-on-newlines"><p class="govuk-body">Declaration text</p></pre>',
          classes: 'with-ellipsis'
        }
      })

      expect(resPageSummaryRepeater).toHaveLength(1)

      expect(resPageSummaryRepeater[0]).toEqual({
        key: {
          text: 'People can answer'
        },
        value: {
          text: 'More than once'
        }
      })
    })
  })

  describe('hideFirstGuidance', () => {
    test('should return unchanged page if no guidance components at first position', () => {
      const [page1, page2] = testFormDefinitionWithTwoQuestions.pages
      const page1Res = /** @type {PageQuestion} */ (hideFirstGuidance(page1))
      expect(page1Res.components).toEqual(
        testFormDefinitionWithTwoQuestions.pages[0].components
      )
      const page2Res = /** @type {PageQuestion} */ (hideFirstGuidance(page2))
      expect(page2Res.components).toEqual(
        testFormDefinitionWithTwoQuestions.pages[1].components
      )
    })

    test('should hide guidance component if at first position', () => {
      const testFormWithTwoGuidances = {
        ...testFormDefinitionWithTwoPagesAndQuestions
      }
      const [page1, page2, page3] = testFormWithTwoGuidances.pages
      const blankPage = testFormDefinitionWithNoQuestions.pages[0]
      insertGuidanceAtTop(page1.components)
      insertGuidanceAtTop(page2.components)
      expect(page1.components).toHaveLength(3)
      expect(page2.components).toHaveLength(3)

      const page1Res = /** @type {PageQuestion} */ (hideFirstGuidance(page1))
      expect(page1Res.components).toHaveLength(2)
      expect(page1Res.components[0].type).toBe(ComponentType.TextField)
      const page2Res = /** @type {PageQuestion} */ (hideFirstGuidance(page2))
      expect(page2Res.components).toHaveLength(2)
      expect(page2Res.components[0].type).toBe(ComponentType.TextField)
      const page3Res = /** @type {PageQuestion} */ (hideFirstGuidance(page3))
      expect(page3Res.components).toEqual([])
      const page4Res = /** @type {PageQuestion} */ (
        hideFirstGuidance(blankPage)
      )
      expect(page4Res.components).toEqual([])
    })

    test('should not hide guidance component if the only thing on a page', () => {
      const testFormWithGuidancePage = {
        ...testFormDefinitionWithAGuidancePage
      }
      const [page1] = testFormWithGuidancePage.pages
      const page1Res = /** @type {PageQuestion} */ (hideFirstGuidance(page1))
      expect(page1Res).toEqual(page1)
    })
  })

  describe('determineEditUrl', () => {
    test('should return end page edit url', () => {
      const [page1] = testFormDefinitionWithTwoQuestions.pages
      const url = determineEditUrl(page1, true, '/edit-base/')
      expect(url).toBe('/edit-base/p1/check-answers-settings')
    })
    test('should return guidance url', () => {
      const [page1] = testFormDefinitionWithAGuidancePage.pages
      const url = determineEditUrl(page1, false, '/edit-base/')
      expect(url).toBe('/edit-base/p1/guidance/c1')
    })
    test('should return questions url', () => {
      const [page1] = testFormDefinitionWithTwoQuestions.pages
      const url = determineEditUrl(page1, false, '/edit-base/')
      expect(url).toBe('/edit-base/p1/questions')
    })
  })

  describe('mapMarkdown', () => {
    test('should give title of Declaration', () => {
      expect(
        mapMarkdown(
          /** @type {MarkdownComponent} */ ({ content: 'Some markdown' }),
          true
        )
      ).toEqual({
        key: {
          text: 'Declaration'
        },
        value: {
          html: '<pre class="break-on-newlines"><p class="govuk-body">Some markdown</p></pre>',
          classes: 'with-ellipsis'
        }
      })
    })
    test('should give title of Markdown', () => {
      expect(
        mapMarkdown(
          /** @type {MarkdownComponent} */ ({ content: 'Some markdown' }),
          false
        )
      ).toEqual({
        key: {
          text: 'Guidance'
        },
        value: {
          html: '<pre class="break-on-newlines"><p class="govuk-body">Some markdown</p></pre>',
          classes: 'with-ellipsis'
        }
      })
    })
  })

  describe('isGuidancePage', () => {
    test('should return false if page has no components', () => {
      const [page1] = testFormDefinitionWithNoQuestions.pages
      expect(isGuidancePage(page1)).toBeFalsy()
    })
    test('should return false if page has components but not guidance', () => {
      const [page1] = testFormDefinitionWithTwoQuestions.pages
      expect(isGuidancePage(page1)).toBeFalsy()
    })
    test('should return true if page is guidance page', () => {
      const [page1] = testFormDefinitionWithExistingGuidance.pages
      expect(isGuidancePage(page1)).toBeTruthy()
    })
  })
})

/**
 * @import { ComponentDef, MarkdownComponent, Page, PageQuestion } from '@defra/forms-model'
 */
