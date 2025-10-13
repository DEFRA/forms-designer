import { buildTextFieldComponent } from '~/src/__stubs__/components.js'
import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import {
  Question,
  QuestionComponentElements
} from '~/src/form/form-editor/preview/question.js'

describe('question', () => {
  const renderer = new QuestionRendererStub(jest.fn())
  const questionElements = new QuestionPreviewElements(baseElements)
  describe('Question', () => {
    it('should create class', () => {
      const res = new Question(questionElements, renderer)
      expect(res.renderInput).toEqual({
        id: expect.stringContaining('inputField'),
        name: expect.stringContaining('inputField'),
        classes: '',
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
      const res = new Question(questionElements, renderer)
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
      const res = new Question(questionElements, renderer)
      res.question = ''
      expect(res.titleText).toBe('Question')
      res.hintText = ''
      res.highlight = 'hintText'
      expect(res.renderInput).toEqual({
        id: expect.stringContaining('inputField'),
        name: expect.stringContaining('inputField'),
        classes: '',
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
      const preview = new Question(questionElements, renderer)
      preview.highlight = `hintText`
      expect(preview.renderInput.hint).toMatchObject({
        text: 'Choose one adventure that best suits you.',
        classes: ' highlight'
      })
    })
  })

  describe('QuestionComponentElements', () => {
    const textFieldComponent = buildTextFieldComponent({
      title: 'Form field title',
      hint: 'Hint text',
      name: 'FFT',
      options: {
        required: false
      },
      shortDescription: 'shortDesc'
    })

    it('should map a component base to QuestionElements', () => {
      expect(new QuestionComponentElements(textFieldComponent).values).toEqual({
        question: 'Form field title',
        hintText: 'Hint text',
        optional: true,
        content: '',
        shortDesc: 'shortDesc',
        items: []
      })
    })

    it('should map a component base to QuestionElements with a small title', () => {
      expect(new QuestionComponentElements(textFieldComponent).values).toEqual({
        question: 'Form field title',
        hintText: 'Hint text',
        optional: true,
        content: '',
        shortDesc: 'shortDesc',
        items: []
      })
    })
  })
})
