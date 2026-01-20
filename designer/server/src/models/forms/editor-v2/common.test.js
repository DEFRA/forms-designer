import { ConditionType, Coordinator, OperatorName } from '@defra/forms-model'
import {
  buildDefinition,
  buildMarkdownComponent,
  buildQuestionPage,
  buildSummaryPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import {
  testFormDefinitionWithNoQuestions,
  testFormDefinitionWithSinglePage,
  testFormDefinitionWithTwoQuestions,
  testFormDefinitionWithoutSummary
} from '~/src/__stubs__/form-definition.js'
import {
  getCyaPageId,
  getPageNum,
  getQuestionNum,
  getQuestionsOnPage,
  getSectionForPage,
  tickBoxes
} from '~/src/models/forms/editor-v2/common.js'
import {
  toPresentationHtmlV2,
  toPresentationStringV2
} from '~/src/models/forms/editor-v2/condition-helpers.js'
import {
  DEFAULT_TRUNCATE_LENGTH,
  buildSectionsForPreview,
  enrichPreviewModel,
  getDeclarationInfo,
  getUnassignedPageTitlesForPreview,
  truncateText
} from '~/src/models/forms/editor-v2/preview-helpers.js'
import {
  CHECK_ANSWERS_TAB_CONFIRMATION_EMAILS,
  CHECK_ANSWERS_TAB_DECLARATION,
  CHECK_ANSWERS_TAB_PAGE_OVERVIEW,
  CHECK_ANSWERS_TAB_REFERENCE_NUMBER,
  CHECK_ANSWERS_TAB_SECTIONS,
  PAGE_OVERVIEW_TITLE,
  TAB_TITLE_CONFIRMATION_EMAIL,
  TAB_TITLE_DECLARATION,
  TAB_TITLE_REFERENCE_NUMBER,
  TAB_TITLE_SECTIONS,
  getCheckAnswersTabConfig
} from '~/src/models/forms/editor-v2/tab-config.js'

describe('editor-v2 - model', () => {
  describe('getPageNum', () => {
    test('should return page number if no real page id', () => {
      const pageNum = getPageNum(testFormDefinitionWithSinglePage, 'new')
      expect(pageNum).toBe(2)
    })
    test('should return page number if no real page id - when no summary page', () => {
      const pageNum = getPageNum(testFormDefinitionWithoutSummary, 'new')
      expect(pageNum).toBe(2)
    })
    test('should return page number if proper page id', () => {
      const pageNum = getPageNum(testFormDefinitionWithSinglePage, 'p1')
      expect(pageNum).toBe(1)
    })
    test('should return page number if proper page id - when no summary page', () => {
      const pageNum = getPageNum(testFormDefinitionWithoutSummary, 'p1')
      expect(pageNum).toBe(1)
    })
  })

  describe('getQuestionsOnPage', () => {
    test('should return two questions', () => {
      const questions = getQuestionsOnPage(
        testFormDefinitionWithTwoQuestions,
        'p1'
      )
      expect(questions).toHaveLength(2)
    })
    test('should return no questions when not a question page', () => {
      const questions = getQuestionsOnPage(
        testFormDefinitionWithTwoQuestions,
        'p2'
      )
      expect(questions).toHaveLength(0)
    })

    test('should return one question', () => {
      const questions = getQuestionsOnPage(
        testFormDefinitionWithSinglePage,
        'p1'
      )
      expect(questions).toHaveLength(1)
    })
  })

  describe('getQuestionNum', () => {
    test('should return 1 if no questions', () => {
      const questionNum = getQuestionNum(
        testFormDefinitionWithNoQuestions,
        'p1',
        'new'
      )
      expect(questionNum).toBe(1)
    })
    test('should return 3 when 2 questions on page', () => {
      const questionNum = getQuestionNum(
        testFormDefinitionWithTwoQuestions,
        'p1',
        'new'
      )
      expect(questionNum).toBe(3)
    })

    test('should return specific question number for q1', () => {
      const questionNum = getQuestionNum(
        testFormDefinitionWithTwoQuestions,
        'p1',
        'q1'
      )
      expect(questionNum).toBe(1)
    })

    test('should return specific question number for q2', () => {
      const questionNum = getQuestionNum(
        testFormDefinitionWithTwoQuestions,
        'p1',
        'q2'
      )
      expect(questionNum).toBe(2)
    })

    test('should return snext question number if not found', () => {
      const questionNum = getQuestionNum(
        testFormDefinitionWithTwoQuestions,
        'p1',
        'qxxx'
      )
      expect(questionNum).toBe(3)
    })
  })

  describe('tickBoxes', () => {
    test('should return unchanged if no selections', () => {
      const res = tickBoxes([{ text: 'option1', value: 'value1' }], [])
      expect(res).toEqual([{ text: 'option1', value: 'value1' }])
    })

    test('should select first item if first selection', () => {
      const res = tickBoxes(
        [
          { text: 'option1', value: 'value1' },
          { text: 'option2', value: 'value2' }
        ],
        ['value1']
      )
      expect(res).toEqual([
        { text: 'option1', value: 'value1', checked: true },
        { text: 'option2', value: 'value2', checked: false }
      ])
    })

    test('should select second item if second selection', () => {
      const res = tickBoxes(
        [
          { text: 'option1', value: 'value1' },
          { text: 'option2', value: 'value2' }
        ],
        ['value2']
      )
      expect(res).toEqual([
        { text: 'option1', value: 'value1', checked: false },
        { text: 'option2', value: 'value2', checked: true }
      ])
    })

    test('should ignore if value is undefined', () => {
      const res = tickBoxes(
        [
          { text: 'option1', value: undefined },
          { text: 'option2', value: 'value2' }
        ],
        ['value1']
      )
      expect(res).toEqual([
        { text: 'option1', value: undefined, checked: false },
        { text: 'option2', value: 'value2', checked: false }
      ])
    })

    test('should handle undefined items', () => {
      const res = tickBoxes(undefined, ['value1'])
      expect(res).toEqual([])
    })
  })

  describe('getCyaPageId', () => {
    it('should return the summary page id when one exists', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'p1' }),
          buildSummaryPage({ id: 'cya-page-id' })
        ]
      })

      const result = getCyaPageId(definition)
      expect(result).toBe('cya-page-id')
    })

    it('should return undefined when no summary page exists', () => {
      const definition = buildDefinition({
        pages: [buildQuestionPage({ id: 'p1' })]
      })

      const result = getCyaPageId(definition)
      expect(result).toBeUndefined()
    })

    it('should return undefined when pages array is empty', () => {
      const definition = buildDefinition({
        pages: []
      })

      const result = getCyaPageId(definition)
      expect(result).toBeUndefined()
    })
  })

  describe('getSectionForPage', () => {
    const testSlug = 'test-form'

    it('should return section info when page has a section', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'p1', section: 'section-1-id' }),
          buildSummaryPage({ id: 'cya-page' })
        ],
        sections: [
          { id: 'section-1-id', name: 'section-1', title: 'First Section' }
        ]
      })
      const page = definition.pages[0]

      const result = getSectionForPage(definition, page, testSlug)

      expect(result).toEqual({
        id: 'section-1-id',
        title: 'First Section',
        hideTitle: false,
        changeUrl: `/library/${testSlug}/editor-v2/page/cya-page/check-answers-settings/sections`
      })
    })

    it('should return section info with hideTitle true when section has hideTitle', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'p1', section: 'section-1-id' }),
          buildSummaryPage({ id: 'cya-page' })
        ],
        sections: [
          {
            id: 'section-1-id',
            name: 'section-1',
            title: 'Hidden Title Section',
            hideTitle: true
          }
        ]
      })
      const page = definition.pages[0]

      const result = getSectionForPage(definition, page, testSlug)

      expect(result).toEqual({
        id: 'section-1-id',
        title: 'Hidden Title Section',
        hideTitle: true,
        changeUrl: `/library/${testSlug}/editor-v2/page/cya-page/check-answers-settings/sections`
      })
    })

    it('should return undefined when page has no section', () => {
      const definition = buildDefinition({
        pages: [buildQuestionPage({ id: 'p1' })],
        sections: [
          { id: 'section-1-id', name: 'section-1', title: 'First Section' }
        ]
      })
      const page = definition.pages[0]

      const result = getSectionForPage(definition, page, testSlug)

      expect(result).toBeUndefined()
    })

    it('should return undefined when section is not found in definition', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'p1', section: 'non-existent-section' })
        ],
        sections: [
          { id: 'section-1-id', name: 'section-1', title: 'First Section' }
        ]
      })
      const page = definition.pages[0]

      const result = getSectionForPage(definition, page, testSlug)

      expect(result).toBeUndefined()
    })

    it('should return empty changeUrl when no summary page exists', () => {
      const definition = buildDefinition({
        pages: [buildQuestionPage({ id: 'p1', section: 'section-1-id' })],
        sections: [
          { id: 'section-1-id', name: 'section-1', title: 'First Section' }
        ]
      })
      const page = definition.pages[0]

      const result = getSectionForPage(definition, page, testSlug)

      expect(result).toEqual({
        id: 'section-1-id',
        title: 'First Section',
        hideTitle: false,
        changeUrl: ''
      })
    })

    it('should handle section with undefined id', () => {
      const definition = buildDefinition({
        pages: [buildQuestionPage({ id: 'p1', section: 'section-1-id' })],
        sections: [
          { id: 'section-1-id', name: 'section-1', title: 'Section No ID' }
        ]
      })
      // Manually unset the id to test the fallback
      definition.sections[0].id = undefined
      const page = definition.pages[0]

      const result = getSectionForPage(definition, page, testSlug)

      expect(result).toBeUndefined()
    })
  })

  describe('toPresentationStringV2', () => {
    const componentId = 'farm-type-field'
    const testComponent = buildTextFieldComponent({
      id: componentId,
      name: 'farmType',
      title: 'What type of farming do you do?'
    })

    /** @type {ConditionWrapperV2} */
    const mockConditionV2 = {
      id: 'cattle-farm-condition',
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

    it('should return presentation string for valid V2 condition', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'farm-details-page',
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2],
        lists: []
      })

      const result = toPresentationStringV2(mockConditionV2, definition)

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle conditions with multiple items and coordinator', () => {
      /** @type {ConditionWrapperV2} */
      const multipleItemsCondition = {
        id: 'organic-and-subsidies-condition',
        displayName: 'Organic farming with subsidies',
        coordinator: Coordinator.AND,
        items: [
          {
            id: 'organic-farming-check',
            componentId,
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'organic'
          },
          {
            id: 'subsidy-eligibility-check',
            componentId,
            operator: OperatorName.IsNot,
            type: ConditionType.StringValue,
            value: 'conventional'
          }
        ]
      }

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'farm-details-page',
            components: [testComponent]
          })
        ],
        conditions: [multipleItemsCondition],
        lists: []
      })

      const result = toPresentationStringV2(multipleItemsCondition, definition)

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle conditions with lists', () => {
      const farmingTypesList = {
        id: 'farming-types-list',
        name: 'Farming Types',
        title: 'Types of farming operations',
        type: /** @type {const} */ ('string'),
        items: [
          { text: 'Cattle farming', value: 'cattle', id: 'cat1' },
          { text: 'Crop farming', value: 'crops', id: 'crop2' }
        ]
      }

      /** @type {ConditionWrapperV2} */
      const conditionWithList = {
        id: 'farming-type-condition',
        displayName: 'Show for specific farming types',
        items: [
          {
            id: 'farming-type-check',
            componentId,
            operator: OperatorName.Is,
            type: ConditionType.ListItemRef,
            value: {
              itemId: 'cat1',
              listId: 'farming-types-list'
            }
          }
        ]
      }

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'farm-details-page',
            components: [testComponent]
          })
        ],
        conditions: [conditionWithList],
        lists: [farmingTypesList]
      })

      const result = toPresentationStringV2(conditionWithList, definition)
      const resultHtml = toPresentationHtmlV2(conditionWithList, definition)

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
      expect(typeof resultHtml).toBe('string')
      expect(resultHtml.length).toBeGreaterThan(0)
      expect(resultHtml).toBe(
        "'What type of farming do you do?' is 'Cattle farming'"
      )
    })
  })

  describe('toPresentationHtmlV2', () => {
    const componentId = 'farm-type-field'
    const testComponent = buildTextFieldComponent({
      id: componentId,
      name: 'farmType',
      title: 'What type of farming do you do?'
    })

    /** @type {ConditionWrapperV2} */
    const mockConditionV2 = {
      id: 'cattle-farm-condition',
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

    it('should return presentation HTML for valid V2 condition', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'farm-details-page',
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2],
        lists: []
      })

      const result = toPresentationHtmlV2(mockConditionV2, definition)

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return valid output for both string and HTML versions', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'farm-details-page',
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2],
        lists: []
      })

      const stringResult = toPresentationStringV2(mockConditionV2, definition)
      const htmlResult = toPresentationHtmlV2(mockConditionV2, definition)

      // Both should return valid strings
      expect(typeof stringResult).toBe('string')
      expect(typeof htmlResult).toBe('string')
      expect(stringResult.length).toBeGreaterThan(0)
      expect(htmlResult.length).toBeGreaterThan(0)
    })
  })

  describe('truncateText', () => {
    it('should return text unchanged if shorter than max length', () => {
      const text = 'Short text'
      const result = truncateText(text)
      expect(result).toBe(text)
    })

    it('should return text unchanged if equal to max length', () => {
      const text = 'A'.repeat(DEFAULT_TRUNCATE_LENGTH)
      const result = truncateText(text)
      expect(result).toBe(text)
    })

    it('should truncate text longer than default max length', () => {
      const text = 'A'.repeat(DEFAULT_TRUNCATE_LENGTH + 10)
      const result = truncateText(text)
      expect(result).toBe('A'.repeat(DEFAULT_TRUNCATE_LENGTH) + '...')
      expect(result).toHaveLength(DEFAULT_TRUNCATE_LENGTH + 3)
    })

    it('should truncate text to custom max length', () => {
      const text = 'This is a longer text'
      const result = truncateText(text, 10)
      expect(result).toBe('This is a ...')
    })

    it('should handle empty string', () => {
      const result = truncateText('')
      expect(result).toBe('')
    })
  })

  describe('buildSectionsForPreview', () => {
    it('should return empty array when no sections', () => {
      const definition = buildDefinition({
        pages: [buildQuestionPage({ id: 'p1' })],
        sections: []
      })

      const result = buildSectionsForPreview(definition)
      expect(result).toEqual([])
    })

    it('should build sections with pages', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Page One',
            section: 'section-1-id'
          }),
          buildQuestionPage({
            id: 'p2',
            title: 'Page Two',
            section: 'section-1-id'
          }),
          buildQuestionPage({
            id: 'p3',
            title: 'Page Three',
            section: 'section-2-id'
          })
        ],
        sections: [
          { id: 'section-1-id', name: 'section-1', title: 'First Section' },
          { id: 'section-2-id', name: 'section-2', title: 'Second Section' }
        ]
      })

      const result = buildSectionsForPreview(definition)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'section-1-id',
        name: 'section-1',
        title: 'First Section',
        pages: [{ title: 'Page One' }, { title: 'Page Two' }]
      })
      expect(result[1]).toEqual({
        id: 'section-2-id',
        name: 'section-2',
        title: 'Second Section',
        pages: [{ title: 'Page Three' }]
      })
    })

    it('should return section with empty pages array if no pages assigned', () => {
      const definition = buildDefinition({
        pages: [buildQuestionPage({ id: 'p1', title: 'Unassigned Page' })],
        sections: [
          {
            id: 'empty-section-id',
            name: 'empty-section',
            title: 'Empty Section'
          }
        ]
      })

      const result = buildSectionsForPreview(definition)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'empty-section-id',
        name: 'empty-section',
        title: 'Empty Section',
        pages: []
      })
    })
  })

  describe('getUnassignedPageTitlesForPreview', () => {
    it('should return all pages when none are assigned to sections', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'p1', title: 'Page One' }),
          buildQuestionPage({ id: 'p2', title: 'Page Two' })
        ],
        sections: []
      })

      const result = getUnassignedPageTitlesForPreview(definition)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ title: 'Page One' })
      expect(result[1]).toEqual({ title: 'Page Two' })
    })

    it('should return empty array when all pages are assigned', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Page One',
            section: 'section-1'
          })
        ],
        sections: [{ name: 'section-1', title: 'Section One' }]
      })

      const result = getUnassignedPageTitlesForPreview(definition)

      expect(result).toEqual([])
    })

    it('should return only unassigned pages', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Assigned Page',
            section: 'section-1'
          }),
          buildQuestionPage({ id: 'p2', title: 'Unassigned Page' })
        ],
        sections: [{ name: 'section-1', title: 'Section One' }]
      })

      const result = getUnassignedPageTitlesForPreview(definition)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({ title: 'Unassigned Page' })
    })
  })

  describe('getDeclarationInfo', () => {
    it('should return hasDeclaration false when page is undefined', () => {
      const result = getDeclarationInfo(undefined)

      expect(result).toEqual({
        hasDeclaration: false,
        declarationText: ''
      })
    })

    it('should return hasDeclaration false when page has no components', () => {
      const page = buildSummaryPage({ id: 'cya', components: [] })
      const result = getDeclarationInfo(page)

      expect(result).toEqual({
        hasDeclaration: false,
        declarationText: ''
      })
    })

    it('should return hasDeclaration false when first component is not markdown', () => {
      const page = buildSummaryPage({
        id: 'cya',
        components: [buildTextFieldComponent({ title: 'Question' })]
      })
      const result = getDeclarationInfo(page)

      expect(result).toEqual({
        hasDeclaration: false,
        declarationText: ''
      })
    })

    it('should return hasDeclaration true when first component is markdown', () => {
      const page = buildSummaryPage({
        id: 'cya',
        components: [
          buildMarkdownComponent({ content: 'I agree to the terms' })
        ]
      })
      const result = getDeclarationInfo(page)

      expect(result).toEqual({
        hasDeclaration: true,
        declarationText: 'I agree to the terms'
      })
    })

    it('should only check first component for declaration', () => {
      const page = buildSummaryPage({
        id: 'cya',
        components: [
          buildTextFieldComponent({ title: 'Question' }),
          buildMarkdownComponent({ content: 'This should not be detected' })
        ]
      })
      const result = getDeclarationInfo(page)

      expect(result).toEqual({
        hasDeclaration: false,
        declarationText: ''
      })
    })

    it('should return hasDeclaration false when markdown content is empty', () => {
      const page = buildSummaryPage({
        id: 'cya',
        components: [buildMarkdownComponent({ content: '' })]
      })
      const result = getDeclarationInfo(page)

      expect(result).toEqual({
        hasDeclaration: false,
        declarationText: ''
      })
    })
  })

  describe('getCheckAnswersTabConfig', () => {
    const testSlug = 'test-form'
    const testPageId = 'cya-page'

    it('should return all four tabs', () => {
      const result = getCheckAnswersTabConfig(
        testSlug,
        testPageId,
        CHECK_ANSWERS_TAB_PAGE_OVERVIEW
      )

      expect(result).toHaveLength(5)
      expect(result.map((t) => t.title)).toEqual([
        PAGE_OVERVIEW_TITLE,
        TAB_TITLE_DECLARATION,
        TAB_TITLE_CONFIRMATION_EMAIL,
        TAB_TITLE_REFERENCE_NUMBER,
        TAB_TITLE_SECTIONS
      ])
    })

    it('should mark page overview tab as active', () => {
      const result = getCheckAnswersTabConfig(
        testSlug,
        testPageId,
        CHECK_ANSWERS_TAB_PAGE_OVERVIEW
      )

      expect(result[0].isActive).toBe(true)
      expect(result[1].isActive).toBe(false)
      expect(result[2].isActive).toBe(false)
      expect(result[3].isActive).toBe(false)
      expect(result[4].isActive).toBe(false)
    })

    it('should mark declaration tab as active', () => {
      const result = getCheckAnswersTabConfig(
        testSlug,
        testPageId,
        CHECK_ANSWERS_TAB_DECLARATION
      )

      expect(result[0].isActive).toBe(false)
      expect(result[1].isActive).toBe(true)
      expect(result[2].isActive).toBe(false)
      expect(result[3].isActive).toBe(false)
      expect(result[4].isActive).toBe(false)
    })

    it('should mark confirmation emails tab as active', () => {
      const result = getCheckAnswersTabConfig(
        testSlug,
        testPageId,
        CHECK_ANSWERS_TAB_CONFIRMATION_EMAILS
      )

      expect(result[0].isActive).toBe(false)
      expect(result[1].isActive).toBe(false)
      expect(result[2].isActive).toBe(true)
      expect(result[3].isActive).toBe(false)
      expect(result[4].isActive).toBe(false)
    })

    it('should mark reference-number tab as active', () => {
      const result = getCheckAnswersTabConfig(
        testSlug,
        testPageId,
        CHECK_ANSWERS_TAB_REFERENCE_NUMBER
      )

      expect(result[0].isActive).toBe(false)
      expect(result[1].isActive).toBe(false)
      expect(result[2].isActive).toBe(false)
      expect(result[3].isActive).toBe(true)
      expect(result[4].isActive).toBe(false)
    })

    it('should mark sections tab as active', () => {
      const result = getCheckAnswersTabConfig(
        testSlug,
        testPageId,
        CHECK_ANSWERS_TAB_SECTIONS
      )

      expect(result[0].isActive).toBe(false)
      expect(result[1].isActive).toBe(false)
      expect(result[2].isActive).toBe(false)
      expect(result[3].isActive).toBe(false)
      expect(result[4].isActive).toBe(true)
    })

    it('should have correct full path links', () => {
      const result = getCheckAnswersTabConfig(
        testSlug,
        testPageId,
        CHECK_ANSWERS_TAB_PAGE_OVERVIEW
      )

      expect(result[0].link).toBe(
        `/library/${testSlug}/editor-v2/page/${testPageId}/${CHECK_ANSWERS_TAB_PAGE_OVERVIEW}`
      )
      expect(result[1].link).toBe(
        `/library/${testSlug}/editor-v2/page/${testPageId}/${CHECK_ANSWERS_TAB_DECLARATION}`
      )
      expect(result[2].link).toBe(
        `/library/${testSlug}/editor-v2/page/${testPageId}/${CHECK_ANSWERS_TAB_CONFIRMATION_EMAILS}`
      )
      expect(result[3].link).toBe(
        `/library/${testSlug}/editor-v2/page/${testPageId}/${CHECK_ANSWERS_TAB_REFERENCE_NUMBER}`
      )
      expect(result[4].link).toBe(
        `/library/${testSlug}/editor-v2/page/${testPageId}/${CHECK_ANSWERS_TAB_SECTIONS}`
      )
    })
  })

  describe('enrichPreviewModel', () => {
    it('should enrich preview model with sections and unassigned pages', () => {
      const basePreviewModel = {
        needDeclaration: true,
        declarationText: 'I agree to the terms',
        otherField: 'preserved'
      }
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Page One',
            section: 'section-1'
          }),
          buildQuestionPage({ id: 'p2', title: 'Unassigned Page' })
        ],
        sections: [{ name: 'section-1', title: 'First Section' }]
      })

      const result = enrichPreviewModel(basePreviewModel, definition)

      expect(result.sections).toHaveLength(1)
      expect(result.sections[0].title).toBe('First Section')
      expect(result.unassignedPages).toHaveLength(1)
      expect(result.unassignedPages[0].title).toBe('Unassigned Page')
      expect(result.declaration).toEqual({
        hasDeclaration: true,
        declarationText: 'I agree to the terms'
      })
    })

    it('should preserve all original properties from base model', () => {
      const basePreviewModel = {
        needDeclaration: false,
        declarationText: '',
        previewTitle: 'Preview of Check answers page',
        showConfirmationEmail: true,
        customField: 'should be preserved'
      }
      const definition = buildDefinition({
        pages: [],
        sections: []
      })

      const result = enrichPreviewModel(basePreviewModel, definition)

      expect(result.previewTitle).toBe('Preview of Check answers page')
      expect(result.showConfirmationEmail).toBe(true)
      expect(result.customField).toBe('should be preserved')
    })

    it('should not mutate the original base model', () => {
      const basePreviewModel = {
        needDeclaration: true,
        declarationText: 'Original text'
      }
      const definition = buildDefinition({
        pages: [],
        sections: []
      })

      const result = enrichPreviewModel(basePreviewModel, definition)

      // Original should not have new properties
      expect(basePreviewModel).not.toHaveProperty('sections')
      expect(basePreviewModel).not.toHaveProperty('unassignedPages')
      expect(basePreviewModel).not.toHaveProperty('declaration')

      // Result should have new properties
      expect(result).toHaveProperty('sections')
      expect(result).toHaveProperty('unassignedPages')
      expect(result).toHaveProperty('declaration')
    })

    it('should set hasDeclaration false when needDeclaration is false', () => {
      const basePreviewModel = {
        needDeclaration: false,
        declarationText: ''
      }
      const definition = buildDefinition({
        pages: [],
        sections: []
      })

      const result = enrichPreviewModel(basePreviewModel, definition)

      expect(result.declaration.hasDeclaration).toBe(false)
      expect(result.declaration.declarationText).toBe('')
    })
  })
})

/**
 * @import { ConditionWrapperV2 } from '@defra/forms-model'
 */
