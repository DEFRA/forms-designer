import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewHTML
} from '~/src/javascripts/preview/__stubs__/question'
import {
  Question,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'

jest.mock('~/src/javascripts/preview/nunjucks.js')

describe('question', () => {
  describe('QuestionElements', () => {
    it('should find elements', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
      const res = new QuestionDomElements()
      expect(res).toBeDefined()
      expect(res.question).toBeDefined()
      expect(res.hintText).toBeDefined()
      expect(res.optional).toBeDefined()
      expect(res.shortDesc).toBeDefined()
      expect(res.preview).toBeDefined()
    })

    it('should set preview if found', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
      const res = new QuestionDomElements()
      expect(res.preview).toBeDefined()
      const html = '<div id="preview">123</div>'
      res.setPreviewHTML(html)
      expect(res.preview?.innerHTML).toBe(html)
    })

    it('should not set preview if not found', () => {
      document.body.innerHTML = questionDetailsLeftPanelHTML
      const res = new QuestionDomElements()
      expect(res.preview).toBeNull()
      const html = '<div id="preview">123</div>'
      res.setPreviewHTML(html)
      expect(res.preview?.innerHTML).toBeUndefined()
    })
  })

  describe('Question', () => {
    it('should create class', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
      const res = new Question(new QuestionDomElements())
      expect(res).toBeDefined()
      expect(res.renderInput).toEqual({
        id: 'inputField',
        name: 'inputField',
        label: {
          text: 'Which quest would you like to pick?',
          classes: 'govuk-label--l'
        },
        hint: {
          text: 'Choose one adventure that best suits you.',
          classes: ''
        }
      })
      expect(res.titleText).toBe('Which quest would you like to pick?')
      expect(res.question).toBe('Which quest would you like to pick?')
      expect(res.hintText).toBe('Choose one adventure that best suits you.')
      expect(res.optional).toBeFalsy()
      expect(res.highlight).toBeNull()
    })

    it('should handle changed values', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
      const res = new Question(new QuestionDomElements())
      expect(res.titleText).toBe('Which quest would you like to pick?')
      expect(res.question).toBe('Which quest would you like to pick?')
      expect(res.hintText).toBe('Choose one adventure that best suits you.')
      expect(res.optional).toBeFalsy()
      expect(res.highlight).toBeNull()
      res.question = 'New question'
      expect(res.question).toBe('New question')
      res.hintText = 'New hint text'
      expect(res.hintText).toBe('New hint text')
      res.optional = true
      expect(res.titleText).toBe('New question (optional)')
    })

    it('should handle missing values', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
      const res = new Question(new QuestionDomElements())
      res.question = ''
      expect(res.titleText).toBe('Question')
      res.hintText = ''
      res.highlight = 'hintText'
      expect(res.renderInput).toEqual({
        id: 'inputField',
        name: 'inputField',
        label: {
          text: 'Question',
          classes: 'govuk-label--l'
        },
        hint: {
          text: 'Hint text',
          classes: ' highlight'
        }
      })
    })

    it('should highlight', () => {
      const preview = Question.setupPreview()
      preview.highlight = `hintText`
      expect(preview).toMatchObject({
        hint: { text: 'Hint text' }
      })
    })
  })
})
