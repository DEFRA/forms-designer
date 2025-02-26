import {
  testFormDefinitionWithNoQuestions,
  testFormDefinitionWithSinglePage,
  testFormDefinitionWithTwoQuestions,
  testFormDefinitionWithoutSummary
} from '~/src/__stubs__/form-definition.js'
import {
  getPageNum,
  getQuestionNum,
  getQuestionsOnPage
} from '~/src/models/forms/editor-v2/common.js'

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
})
