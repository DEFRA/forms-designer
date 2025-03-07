import { ComponentType } from '~/src/components/enums.js'
import {
  type ComponentDef,
  type NumberFieldComponent
} from '~/src/components/types.js'
import {
  formDefinitionSchema,
  formDefinitionV2PayloadSchema
} from '~/src/form/form-definition/index.js'
import {
  type FormDefinition,
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

  describe('Components', () => {
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
  })

  describe('Form Definition', () => {
    describe('formDefinitionV2PayloadSchema', () => {
      it('should add ids to pages and components if one is missing', () => {
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
        const definition: FormDefinition = {
          conditions: [],
          lists: [],
          pages: [page, page2],
          sections: []
        }

        const validated = formDefinitionV2PayloadSchema.validate(definition)

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
          ]
        })
      })
    })
  })
})
