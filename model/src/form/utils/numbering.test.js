import {
  formDefinitionWithNoQuestions,
  formDefinitionWithSinglePage,
  formDefinitionWithTwoQuestions,
  formDefinitionWithoutSummary
} from '~/src/form/form-definition/examples.js'
import {
  getPageNum,
  getQuestionNum,
  getQuestionsOnPage
} from '~/src/form/utils/numbering.js'

describe('numbering', () => {
  describe('getPageNum', () => {
    test('should return page number if no real page id', () => {
      const pageNum = getPageNum(formDefinitionWithSinglePage, 'new')
      expect(pageNum).toBe(2)
    })
    test('should return page number if no real page id - when no summary page', () => {
      const pageNum = getPageNum(formDefinitionWithoutSummary, 'new')
      expect(pageNum).toBe(2)
    })
    test('should return page number if proper page id', () => {
      const pageNum = getPageNum(formDefinitionWithSinglePage, 'p1')
      expect(pageNum).toBe(1)
    })
    test('should return page number if proper page id - when no summary page', () => {
      const pageNum = getPageNum(formDefinitionWithoutSummary, 'p1')
      expect(pageNum).toBe(1)
    })
  })

  describe('getQuestionsOnPage', () => {
    test('should return two questions', () => {
      const questions = getQuestionsOnPage(formDefinitionWithTwoQuestions, 'p1')
      expect(questions).toHaveLength(2)
    })
    test('should return no questions when not a question page', () => {
      const questions = getQuestionsOnPage(formDefinitionWithTwoQuestions, 'p2')
      expect(questions).toHaveLength(0)
    })

    test('should return one question', () => {
      const questions = getQuestionsOnPage(formDefinitionWithSinglePage, 'p1')
      expect(questions).toHaveLength(1)
    })
  })

  describe('getQuestionNum', () => {
    test('should return 1 if no questions', () => {
      const questionNum = getQuestionNum(
        formDefinitionWithNoQuestions,
        'p1',
        'new'
      )
      expect(questionNum).toBe(1)
    })
    test('should return 3 when 2 questions on page', () => {
      const questionNum = getQuestionNum(
        formDefinitionWithTwoQuestions,
        'p1',
        'new'
      )
      expect(questionNum).toBe(3)
    })

    test('should return specific question number for q1', () => {
      const questionNum = getQuestionNum(
        formDefinitionWithTwoQuestions,
        'p1',
        'q1'
      )
      expect(questionNum).toBe(1)
    })

    test('should return specific question number for q2', () => {
      const questionNum = getQuestionNum(
        formDefinitionWithTwoQuestions,
        'p1',
        'q2'
      )
      expect(questionNum).toBe(2)
    })

    test('should return snext question number if not found', () => {
      const questionNum = getQuestionNum(
        formDefinitionWithTwoQuestions,
        'p1',
        'qxxx'
      )
      expect(questionNum).toBe(3)
    })
  })
})
