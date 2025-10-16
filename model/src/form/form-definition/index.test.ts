import { ValidationError } from 'joi'

import {
  buildDateComponent,
  buildDetailsComponent,
  buildEmailAddressFieldComponent,
  buildFileUploadComponent,
  buildHtmlComponent,
  buildInsetTextComponent,
  buildList,
  buildListItem,
  buildMarkdownComponent,
  buildMonthYearFieldComponent,
  buildMultilineTextFieldComponent,
  buildNumberFieldComponent,
  buildRadioComponent,
  buildRadiosComponent,
  buildTelephoneNumberFieldComponent,
  buildTextFieldComponent,
  buildUkAddressFieldComponent
} from '~/src/__stubs__/components.js'
import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import {
  buildFileUploadPage,
  buildQuestionPage,
  buildRepeaterPage,
  buildSummaryPage,
  buildTerminalPage
} from '~/src/__stubs__/pages.js'
import { ComponentType } from '~/src/components/enums.js'
import {
  type ComponentDef,
  type TextFieldComponent
} from '~/src/components/types.js'
import {
  ConditionType,
  Coordinator,
  DateDirections,
  DateUnits,
  OperatorName
} from '~/src/conditions/enums.js'
import {
  type ConditionDataV2,
  type ConditionListItemRefValueDataV2,
  type ConditionRefDataV2,
  type RelativeDateValueDataV2
} from '~/src/conditions/types.js'
import {
  contentComponentSchema,
  fileUploadComponentSchema,
  formDefinitionSchema,
  formDefinitionV2Schema,
  pageSchema,
  pageSchemaV2
} from '~/src/form/form-definition/index.js'
import {
  type ConditionWrapperV2,
  type FormDefinition,
  type List,
  type PageQuestion,
  type PageSummary
} from '~/src/form/form-definition/types.js'
import { ControllerPath, ControllerType } from '~/src/pages/enums.js'

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

      it('should allow valid regex', () => {
        const testComponent1 = testComponent as TextFieldComponent
        testComponent1.name = 'textfield'
        testComponent1.schema.regex = '[A-Z]'
        page.components = [testComponent1]

        const result = formDefinitionV2Schema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeUndefined()
      })

      it('should reject invalid regex', () => {
        const testComponent1 = testComponent as TextFieldComponent
        testComponent1.name = 'textfield'
        testComponent1.schema.regex = '*'
        page.components = [testComponent1]

        const result = formDefinitionV2Schema.validate(definition, {
          abortEarly: false
        })

        expect(result.error).toBeDefined()
        expect(result.error?.details[0].message).toContain(
          'The regex expression is invalid'
        )
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

    describe('Content only validation', () => {
      describe('ContentComponentsDef - validate', () => {
        it.each([
          [ComponentType.Details, buildDetailsComponent()],
          [ComponentType.Html, buildHtmlComponent()],
          [ComponentType.Markdown, buildMarkdownComponent()],
          [ComponentType.InsetText, buildInsetTextComponent()]
        ])('should permit content fields - %s', (componentType, component) => {
          const { error } = contentComponentSchema.validate(component)
          expect(error).toBeUndefined()
        })
      })

      describe('InputFieldsComponentsDef - fail validation', () => {
        it.each([
          [ComponentType.TextField, buildTextFieldComponent()],
          [ComponentType.EmailAddressField, buildEmailAddressFieldComponent()],
          [ComponentType.NumberField, buildNumberFieldComponent()],
          [
            ComponentType.MultilineTextField,
            buildMultilineTextFieldComponent()
          ],
          [
            ComponentType.TelephoneNumberField,
            buildTelephoneNumberFieldComponent()
          ],
          [ComponentType.MonthYearField, buildMonthYearFieldComponent()],
          [ComponentType.DatePartsField, buildDateComponent()],
          [ComponentType.UkAddressField, buildUkAddressFieldComponent()],
          [ComponentType.FileUploadField, buildFileUploadComponent()]
        ])(
          'should not permit input fields - %s',
          (componentType, component) => {
            const { error } = contentComponentSchema.validate(component)
            expect(error).toEqual(
              new ValidationError(
                '"type" must be one of [Details, Html, Markdown, InsetText, List]',
                [],
                component
              )
            )
          }
        )
      })
    })
    describe('FileUploadController components', () => {
      it('should allow a FileUploadComponent', () => {
        const component = buildFileUploadComponent()
        const result = fileUploadComponentSchema.validate(component)
        expect(result.error).toBeUndefined()
      })
      it('should not allow a QuestionComponent', () => {
        const component = buildTextFieldComponent()
        const result = fileUploadComponentSchema.validate(component)
        expect(result.error).toEqual(
          new ValidationError('"type" must be [FileUploadField]', [], component)
        )
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
      const component2 = buildTextFieldComponent({
        id: 'd8115721-7b71-4587-8a93-6499d3a3f94c',
        name: 'fullName',
        title: 'Full name'
      })
      const component3 = buildDateComponent({
        id: '91c22b37-75a0-4d59-8879-6b9790e694f7',
        name: 'dueDate',
        title: 'Due date'
      })
      const component4 = buildRadiosComponent({
        id: '69272c34-5acb-42cd-b9fe-38ad58e3a524',
        name: 'faveColour',
        title: 'Fave colour',
        list: '14ec8ab5-05a0-4b00-b866-d40146077d7a'
      })

      const page = buildQuestionPage({
        id: undefined,
        path: '/page-one',
        title: 'Page One',
        components: [component1, component2, component3, component4]
      })

      const page2 = buildQuestionPage({
        id: undefined,
        path: '/page-two',
        title: 'Page Two',
        components: []
      })

      const pageSummary: PageSummary = {
        id: undefined,
        controller: ControllerType.Summary,
        path: ControllerPath.Summary,
        title: 'Summary Page',
        components: []
      }

      const stringValueConditionData = 'Enrique Chase'

      const relativeDateConditionData: RelativeDateValueDataV2 = {
        period: 7,
        unit: DateUnits.DAYS,
        direction: DateDirections.FUTURE
      }

      const listItemRefConditionData: ConditionListItemRefValueDataV2 = {
        listId: '14ec8ab5-05a0-4b00-b866-d40146077d7a',
        itemId: 'a9dd35af-187e-4027-b8b1-e58a4aab3a82'
      }

      const stringValueData: ConditionDataV2 = {
        id: '923086db-02d1-4e80-9d7c-ca1b20101de9',
        componentId: 'd8115721-7b71-4587-8a93-6499d3a3f94c',
        operator: OperatorName.Is,
        type: ConditionType.StringValue,
        value: stringValueConditionData
      }

      const relativeDateData: ConditionDataV2 = {
        id: '43c2fc24-de68-4495-80f8-485bc8e5384b',
        componentId: '91c22b37-75a0-4d59-8879-6b9790e694f7',
        operator: OperatorName.IsLessThan,
        type: ConditionType.RelativeDate,
        value: relativeDateConditionData
      }

      const listItemRefData: ConditionDataV2 = {
        id: '8a85e45a-c577-4748-a095-3a86d782b336',
        componentId: '69272c34-5acb-42cd-b9fe-38ad58e3a524',
        operator: OperatorName.Is,
        type: ConditionType.ListItemRef,
        value: listItemRefConditionData
      }

      const stringValueCondition: ConditionWrapperV2 = {
        id: 'ab1bbaae-bf0e-4577-8416-8a8c83da1fb9',
        displayName: 'isFullNameEnriqueChase',
        items: [stringValueData]
      }

      const relativeDateCondition: ConditionWrapperV2 = {
        id: '193a413b-65d3-42bd-bddb-d02ca100c749',
        displayName: 'isDueDateWithin7Days',
        items: [relativeDateData]
      }

      const listItemRefCondition: ConditionWrapperV2 = {
        id: '7baf03ce-e0d8-47a5-9010-fbe461031399',
        displayName: 'isFaveColourRed',
        items: [listItemRefData]
      }

      const fullNameConditionRefData: ConditionRefDataV2 = {
        id: 'a436ef0b-15f3-432b-9219-e16f309a6502',
        conditionId: stringValueCondition.id
      }

      const faveColourRefData: ConditionRefDataV2 = {
        id: 'a1903a7e-6fd0-499a-92ce-aa9f4b75b103',
        conditionId: listItemRefCondition.id
      }

      const conditionRefCondition: ConditionWrapperV2 = {
        id: 'dc1e112f-2855-42d0-830c-bd5d2332975c',
        displayName: 'isEnriqueChaseAndFaveColourRed',
        coordinator: Coordinator.AND,
        items: [fullNameConditionRefData, faveColourRefData]
      }

      const list: List = {
        id: '14ec8ab5-05a0-4b00-b866-d40146077d7a',
        items: [
          {
            id: 'a9dd35af-187e-4027-b8b1-e58a4aab3a82',
            text: 'Red',
            value: 'red'
          },
          {
            text: 'Blue',
            value: 'blue',
            hint: { text: 'a hint' }
          }
        ],
        name: 'ADxeWa',
        title: 'Colours',
        type: 'string'
      }
      const list2: List = {
        items: [],
        name: 'ADxeWb',
        title: 'String List 2',
        type: 'string'
      }

      const definition: FormDefinition = {
        conditions: [
          stringValueCondition,
          relativeDateCondition,
          listItemRefCondition,
          conditionRefCondition
        ],
        lists: [list, list2],
        pages: [page, page2, pageSummary],
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
                },
                {
                  ...component3,
                  id: expect.any(String)
                },
                {
                  ...component4,
                  id: expect.any(String)
                }
              ]
            },
            {
              ...page2,
              id: expect.any(String)
            },
            {
              ...pageSummary,
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

      it('should reject if there are duplicate list ids', () => {
        const validated = formDefinitionV2Schema.validate({
          ...definition,
          lists: [
            {
              ...list
            },
            {
              items: [],
              name: 'ADxeWb',
              title: 'String List',
              type: 'string',
              id: '14ec8ab5-05a0-4b00-b866-d40146077d7a'
            }
          ]
        })

        expect(validated.error).toEqual(
          new ValidationError('"lists[1]" contains a duplicate value', [], {})
        )
      })

      it('should reject if one outputs email is badly configured', () => {
        const validated = formDefinitionV2Schema.validate({
          ...definition,
          lists: [list],
          outputs: [
            { emailAddress: 'bad-email', audience: 'human', version: '1' }
          ]
        })

        expect(validated.error).toEqual(
          new ValidationError(
            '"outputs[0].emailAddress" must be a valid email',
            [],
            {}
          )
        )
      })

      it('should allow many outputs configured', () => {
        const validated = formDefinitionV2Schema.validate({
          ...definition,
          lists: [list],
          outputs: [
            {
              emailAddress: 'good-email1@test.co.uk',
              audience: 'human',
              version: '1'
            },
            {
              emailAddress: 'good-email2@test.co.uk',
              audience: 'machine',
              version: '1'
            },
            {
              emailAddress: 'good-email3@test.co.uk',
              audience: 'machine',
              version: '2'
            }
          ]
        })

        expect(validated.error).toBeUndefined()
      })

      it('should reject if question type does not support conditions', () => {
        const definitionWithBadCondition = structuredClone({
          ...definition,
          name: 'test form'
        })
        const pageWithCond = definitionWithBadCondition.pages[0] as PageQuestion
        pageWithCond.components[3].type = ComponentType.UkAddressField
        const validated = formDefinitionV2Schema.validate(
          definitionWithBadCondition
        )

        expect(validated.error).toEqual(
          new ValidationError('Incompatible data value', [], {})
        )
      })

      it('should fail validation when conditional integrity on items within list is lost', () => {
        const definition1 = buildDefinition({
          name: 'Conditional Reference Check',
          startPage: '/summary',
          pages: [
            buildQuestionPage({
              title: '',
              path: '/which-option',
              components: [
                buildRadioComponent({
                  title: 'Which option?',
                  name: 'YJBELu',
                  shortDescription: 'test question',
                  list: 'a0edad95-8fd2-4755-b0aa-459b8e568bc9',
                  options: {
                    required: true
                  },
                  id: '921d7b38-39da-475c-94de-ee40651fd9fb'
                })
              ],
              id: '3eb4ed6e-d6d2-4e4d-a706-9f004ba1f0d3'
            }),
            buildQuestionPage({
              title: '',
              path: '/which-second-option',
              components: [
                buildRadioComponent({
                  title: 'Which second option?',
                  name: 'amkCpy',
                  shortDescription: 'Which second option?',
                  options: {
                    required: true
                  },
                  list: '58dfa64d-7b14-4b48-b8b1-48128ecf1f60',
                  id: 'ad9af40f-3b97-44ed-9f4e-ac855c4b8cbc'
                })
              ],
              id: 'c875cb03-0005-4a18-8b29-07c01ad2845a'
            }),
            buildTerminalPage({
              title: 'Exit page',
              path: '/exit-page',
              components: [
                buildMarkdownComponent({
                  content: 'adfadfdf',
                  name: 'UJSPTf',
                  id: '84f21209-fcd9-42e7-9386-6e335f37aabe'
                })
              ],
              id: '2d643436-0970-437c-afb6-37b10c57db49',
              condition: '746d6cdb-1d37-4d22-a10e-84ee92de3857'
            }),
            buildSummaryPage({
              id: '449a45f6-4541-4a46-91bd-8b8931b07b50',
              title: 'Summary',
              path: '/summary'
            })
          ],
          conditions: [
            {
              items: [
                {
                  id: '747fac5a-59dc-499a-9136-7d8d67309de4',
                  componentId: 'ad9af40f-3b97-44ed-9f4e-ac855c4b8cbc',
                  operator: OperatorName.Is,
                  value: {
                    itemId: 'b3a5030c-57f1-4d2e-8db9-6adeeba43c07',
                    listId: '58dfa64d-7b14-4b48-b8b1-48128ecf1f60'
                  },
                  type: ConditionType.ListItemRef
                }
              ],
              displayName: 'fourth option',
              id: '746d6cdb-1d37-4d22-a10e-84ee92de3857'
            }
          ],
          lists: [
            buildList({
              name: 'sGxjdK',
              title: 'List for question YJBELu',
              type: 'string',
              items: [
                buildListItem({
                  id: '1c1f88e8-ca26-4dd4-83d9-4af98637a13f',
                  text: 'Option 1',
                  value: 'Option 1'
                }),
                buildListItem({
                  id: '688a6a38-632a-4da4-95ae-245c60c67d1c',
                  text: 'Option 2',
                  value: 'Option 2'
                }),
                buildListItem({
                  id: 'd9e1794e-2463-4f12-99c1-974c6880624f',
                  text: 'Option 3',
                  value: 'Option 3'
                }),
                buildListItem({
                  id: 'b3a5030c-57f1-4d2e-8db9-6adeeba43c07',
                  text: 'Option 4',
                  value: 'Option 4'
                })
              ],
              id: 'a0edad95-8fd2-4755-b0aa-459b8e568bc9'
            }),
            buildList({
              name: 'dNYuPT',
              title: 'List for question amkCpy',
              type: 'string',
              items: [
                buildListItem({
                  id: 'f98db97a-527b-408e-889e-1efff3e6d545',
                  text: 'Option 4',
                  value: 'Option 4'
                }),
                buildListItem({
                  id: '7914c48b-5a62-42bb-b63e-54209c459b57',
                  text: 'Option 5',
                  value: 'Option 5'
                }),
                buildListItem({
                  id: '5b615f6b-4895-4833-845a-e1fcf8eff8f0',
                  text: 'Option 6',
                  value: 'Option 6'
                }),
                buildListItem({
                  id: '288122a9-ca33-4533-b79e-a347ac2e484e',
                  text: 'Option 7',
                  value: 'Option 7'
                })
              ],
              id: '58dfa64d-7b14-4b48-b8b1-48128ecf1f60'
            })
          ]
        })

        const { error } = formDefinitionV2Schema.validate(definition1)
        expect(error).toBeDefined()
      })
    })
  })

  describe('Page level validation', () => {
    it('should allow normal page', () => {
      const page = buildRepeaterPage({
        components: [buildTextFieldComponent()]
      })
      const result = pageSchema.validate(page, { abortEarly: false })
      const result2 = pageSchemaV2.validate(page, { abortEarly: false })
      expect(result.error).toBeUndefined()
      expect(result2.error).toBeUndefined()
    })

    describe('Upload rules', () => {
      it('should allow single content field with FileUploadPage', () => {
        const component = buildFileUploadComponent()
        const page = buildFileUploadPage({
          components: [component, buildMarkdownComponent({ content: 'test' })]
        })
        const result = pageSchemaV2.validate(page)
        expect(result.error).toBeUndefined()
      })

      it('should allow single content field with FileUploadPage content first', () => {
        const component = buildFileUploadComponent()
        const page = buildFileUploadPage({
          components: [buildMarkdownComponent({ content: 'test' }), component]
        })
        const result = pageSchemaV2.validate(page)
        expect(result.error).toBeUndefined()
      })

      it('should not allow input fields with FileUploadPage', () => {
        const component = buildFileUploadComponent()
        const page = buildFileUploadPage({
          components: [component, buildTextFieldComponent()]
        })
        const result = pageSchemaV2.validate(page)
        expect(result.error).toBeDefined()
        expect(result.error).toEqual(
          new ValidationError(
            '"components[1]" does not match any of the allowed types',
            [],
            component
          )
        )
      })

      it('should not allow more than two components', () => {
        const component = buildFileUploadComponent()
        const page = buildFileUploadPage({
          components: [
            component,
            buildMarkdownComponent(),
            buildMarkdownComponent({
              id: '1a43443c-e2bb-409a-a9d1-c0d3f4dbed9a',
              name: 'component 3'
            })
          ]
        })
        const result = pageSchemaV2.validate(page)
        expect(result.error).toBeDefined()
        expect(result.error).toEqual(
          new ValidationError(
            '"components[2]" does not match any of the allowed types',
            [],
            component
          )
        )
      })
    })
  })
})
