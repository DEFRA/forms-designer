import { ConditionType, Engine, OperatorName } from '@defra/forms-model'
import {
  buildDefinition,
  buildFileUploadPage,
  buildMetaData,
  buildQuestionPage,
  buildSummaryPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

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
    const metadata = buildMetaData({
      slug: 'environmental-permit-application',
      title: 'Environmental Permit Application'
    })
    const pageId = 'farm-details-page'
    const conditionId = 'cattle-farm-condition'
    const componentId = 'farm-type-field'

    /** @type {ConditionWrapperV2} */
    const mockCondition = {
      id: conditionId,
      displayName: 'Show if cattle farming',
      conditions: [
        {
          id: 'cattle-farm-check',
          componentId,
          operator: OperatorName.Is,
          value: {
            type: ConditionType.StringValue,
            value: 'cattle'
          }
        }
      ]
    }

    const testComponent = buildTextFieldComponent({
      id: componentId,
      name: 'farmType',
      title: 'What type of farming do you do?'
    })

    it('should not show repeater option if page type is FileUpload controller', () => {
      const definition = buildDefinition({
        pages: [buildFileUploadPage({ id: pageId }), buildSummaryPage()],
        engine: Engine.V2
      })

      const modelResult = questionsViewModel(metadata, definition, pageId)
      expect(modelResult.fields.repeater).toBeUndefined()
    })

    it('should show repeater option if page type is Question controller', () => {
      const definition = buildDefinition({
        pages: [buildQuestionPage({ id: pageId }), buildSummaryPage()],
        engine: Engine.V2
      })
      const modelResult = questionsViewModel(metadata, definition, pageId)
      expect(modelResult.fields.repeater).toBeDefined()
    })

    describe('page condition integration', () => {
      it('should include page condition details when page has a condition', () => {
        const definition = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId,
              title: 'Farm Details',
              condition: conditionId,
              components: [testComponent]
            }),
            buildSummaryPage()
          ],
          conditions: [mockCondition],
          engine: Engine.V2
        })

        const result = questionsViewModel(metadata, definition, pageId)

        expect(result.pageCondition).toBe(conditionId)
        expect(result.pageConditionDetails).toEqual(mockCondition)
        expect(result.pageConditionPresentationString).toBeTruthy()
        expect(typeof result.pageConditionPresentationString).toBe('string')
        expect(result.hasPageCondition).toBe(true)
      })

      it('should have empty condition details when page has no condition', () => {
        const definition = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId,
              title: 'Farm Details',
              components: [testComponent]
            }),
            buildSummaryPage()
          ],
          conditions: [mockCondition],
          engine: Engine.V2
        })

        const result = questionsViewModel(metadata, definition, pageId)

        expect(result.pageCondition).toBeUndefined()
        expect(result.pageConditionDetails).toBeUndefined()
        expect(result.pageConditionPresentationString).toBeNull()
        expect(result.hasPageCondition).toBe(false)
      })

      it('should have empty condition details when page condition does not exist in definition', () => {
        const definition = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId,
              title: 'Farm Details',
              condition: 'missing-permit-condition',
              components: [testComponent]
            }),
            buildSummaryPage()
          ],
          conditions: [mockCondition],
          engine: Engine.V2
        })

        const result = questionsViewModel(metadata, definition, pageId)

        expect(result.pageCondition).toBe('missing-permit-condition')
        expect(result.pageConditionDetails).toBeUndefined()
        expect(result.pageConditionPresentationString).toBeNull()
        expect(result.hasPageCondition).toBe(false)
      })

      it('should set currentTab to overview', () => {
        const definition = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId,
              title: 'Farm Details',
              components: [testComponent]
            }),
            buildSummaryPage()
          ],
          conditions: [],
          engine: Engine.V2
        })

        const result = questionsViewModel(metadata, definition, pageId)

        expect(result.currentTab).toBe('overview')
      })

      it('should handle multiple conditions correctly', () => {
        /** @type {ConditionWrapperV2} */
        const anotherCondition = {
          id: 'organic-farming-condition',
          displayName: 'Show if organic farming',
          conditions: [
            {
              id: 'organic-farm-check',
              componentId,
              operator: OperatorName.Is,
              value: {
                type: ConditionType.StringValue,
                value: 'organic'
              }
            }
          ]
        }

        const definition = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId,
              title: 'Farm Details',
              condition: conditionId,
              components: [testComponent]
            }),
            buildSummaryPage()
          ],
          conditions: [mockCondition, anotherCondition],
          engine: Engine.V2
        })

        const result = questionsViewModel(metadata, definition, pageId)

        expect(result.pageCondition).toBe(conditionId)
        expect(result.pageConditionDetails).toEqual(mockCondition)
        expect(result.hasPageCondition).toBe(true)
      })

      it('should handle empty conditions array', () => {
        const definition = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId,
              title: 'Farm Details',
              components: [testComponent]
            }),
            buildSummaryPage()
          ],
          conditions: [],
          engine: Engine.V2
        })

        const result = questionsViewModel(metadata, definition, pageId)

        expect(result.pageCondition).toBeUndefined()
        expect(result.pageConditionDetails).toBeUndefined()
        expect(result.pageConditionPresentationString).toBeNull()
        expect(result.hasPageCondition).toBe(false)
      })
    })

    describe('basic view model properties', () => {
      it('should include all required properties', () => {
        const definition = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId,
              title: 'Farm Details',
              components: [testComponent]
            }),
            buildSummaryPage()
          ],
          conditions: [],
          engine: Engine.V2
        })

        const result = questionsViewModel(metadata, definition, pageId)

        expect(result).toHaveProperty('cardTitle', 'Page 1 overview')
        expect(result).toHaveProperty('cardCaption', 'Page 1')
        expect(result).toHaveProperty('currentTab', 'overview')
        expect(result).toHaveProperty('baseUrl')
        expect(result).toHaveProperty('navigation')
        expect(result).toHaveProperty('questionRows')
        expect(result).toHaveProperty('previewPageUrl')
        expect(result).toHaveProperty('pageCondition')
        expect(result).toHaveProperty('pageConditionDetails')
        expect(result).toHaveProperty('pageConditionPresentationString')
        expect(result).toHaveProperty('hasPageCondition')
      })
    })
  })
})

/**
 * @import { ConditionWrapperV2 } from '@defra/forms-model'
 */
