import { ValidationError } from 'joi'

import { ComponentType } from '~/src/components/enums.js'
import {
  type ComponentDef,
  type NumberFieldComponent
} from '~/src/components/types.js'
import {
  formDefinitionSchema,
  formDefinitionV2Schema
} from '~/src/form/form-definition/index.js'
import {
  type FormDefinition,
  type List,
  type PageQuestion,
  type PageSummary
} from '~/src/form/form-definition/types.js'
import { ControllerPath, ControllerType } from '~/src/index.js'

const buildQuestionPage = (
  partialQuestion: Partial<PageQuestion>
): PageQuestion => {
  return {
    title: 'Question Page',
    path: '/question-page',
    components: [],
    next: [],
    ...partialQuestion
  }
}

const buildNumberFieldComponent = (
  partialComponent: Partial<NumberFieldComponent>
): NumberFieldComponent => {
  return {
    name: 'year',
    title: 'Year',
    options: {},
    schema: {},
    ...partialComponent,
    type: ComponentType.NumberField
  }
}

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

      it('should reject names with letters and numbers', () => {
        testComponent.name = 'valid123name'
        page.components = [testComponent]

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeDefined()
        expect(result.error?.details[0].message).toMatch(/pattern/)
      })

      it('should reject names with letters, numbers and underscores', () => {
        testComponent.name = 'valid_123_name'
        page.components = [testComponent]

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeDefined()
        expect(result.error?.details[0].message).toMatch(/pattern/)
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

      it('should reject names that are only digits', () => {
        testComponent.name = '123'
        page.components = [testComponent]

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeDefined()
        expect(result.error?.details[0].message).toMatch(/pattern/)
      })

      it('should reject names that start with digits', () => {
        testComponent.name = '1foo'
        page.components = [testComponent]

        const result = formDefinitionSchema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeDefined()
        expect(result.error?.details[0].message).toMatch(/pattern/)
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

  describe('Form Definition', () => {
    describe('formDefinitionV2Schema', () => {
      const component1 = buildNumberFieldComponent({
        id: undefined,
        name: 'year',
        title: 'Year'
      })
      const component2 = buildNumberFieldComponent({
        id: undefined,
        name: 'month',
        title: 'Month'
      })

      const page = buildQuestionPage({
        id: undefined,
        path: '/page-one',
        title: 'Page One',
        components: [component1, component2]
      })

      const page2: PageSummary = {
        id: undefined,
        controller: ControllerType.Summary,
        path: ControllerPath.Summary,
        title: 'Summary Page',
        components: []
      }

      const list: List = {
        items: [
          {
            id: 'a9dd35af-187e-4027-b8b1-e58a4aab3a82',
            text: 'Item 1',
            value: 'item-1'
          },
          {
            text: 'Item 2',
            value: 'item-2',
            hint: { text: 'a hint' }
          }
        ],
        name: 'ADxeWa',
        title: 'String List',
        type: 'string'
      }
      const list2: List = {
        items: [],
        name: 'ADxeWb',
        title: 'String List 2',
        type: 'string'
      }

      const definition: FormDefinition = {
        conditions: [],
        lists: [list, list2],
        pages: [page, page2],
        sections: []
      }

      it('should add ids to pages and components if one is missing', () => {
        const validated = formDefinitionV2Schema.validate(definition)

        expect(validated.error).toBeUndefined()
        expect(validated.value).toMatchObject({
          ...definition,
          pages: [
            {
              ...page,
              id: expect.any(String),
              components: [
                {
                  ...component1,
                  id: expect.any(String)
                },
                {
                  ...component2,
                  id: expect.any(String)
                }
              ]
            },
            {
              ...page2,
              id: expect.any(String)
            }
          ],
          lists: [
            {
              id: expect.any(String),
              items: [
                expect.objectContaining({ id: expect.any(String) }),
                expect.objectContaining({
                  id: expect.any(String),
                  hint: { id: expect.any(String), text: 'a hint' }
                })
              ]
            },
            { id: expect.any(String) }
          ]
        })
      })

      it('should not validate if there are duplicate list ids', () => {
        const validated = formDefinitionV2Schema.validate({
          ...definition,
          lists: [
            {
              ...list,
              id: '04fc2b13-ef4f-4e05-8433-bfa82bb2f0b8'
            },
            {
              items: [],
              name: 'ADxeWb',
              title: 'String List',
              type: 'string',
              id: '04fc2b13-ef4f-4e05-8433-bfa82bb2f0b8'
            }
          ]
        })

        expect(validated.error).toEqual(
          new ValidationError('"lists[1]" contains a duplicate value', [], {})
        )
      })
    })
  })
})
