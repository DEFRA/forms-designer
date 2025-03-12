import { ComponentType } from '~/src/components/enums.js'
import { type ComponentDef } from '~/src/components/types.js'
import { formDefinitionSchema } from '~/src/form/form-definition/index.js'
import {
  type FormDefinition,
  type PageQuestion
} from '~/src/form/form-definition/types.js'

describe('Form definition schema', () => {
  let page: PageQuestion
  let definition: FormDefinition

  beforeEach(() => {
    page = {
      id: '82468c50-ef86-47ae-bb67-0f7ddaa7d667',
      title: 'Example page',
      path: '/example',
      next: [],
      components: []
    }

    definition = {
      pages: [page],
      lists: [],
      sections: [],
      conditions: []
    }
  })

  describe('Feedback', () => {
    it("should allow empty feedback URL when 'feedbackForm' is false", () => {
      definition.feedback = {
        feedbackForm: false,
        url: ''
      }

      const result = formDefinitionSchema.validate(definition, {
        abortEarly: false
      })

      expect(result.error).toBeUndefined()
    })
  })

  describe('Summary', () => {
    it("should remove legacy 'skipSummary' flag", () => {
      // @ts-expect-error - Allow invalid property for test
      definition.skipSummary = true

      const result = formDefinitionSchema.validate(definition, {
        abortEarly: false
      })

      expect(result.error).toBeUndefined()
      expect(result.value).not.toHaveProperty('skipSummary')
    })
  })

  describe('Component validation', () => {
    describe('Custom validation messages', () => {
      const component: ComponentDef = {
        id: 'fdeaa717-8e81-43fd-acce-2d83b6d63181',
        name: 'year',
        title: 'Year',
        type: ComponentType.NumberField,
        options: {},
        schema: {}
      }

      it('should be optional', () => {
        page.components.push(component)

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeUndefined()
      })

      it('should allow unknown props', () => {
        component.options = {
          customValidationMessages: {
            'number.min': '{{#title}} must be a real date',
            'number.max': '{{#title}} must be a real date',
            'number.base': `{{#title}} must include a {{#label}}`
          }
        }

        page.components.push(component)

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeUndefined()
      })
    })

    describe('For regular components (TextField, etc.)', () => {
      let testComponent: ComponentDef

      beforeEach(() => {
        testComponent = {
          id: 'fdeaa717-8e81-43fd-acce-2d83b6d63181',
          name: 'defaultname',
          title: 'Test Component',
          type: ComponentType.TextField,
          options: {},
          schema: {}
        }
      })

      it('should accept names with letters only', () => {
        testComponent.name = 'validname'
        page.components = [testComponent]

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeUndefined()
      })

      it('should accept names with letters and numbers', () => {
        testComponent.name = 'valid123name'
        page.components = [testComponent]
      })

      it('should accept names with letters, numbers and underscores', () => {
        testComponent.name = 'valid_123_name'
        page.components = [testComponent]

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeUndefined()
      })

      it('should reject names with dashes', () => {
        testComponent.name = 'invalid-name'
        page.components = [testComponent]

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeDefined()
        expect(result.error?.details[0].message).toMatch(/pattern/)
      })

      it('should reject names with spaces', () => {
        testComponent.name = 'invalid name'
        page.components = [testComponent]

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeDefined()
        expect(result.error?.details[0].message).toMatch(/pattern/)
      })

      it('should accept names that are only digits', () => {
        testComponent.name = '123'
        page.components = [testComponent]

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeUndefined()
      })

      it('should accept names that start with digits', () => {
        testComponent.name = '1foo'
        page.components = [testComponent]

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeUndefined()
      })
    })

    describe('For special components (Html, Markdown, etc.)', () => {
      let testComponent: ComponentDef

      beforeEach(() => {
        testComponent = {
          id: 'fdeaa717-8e81-43fd-acce-2d83b6d63181',
          name: 'defaultname',
          title: 'Test Component',
          type: ComponentType.Html,
          options: {},
          content: 'Some HTML content'
        }
      })

      it('should accept valid names', () => {
        testComponent.name = 'validname'
        page.components = [testComponent]

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeUndefined()
      })

      it('should reject names with dashes', () => {
        testComponent.name = 'invalid-name'
        page.components = [testComponent]

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeDefined()
        expect(result.error?.details[0].message).toMatch(/pattern/)
      })

      it('should reject names with other special characters', () => {
        testComponent.name = 'invalid.name'
        page.components = [testComponent]

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeDefined()
        expect(result.error?.details[0].message).toMatch(/pattern/)
      })
    })
  })
})
