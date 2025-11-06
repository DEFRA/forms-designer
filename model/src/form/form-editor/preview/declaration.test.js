import { buildDeclarationFieldComponent } from '~/src/__stubs__/components.js'
import { ComponentType } from '~/src/components/enums.js'
import {
  DeclarationPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import {
  DeclarationComponentPreviewElements,
  DeclarationQuestion
} from '~/src/form/form-editor/preview/declaration.js'

describe('declaration', () => {
  const renderer = new QuestionRendererStub(jest.fn())

  describe('DeclarationComponentPreviewElements', () => {
    it('should create class with declaration text', () => {
      const component = buildDeclarationFieldComponent({
        title: 'Declaration title',
        content: 'I agree to the terms and conditions'
      })
      const elements = new DeclarationComponentPreviewElements(component)

      expect(elements).toBeDefined()
      // @ts-expect-error - declarationText exists on DeclarationSettings
      expect(elements.values.declarationText).toBe(
        'I agree to the terms and conditions'
      )
    })

    it('should handle empty declaration text', () => {
      const component = buildDeclarationFieldComponent({
        title: 'Declaration title',
        content: ''
      })
      const elements = new DeclarationComponentPreviewElements(component)

      // @ts-expect-error - declarationText exists on DeclarationSettings
      expect(elements.values.declarationText).toBe('')
    })

    it('should include base values from parent class', () => {
      const component = buildDeclarationFieldComponent({
        title: 'Declaration title',
        hint: 'Please read carefully',
        content: 'I agree',
        options: {
          required: false,
          classes: 'custom-class'
        },
        shortDescription: 'Agreement'
      })
      const elements = new DeclarationComponentPreviewElements(component)

      expect(elements.values).toEqual({
        question: 'Declaration title',
        hintText: 'Please read carefully',
        userClasses: 'custom-class',
        optional: true,
        content: '',
        shortDesc: 'Agreement',
        items: [],
        declarationText: 'I agree'
      })
    })

    it('should handle component with all default values', () => {
      const component = buildDeclarationFieldComponent()
      const elements = new DeclarationComponentPreviewElements(component)

      // @ts-expect-error - declarationText exists on DeclarationSettings
      expect(elements.values.declarationText).toBe('')
      expect(elements.values.question).toBe('Declaration')
    })
  })

  describe('DeclarationQuestion', () => {
    it('should create class with correct component type', () => {
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        declarationText: 'I agree to the terms'
      })
      const question = new DeclarationQuestion(elements, renderer)

      expect(question).toBeDefined()
      expect(question.componentType).toBe(ComponentType.DeclarationField)
    })

    it('should have correct template path', () => {
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        declarationText: 'I agree'
      })
      const question = new DeclarationQuestion(elements, renderer)

      // Access the protected property for testing purposes
      // @ts-expect-error - accessing protected property for testing
      expect(question._questionTemplate).toContain('declarationfield.njk')
    })

    it('should initialize with declaration text from elements', () => {
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        declarationText: 'I agree to the terms and conditions'
      })
      const question = new DeclarationQuestion(elements, renderer)

      expect(question.declarationText).toBe(
        'I agree to the terms and conditions'
      )
    })

    it('should handle empty declaration text', () => {
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        declarationText: ''
      })
      const question = new DeclarationQuestion(elements, renderer)

      expect(question.declarationText).toBe('')
    })

    it('should return correct renderInput with declaration text', () => {
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        declarationText: 'I agree to the terms'
      })
      const question = new DeclarationQuestion(elements, renderer)

      expect(question.renderInput).toEqual({
        id: 'DeclarationField',
        name: 'DeclarationField',
        classes: '',
        label: {
          text: 'Which quest would you like to pick?',
          classes: 'govuk-label--l',
          isPageHeading: true
        },
        hint: {
          text: 'Choose one adventure that best suits you.',
          classes: ''
        },
        previewClasses: '',
        declaration: {
          text: 'I agree to the terms',
          classes: ''
        }
      })
    })

    it('should return default text when declaration text is empty', () => {
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        declarationText: ''
      })
      const question = new DeclarationQuestion(elements, renderer)

      // @ts-expect-error - declaration property exists on DeclarationModel
      expect(question.renderInput.declaration.text).toBe('Declaration text')
    })

    it('should update declaration text via setter', () => {
      const mockRender = jest.fn()
      const renderer = new QuestionRendererStub(mockRender)
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        declarationText: 'Original text'
      })
      const question = new DeclarationQuestion(elements, renderer)

      expect(question.declarationText).toBe('Original text')

      question.declarationText = 'Updated text'

      expect(question.declarationText).toBe('Updated text')
      expect(mockRender).toHaveBeenCalled()
    })

    it('should trigger render when declaration text is set', () => {
      const mockRender = jest.fn()
      const renderer = new QuestionRendererStub(mockRender)
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        declarationText: 'Original'
      })
      const question = new DeclarationQuestion(elements, renderer)

      mockRender.mockClear()
      question.declarationText = 'New text'

      expect(mockRender).toHaveBeenCalledTimes(1)
    })

    it('should highlight declaration text when specified', () => {
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        declarationText: 'I agree'
      })
      const question = new DeclarationQuestion(elements, renderer)

      question.highlight = 'declarationText'

      // @ts-expect-error - declaration property exists on DeclarationModel
      expect(question.renderInput.declaration.classes).toBe(HIGHLIGHT_CLASS)
    })

    it('should not highlight declaration text when highlight is different', () => {
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        declarationText: 'I agree'
      })
      const question = new DeclarationQuestion(elements, renderer)

      question.highlight = 'hintText'

      // @ts-expect-error - declaration property exists on DeclarationModel
      expect(question.renderInput.declaration.classes).toBe('')
    })

    it('should not highlight declaration text when highlight is null', () => {
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        declarationText: 'I agree'
      })
      const question = new DeclarationQuestion(elements, renderer)

      question.highlight = null

      // @ts-expect-error - declaration property exists on DeclarationModel
      expect(question.renderInput.declaration.classes).toBe('')
    })

    it('should apply highlight class with empty declaration text', () => {
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        declarationText: ''
      })
      const question = new DeclarationQuestion(elements, renderer)

      question.highlight = 'declarationText'

      // @ts-expect-error - declaration property exists on DeclarationModel
      expect(question.renderInput.declaration).toEqual({
        text: 'Declaration text',
        classes: HIGHLIGHT_CLASS
      })
    })

    it('should include base properties in renderInput', () => {
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        question: 'Custom question',
        hintText: 'Custom hint',
        declarationText: 'I agree'
      })
      const question = new DeclarationQuestion(elements, renderer)

      const renderInput = question.renderInput

      expect(renderInput.id).toBe('DeclarationField')
      expect(renderInput.name).toBe('DeclarationField')
      // @ts-expect-error - label and hint exist on DeclarationModel
      expect(renderInput.label.text).toBe('Custom question')
      // @ts-expect-error - label and hint exist on DeclarationModel
      expect(renderInput.hint.text).toBe('Custom hint')
      // @ts-expect-error - declaration property exists on DeclarationModel
      expect(renderInput.declaration.text).toBe('I agree')
    })

    it('should handle user-supplied classes', () => {
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        userClasses: 'custom-declaration-class',
        declarationText: 'I agree'
      })
      const question = new DeclarationQuestion(elements, renderer)

      expect(question.renderInput.classes).toBe('custom-declaration-class')
    })

    it('should combine declaration text changes with other property changes', () => {
      const mockRender = jest.fn()
      const renderer = new QuestionRendererStub(mockRender)
      const elements = new DeclarationPreviewElements({
        ...baseElements,
        declarationText: 'Original'
      })
      const question = new DeclarationQuestion(elements, renderer)

      mockRender.mockClear()

      question.question = 'New question'
      question.declarationText = 'New declaration'
      question.hintText = 'New hint'

      expect(question.question).toBe('New question')
      expect(question.declarationText).toBe('New declaration')
      expect(question.hintText).toBe('New hint')
      expect(mockRender).toHaveBeenCalledTimes(3)
    })
  })
})
