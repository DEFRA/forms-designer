import { buildMarkdownComponent } from '~/src/__stubs__/components.js'
import { QuestionRendererStub } from '~/src/form/form-editor/__stubs__/preview.js'
import { ContentElements } from '~/src/form/form-editor/preview/content.js'
import { Markdown } from '~/src/form/form-editor/preview/markdown.js'

describe('markdown', () => {
  const renderer = new QuestionRendererStub(jest.fn())
  const questionElements = new ContentElements(
    buildMarkdownComponent({
      title: 'Which quest would you like to pick?',
      content: '# This is a heading demoted'
    })
  )
  describe('Markdown', () => {
    it('should create class', () => {
      expect(questionElements.values.content).toBe(
        '# This is a heading demoted'
      )
      const res = new Markdown(questionElements, renderer)
      expect(res.renderInput).toEqual({
        id: 'markdown',
        name: 'markdown',
        classes: '',
        content: '<h2>This is a heading demoted</h2>\n'
      })
      expect(res.titleText).toBe('Which quest would you like to pick?')
      expect(res.question).toBe('Which quest would you like to pick?')
      expect(res.optional).toBeFalsy()
      expect(res.highlight).toBeNull()
    })

    it('should handle changed values', () => {
      const res = new Markdown(questionElements, renderer)
      expect(res.titleText).toBe('Which quest would you like to pick?')
      expect(res.question).toBe('Which quest would you like to pick?')
      expect(res.optional).toBeFalsy()
      expect(res.highlight).toBeNull()
      res.question = 'New question'
      expect(res.question).toBe('New question')
      res.highlight = 'content'
      expect(res.highlight).toBe('content')
      res.optional = true
      expect(res.titleText).toBe('New question (optional)')
      res.content = '## This is a subheading'
      expect(res.content).toBe('<h2>This is a subheading</h2>\n')
    })
  })
})
