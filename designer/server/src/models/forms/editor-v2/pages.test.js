import { ComponentType } from '@defra/forms-model'
import { v4 as uuidv4 } from 'uuid'

import {
  testFormDefinitionWithNoPages,
  testFormDefinitionWithTwoPagesAndQuestions,
  testFormDefinitionWithTwoQuestions
} from '~/src/__stubs__/form-definition.js'
import {
  hideFirstGuidance,
  setPageHeadings
} from '~/src/models/forms/editor-v2/pages.js'

/**
 * @param {ComponentDef[] | undefined} components
 */
function insertGuidanceAtTop(components) {
  if (!components) {
    return
  }

  components.unshift({
    id: uuidv4(),
    name: 'html',
    title: 'html',
    type: ComponentType.Html,
    content: '# line1\r\n## line2\r\n### line3',
    options: {}
  })
}

describe('editor-v2 - pages model', () => {
  describe('setPageHeadings', () => {
    test('should return unchanged definition if no pages', () => {
      const res = setPageHeadings(testFormDefinitionWithNoPages)
      expect(res).toEqual(testFormDefinitionWithNoPages)
    })
    test('should return unchanged if page titles already set', () => {
      const res = setPageHeadings(testFormDefinitionWithTwoQuestions)
      const expected = { ...testFormDefinitionWithTwoQuestions }
      expected.pages[1].components = []
      expect(res).toEqual(expected)
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
      expect(page1Res.components[0].type).toBe(ComponentType.TextField)
      const page2Res = hideFirstGuidance(page2)
      expect(page2Res.components).toHaveLength(2)
      expect(page2Res.components[0].type).toBe(ComponentType.TextField)
      const page3Res = hideFirstGuidance(page3)
      expect(page3Res.components).toEqual([])
    })
  })
})

/**
 * @import { ComponentDef } from '@defra/forms-model'
 */
