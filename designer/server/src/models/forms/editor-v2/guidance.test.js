import { ConditionType, OperatorName } from '@defra/forms-model'
import {
  buildDefinition,
  buildMetaData,
  buildQuestionPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import { guidanceViewModel } from '~/src/models/forms/editor-v2/guidance.js'

describe('guidance model', () => {
  const componentId = 'dff90bfe-b171-4a80-8164-85fe88277a46'
  const pageId = 'bc00ecf6-6075-42cc-a27e-3d0c9b712503'
  const conditionId = 'cattle-farm-condition'

  const testGuidanceComponent = buildTextFieldComponent({
    id: componentId,
    name: 'farmType',
    title: 'Explanation of farming'
  })

  const metadata = buildMetaData({
    title: 'Test form',
    slug: 'test-form'
  })

  /** @type {ConditionWrapperV2} */
  const mockConditionV2 = {
    id: conditionId,
    displayName: 'Show if cattle farming',
    items: [
      {
        id: 'cattle-farm-check',
        componentId,
        operator: OperatorName.Is,
        type: ConditionType.StringValue,
        value: 'cattle'
      }
    ]
  }

  describe('guidanceViewModel', () => {
    it('should handle page with zero components', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            title: 'Guidance page',
            path: '/guidance-page',
            id: pageId,
            components: undefined
          })
        ],
        conditions: []
      })

      const result = guidanceViewModel(
        metadata,
        definition,
        pageId,
        'invalid',
        undefined,
        undefined
      )

      expect(result.pageTitle).toBe('Edit guidance page - Test form')
      expect(result.hasPageCondition).toBeFalsy()
      expect(result.previewPageUrl).toContain('/guidance-page')
      expect(result.previewModel.pageTitle.text).toBe('Guidance page')
      // @ts-expect-error - checking for property that should be undefined
      expect(result.errorTemplates).toBeUndefined()
      const components = result.previewModel.components
      expect(components).toEqual([
        {
          model: {
            classes: '',
            content: '<p>Guidance text</p>\n',
            id: 'markdown',
            name: 'markdown'
          },
          questionType: 'Markdown'
        }
      ])
    })

    it('should handle a new page which does not exist', () => {
      const definition = buildDefinition({
        pages: [],
        conditions: []
      })

      const result = guidanceViewModel(
        metadata,
        definition,
        pageId,
        'invalid',
        undefined,
        undefined
      )

      expect(result.pageTitle).toBe('Edit guidance page - Test form')
      expect(result.hasPageCondition).toBeFalsy()
      expect(result.previewPageUrl).toContain('')
    })

    it('should handle page with a condition', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            components: [testGuidanceComponent],
            condition: conditionId
          })
        ],
        conditions: [mockConditionV2]
      })

      const result = guidanceViewModel(
        metadata,
        definition,
        pageId,
        'invalid',
        undefined,
        undefined
      )

      expect(result.pageTitle).toBe('Edit guidance page - Test form')
      expect(result.hasPageCondition).toBeTruthy()
    })
  })
})

/**
 * @import { ConditionWrapperV2 } from '@defra/forms-model'
 */
