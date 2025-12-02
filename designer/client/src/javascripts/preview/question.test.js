import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewHTML
} from '~/src/javascripts/preview/__stubs__/question'
import { QuestionDomElements } from '~/src/javascripts/preview/question.js'
import { SetupPreview } from '~/src/javascripts/setup-preview.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('question', () => {
  describe('QuestionElements', () => {
    const textNode = document.createTextNode('123')
    const innerEl = document.createElement('span')
    innerEl.appendChild(textNode)
    const el = document.createElement('div')
    el.classList.add('preview')
    el.appendChild(innerEl)

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
      expect(res.preview?.innerHTML).toBe(
        `<div id="preview-panel-inner">${html}</div>`
      )
    })

    it('should not set preview if not found', () => {
      document.body.innerHTML = questionDetailsLeftPanelHTML
      const res = new QuestionDomElements()
      expect(res.preview).toBeNull()
      const html = '<div id="preview">123</div>'
      res.setPreviewHTML(html)
      expect(res.preview?.innerHTML).toBeUndefined()
    })

    it('should setPreviewDOM', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
      const res = new QuestionDomElements()
      expect(res.preview).toBeDefined()

      res.setPreviewDOM(el)
      expect(res.preview?.innerHTML).toBe(
        `<div id="preview-panel-inner"><div class="preview"><span>123</span></div></div>`
      )
    })

    it('should not set preview dom if not found', () => {
      document.body.innerHTML = questionDetailsLeftPanelHTML
      const res = new QuestionDomElements()
      expect(res.preview).toBeNull()
      res.setPreviewDOM(el)
      expect(res.preview?.innerHTML).toBeUndefined()
    })
  })

  describe('Question', () => {
    it('should create class', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
      const res = SetupPreview('Question')
      expect(res).toBeDefined()
      expect(res.renderInput).toEqual({
        id: expect.stringContaining('inputField'),
        classes: '',
        name: 'inputField',
        label: {
          text: 'Which quest would you like to pick?',
          classes: 'govuk-label--l',
          isPageHeading: true
        },
        hint: {
          text: 'Choose one adventure that best suits you.',
          classes: ''
        },
        previewClasses: ''
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
      const res = SetupPreview('Question')
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
      const res = SetupPreview('Question')
      res.question = ''
      expect(res.titleText).toBe('Question')
      res.hintText = ''
      res.highlight = 'hintText'
      expect(res.renderInput).toEqual({
        id: expect.stringContaining('inputField'),
        classes: '',
        name: 'inputField',
        label: {
          text: 'Question',
          classes: 'govuk-label--l',
          isPageHeading: false
        },
        hint: {
          text: 'Hint text',
          classes: ' highlight'
        },
        previewClasses: ''
      })
    })

    it('should highlight', () => {
      const preview = SetupPreview('Question')
      preview.highlight = `hintText`
      expect(preview).toMatchObject({
        hint: { text: 'Hint text' }
      })
    })
  })
})
