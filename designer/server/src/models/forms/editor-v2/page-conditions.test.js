import { ConditionType, Engine, OperatorName } from '@defra/forms-model'
import {
  buildDefinition,
  buildMarkdownComponent,
  buildMetaData,
  buildQuestionPage,
  buildSummaryPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import { getPageConditionDetails } from '~/src/models/forms/editor-v2/common.js'
import {
  getConditionsData,
  pageConditionsViewModel
} from '~/src/models/forms/editor-v2/page-conditions.js'

describe('page-conditions model', () => {
  const metadata = buildMetaData({
    slug: 'environmental-permit-application',
    title: 'Environmental Permit Application'
  })

  const pageId = 'farm-details-page'
  const conditionId = 'cattle-farm-condition'
  const componentId = 'farm-type-field'

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

  /** @type {ConditionWrapper} */
  const mockConditionV1 = {
    displayName: 'Legacy livestock check',
    name: 'legacy-livestock-condition',
    value: {
      name: 'old-livestock-format',
      conditions: []
    }
  }

  const testComponent = buildTextFieldComponent({
    id: componentId,
    name: 'farmType',
    title: 'What type of farming do you do?'
  })

  const testGuidanceComponent = buildMarkdownComponent({
    id: componentId,
    name: 'farmType',
    title: 'Explanation of farming'
  })

  describe('getPageConditionDetails', () => {
    it('should return empty details when page has no condition', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2]
      })

      const result = getPageConditionDetails(definition, pageId)

      expect(result).toEqual({
        pageCondition: undefined,
        pageConditionDetails: undefined,
        pageConditionPresentationString: null
      })
    })

    it('should return empty details when page condition does not exist in definition', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            condition: 'missing-permit-condition',
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2]
      })

      const result = getPageConditionDetails(definition, pageId)

      expect(result).toEqual({
        pageCondition: 'missing-permit-condition',
        pageConditionDetails: undefined,
        pageConditionPresentationString: null
      })
    })

    it('should return condition details and presentation string when valid condition exists', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            condition: conditionId,
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2],
        lists: []
      })

      const result = getPageConditionDetails(definition, pageId)

      expect(result.pageCondition).toBe(conditionId)
      expect(result.pageConditionDetails).toEqual(mockConditionV2)
      expect(result.pageConditionPresentationString).toBeTruthy()
      expect(typeof result.pageConditionPresentationString).toBe('string')
    })

    it('should filter out V1 conditions and only process V2 conditions', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            condition: conditionId,
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV1, mockConditionV2],
        lists: []
      })

      const result = getPageConditionDetails(definition, pageId)

      expect(result.pageCondition).toBe(conditionId)
      expect(result.pageConditionDetails).toEqual(mockConditionV2)
      expect(result.pageConditionPresentationString).toBeTruthy()
    })

    it('should return undefined when page does not exist', () => {
      const definition = buildDefinition({
        pages: [],
        conditions: [mockConditionV2]
      })

      const result = getPageConditionDetails(definition, 'non-existent-page')

      expect(result).toEqual({
        pageCondition: undefined,
        pageConditionDetails: undefined,
        pageConditionPresentationString: null
      })
    })
  })

  describe('getConditionsData', () => {
    it('should return empty array when no conditions exist', () => {
      const definition = buildDefinition({
        conditions: []
      })

      const result = getConditionsData(definition)

      expect(result).toEqual([])
    })

    it('should filter out V1 conditions and return only V2 conditions', () => {
      const definition = buildDefinition({
        conditions: [mockConditionV1, mockConditionV2]
      })

      const result = getConditionsData(definition)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(mockConditionV2)
    })

    it('should sort conditions by displayName alphabetically', () => {
      /** @type {ConditionWrapperV2} */
      const agroForestryCondition = {
        id: 'agroforestry-condition',
        displayName: 'Agroforestry scheme applies',
        items: [
          {
            id: 'agroforestry-check',
            componentId,
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'agroforestry'
          }
        ]
      }
      /** @type {ConditionWrapperV2} */
      const wildlifeHabitatCondition = {
        id: 'wildlife-habitat-condition',
        displayName: 'Wildlife habitat management required',
        items: [
          {
            id: 'wildlife-habitat-check',
            componentId,
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'wildlife-habitat'
          }
        ]
      }
      /** @type {ConditionWrapperV2} */
      const organicFarmingCondition = {
        id: 'organic-farming-condition',
        displayName: 'Organic farming certification needed',
        items: [
          {
            id: 'organic-farming-check',
            componentId,
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'organic'
          }
        ]
      }

      const definition = buildDefinition({
        conditions: [
          wildlifeHabitatCondition,
          agroForestryCondition,
          organicFarmingCondition
        ]
      })

      const result = getConditionsData(definition)

      expect(result).toHaveLength(3)
      expect(result[0].displayName).toBe('Agroforestry scheme applies')
      expect(result[1].displayName).toBe('Organic farming certification needed')
      expect(result[2].displayName).toBe('Wildlife habitat management required')
    })

    it('should handle mixed V1 and V2 conditions correctly', () => {
      /** @type {ConditionWrapper} */
      const legacySubsidyCondition = {
        displayName: 'Legacy subsidy eligibility check',
        name: 'legacy-subsidy-v1',
        value: {
          name: 'old-subsidy-format',
          conditions: []
        }
      }

      /** @type {ConditionWrapperV2} */
      const sustainableFarmingCondition = {
        id: 'sustainable-farming-scheme',
        displayName: 'Sustainable Farming Incentive applies',
        items: [
          {
            id: 'sfi-eligibility-check',
            componentId,
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'sustainable-practices'
          }
        ]
      }

      const mixedConditions = [
        mockConditionV1,
        legacySubsidyCondition,
        mockConditionV2,
        sustainableFarmingCondition
      ]

      const definition = buildDefinition({
        conditions: mixedConditions
      })

      const result = getConditionsData(definition)

      expect(result).toHaveLength(2)
      expect(result.every((condition) => Array.isArray(condition.items))).toBe(
        true
      )
      expect(result[0].displayName).toBe('Show if cattle farming')
      expect(result[1].displayName).toBe(
        'Sustainable Farming Incentive applies'
      )
    })
  })

  describe('pageConditionsViewModel', () => {
    const baseDefinition = buildDefinition({
      pages: [
        buildQuestionPage({
          id: pageId,
          title: 'Farm Details',
          components: [testComponent]
        }),
        buildSummaryPage()
      ],
      conditions: [mockConditionV2],
      engine: Engine.V2
    })

    const baseDefinitionWithGuidance = buildDefinition({
      pages: [
        buildQuestionPage({
          id: pageId,
          title: 'Farm Details',
          components: [testGuidanceComponent]
        }),
        buildSummaryPage()
      ],
      conditions: [mockConditionV2],
      engine: Engine.V2
    })

    const mockState = {}

    const mockOptions = {}

    it('should return complete view model with all required fields for a question', () => {
      const result = pageConditionsViewModel(
        metadata,
        baseDefinition,
        pageId,
        mockState,
        mockOptions
      )

      expect(result).toHaveProperty(
        'formSlug',
        'environmental-permit-application'
      )
      expect(result).toHaveProperty('pageId', pageId)
      expect(result).toHaveProperty('cardTitle', 'Page 1')
      expect(result).toHaveProperty('cardCaption', 'Page 1: Farm Details')
      expect(result).toHaveProperty(
        'pageSpecificHeading',
        'Page 1: Farm Details'
      )
      expect(result).toHaveProperty('currentTab', 'conditions')
      expect(result).toHaveProperty('baseUrl')
      expect(result).toHaveProperty('backLink')
      expect(result.backLink.href).toBe(
        '/library/environmental-permit-application/editor-v2/page/farm-details-page/questions'
      )
      expect(result.backLink.text).toBe('Back to questions')
      expect(result).toHaveProperty('navigation')
      expect(result).toHaveProperty('allConditions')
      expect(result).toHaveProperty('conditionsManagerPath')
      expect(result).toHaveProperty('pageConditionsApiUrl')
    })

    it('should return complete view model with all required fields for a guidance page', () => {
      const result = pageConditionsViewModel(
        metadata,
        baseDefinitionWithGuidance,
        pageId,
        mockState,
        mockOptions
      )

      expect(result).toHaveProperty(
        'formSlug',
        'environmental-permit-application'
      )
      expect(result).toHaveProperty('pageId', pageId)
      expect(result).toHaveProperty('cardTitle', 'Page 1')
      expect(result).toHaveProperty('cardCaption', 'Page 1: Farm Details')
      expect(result).toHaveProperty(
        'pageSpecificHeading',
        'Page 1: Farm Details'
      )
      expect(result).toHaveProperty('currentTab', 'conditions')
      expect(result).toHaveProperty('baseUrl')
      expect(result).toHaveProperty('backLink')
      expect(result.backLink.href).toBe(
        '/library/environmental-permit-application/editor-v2/page/farm-details-page/guidance/farm-type-field'
      )
      expect(result.backLink.text).toBe('Back to guidance')
      expect(result).toHaveProperty('navigation')
      expect(result).toHaveProperty('allConditions')
      expect(result).toHaveProperty('conditionsManagerPath')
      expect(result).toHaveProperty('pageConditionsApiUrl')
    })

    it('should include page condition details when page has a condition', () => {
      const definitionWithCondition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            title: 'Farm Details',
            condition: conditionId,
            components: [testComponent]
          }),
          buildSummaryPage()
        ],
        conditions: [mockConditionV2],
        engine: Engine.V2
      })

      const result = pageConditionsViewModel(
        metadata,
        definitionWithCondition,
        pageId,
        mockState,
        mockOptions
      )

      expect(result.pageCondition).toBe(conditionId)
      expect(result.pageConditionDetails).toEqual(mockConditionV2)
      expect(result.pageConditionPresentationString).toBeTruthy()
    })

    it('should include all available conditions sorted by displayName', () => {
      /** @type {ConditionWrapperV2[]} */
      const multipleConditions = [
        {
          id: 'water-management-condition',
          displayName: 'Water management plan required',
          items: [
            {
              id: 'water-mgmt-check',
              componentId,
              operator: OperatorName.Is,
              type: ConditionType.StringValue,
              value: 'water-intensive'
            }
          ]
        },
        {
          id: 'biodiversity-condition',
          displayName: 'Biodiversity net gain applies',
          items: [
            {
              id: 'biodiversity-check',
              componentId,
              operator: OperatorName.Is,
              type: ConditionType.StringValue,
              value: 'development'
            }
          ]
        },
        {
          id: 'pesticide-condition',
          displayName: 'Pesticide usage restrictions',
          items: [
            {
              id: 'pesticide-check',
              componentId,
              operator: OperatorName.Is,
              type: ConditionType.StringValue,
              value: 'crop-farming'
            }
          ]
        }
      ]

      const definitionWithMultipleConditions = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            title: 'Farm Details',
            components: [testComponent]
          }),
          buildSummaryPage()
        ],
        conditions: multipleConditions,
        engine: Engine.V2
      })

      const result = pageConditionsViewModel(
        metadata,
        definitionWithMultipleConditions,
        pageId,
        mockState,
        mockOptions
      )

      expect(result.allConditions).toHaveLength(3)
      expect(result.allConditions[0].displayName).toBe(
        'Biodiversity net gain applies'
      )
      expect(result.allConditions[1].displayName).toBe(
        'Pesticide usage restrictions'
      )
      expect(result.allConditions[2].displayName).toBe(
        'Water management plan required'
      )
    })

    it('should handle validation errors correctly', () => {
      const validation = {
        formErrors: {
          conditionName: {
            text: 'Select a condition',
            href: '#conditionName'
          }
        },
        formValues: {
          conditionName: 'invalid-farming-condition'
        }
      }

      const result = pageConditionsViewModel(
        metadata,
        baseDefinition,
        pageId,
        mockState,
        mockOptions,
        validation
      )

      expect(result.errorList).toHaveLength(1)
      expect(result.errorList[0]).toEqual({
        text: 'Select a condition',
        href: '#conditionName'
      })
      expect(result.formErrors).toEqual(validation.formErrors)
      expect(result.formValues).toEqual(validation.formValues)
    })

    it('should handle notifications correctly', () => {
      const notification = ['Farming condition applied successfully']

      const result = pageConditionsViewModel(
        metadata,
        baseDefinition,
        pageId,
        mockState,
        mockOptions,
        undefined,
        notification
      )

      expect(result.notification).toEqual(notification)
    })

    it('should construct correct URLs and paths', () => {
      const result = pageConditionsViewModel(
        metadata,
        baseDefinition,
        pageId,
        mockState,
        mockOptions
      )

      expect(result.baseUrl).toBe(
        '/library/environmental-permit-application/editor-v2/page/farm-details-page'
      )
      expect(result.backLink.href).toBe(
        '/library/environmental-permit-application/editor-v2/page/farm-details-page/questions'
      )
      expect(result.backLink.text).toBe('Back to questions')
      expect(result.conditionsManagerPath).toBe(
        '/library/environmental-permit-application/editor-v2/conditions'
      )
      expect(result.pageConditionsApiUrl).toBe(
        '/library/environmental-permit-application/editor-v2/page/farm-details-page/conditions/assign'
      )
    })

    it('should handle page numbers correctly for different page positions', () => {
      const multiPageDefinition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'land-details', title: 'Land Details' }),
          buildQuestionPage({ id: pageId, title: 'Farm Operations' }),
          buildQuestionPage({
            id: 'environmental-impact',
            title: 'Environmental Impact'
          }),
          buildSummaryPage()
        ],
        conditions: [mockConditionV2],
        engine: Engine.V2
      })

      const result = pageConditionsViewModel(
        metadata,
        multiPageDefinition,
        pageId,
        mockState,
        mockOptions
      )

      expect(result.cardTitle).toBe('Page 2')
      expect(result.cardCaption).toBe('Page 2: Farm Operations')
    })

    it('should handle empty conditions array', () => {
      const definitionWithoutConditions = buildDefinition({
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

      const result = pageConditionsViewModel(
        metadata,
        definitionWithoutConditions,
        pageId,
        mockState,
        mockOptions
      )

      expect(result.allConditions).toEqual([])
      expect(result.pageCondition).toBeUndefined()
      expect(result.pageConditionDetails).toBeUndefined()
      expect(result.pageConditionPresentationString).toBeNull()
    })

    it('should generate correct pageSpecificHeading when page has a title', () => {
      const result = pageConditionsViewModel(
        metadata,
        baseDefinition,
        pageId,
        mockState,
        mockOptions
      )

      expect(result).toHaveProperty(
        'pageSpecificHeading',
        'Page 1: Farm Details'
      )
    })

    it('should generate correct pageSpecificHeading when page has no title', () => {
      const definitionWithUntitledPage = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            title: undefined,
            components: [testComponent]
          }),
          buildSummaryPage()
        ],
        conditions: [mockConditionV2],
        engine: Engine.V2
      })

      const result = pageConditionsViewModel(
        metadata,
        definitionWithUntitledPage,
        pageId,
        mockState,
        mockOptions
      )

      expect(result).toHaveProperty('pageSpecificHeading', 'Page 1')
    })

    it('should generate correct pageSpecificHeading for different page numbers', () => {
      const multiPageDefinition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'land-details', title: 'Land Details' }),
          buildQuestionPage({ id: pageId, title: 'Farm Operations' }),
          buildQuestionPage({
            id: 'environmental-impact',
            title: 'Environmental Impact Assessment'
          }),
          buildSummaryPage()
        ],
        conditions: [mockConditionV2],
        engine: Engine.V2
      })

      const result = pageConditionsViewModel(
        metadata,
        multiPageDefinition,
        pageId,
        mockState,
        mockOptions
      )

      expect(result).toHaveProperty(
        'pageSpecificHeading',
        'Page 2: Farm Operations'
      )
    })
  })
})

/**
 * @import { ConditionWrapperV2, ConditionWrapper } from '@defra/forms-model'
 */
