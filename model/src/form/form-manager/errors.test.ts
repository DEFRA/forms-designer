import { type ErrorReport } from 'joi'

import { ConditionType, OperatorName } from '~/src/conditions/enums.js'
import * as schema from '~/src/form/form-definition/index.js'
import { checkErrors, getErrors } from '~/src/form/form-manager/errors.js'
import {
  FormDefinitionError,
  FormDefinitionErrorType
} from '~/src/form/form-manager/types.js'
import {
  buildDefinition,
  buildList,
  buildListItem,
  buildQuestionPage,
  buildRadioComponent,
  buildTextFieldComponent,
  buildUkAddressFieldComponent
} from '~/src/stubs.js'

const formDefinitionV2Schema = schema.formDefinitionV2Schema

const pageId1 = '73cf34ee-f53a-4159-9eef-b0286fd81934'
const pageId2 = '5262b5a2-ace3-4297-9a29-0e100b42e24c'
const componentId1 = '1c61fa1f-a8dc-463c-ade0-13aa7cbf4960'
const componentId2 = 'f2eb65d9-b505-4842-9ec4-520bf0d5b5fb'
const conditionId1 = 'ab1bbaae-bf0e-4577-8416-8a8c83da1fb9'

describe('validation errors', () => {
  describe('unique errors', () => {
    describe('page errors', () => {
      it('should handle unique_page_id', () => {
        const dupePageIdDef = buildDefinition({
          pages: [
            buildQuestionPage({ id: pageId1 }),
            buildQuestionPage({ id: pageId1, path: '/page-two' })
          ]
        })

        const { error } = formDefinitionV2Schema.validate(dupePageIdDef)

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniquePageId,
            detail: { path: ['pages', 1], pos: 1, dupePos: 0 },
            message: '"pages[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })

      it('should handle unique_page_path', () => {
        const dupePagePathDef = buildDefinition({
          pages: [
            buildQuestionPage({ id: pageId1 }),
            buildQuestionPage({ id: pageId2 })
          ]
        })

        const { error } = formDefinitionV2Schema.validate(dupePagePathDef)

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniquePagePath,
            detail: { path: ['pages', 1], pos: 1, dupePos: 0 },
            message: '"pages[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })
    })

    describe('page component errors', () => {
      it('should handle unique_page_component_id', () => {
        const component1 = buildTextFieldComponent({
          id: componentId1,
          name: 'abcdef'
        })
        const component2 = buildTextFieldComponent({
          id: componentId1,
          name: 'ghijkl'
        })

        const dupePageComponentIdDef = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId1,
              components: [component1, component2]
            })
          ]
        })

        const { error } = formDefinitionV2Schema.validate(
          dupePageComponentIdDef
        )

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniquePageComponentId,
            detail: { path: ['pages', 0, 'components', 1], pos: 1, dupePos: 0 },
            message: '"pages[0].components[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })

      it('should handle unique_page_component_name', () => {
        const component1 = buildTextFieldComponent({
          id: componentId1,
          name: 'abcdef'
        })
        const component2 = buildTextFieldComponent({
          id: componentId2,
          name: 'abcdef'
        })

        const dupePageComponentNameDef = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId1,
              components: [component1, component2]
            })
          ]
        })

        const { error } = formDefinitionV2Schema.validate(
          dupePageComponentNameDef
        )

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniquePageComponentName,
            detail: { path: ['pages', 0, 'components', 1], pos: 1, dupePos: 0 },
            message: '"pages[0].components[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })
    })

    describe('section errors', () => {
      const sectionName1 = 'abcdef'
      const sectionName2 = 'ghijkl'
      const sectionTitle1 = 'Section 1'
      const sectionTitle2 = 'Section 2'

      it('should handle unique_section_name', () => {
        const dupeSectionNameDef = buildDefinition({
          sections: [
            { name: sectionName1, title: sectionTitle1 },
            { name: sectionName1, title: sectionTitle2 }
          ]
        })

        const { error } = formDefinitionV2Schema.validate(dupeSectionNameDef)

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniqueSectionName,
            detail: { path: ['sections', 1], pos: 1, dupePos: 0 },
            message: '"sections[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })

      it('should handle unique_section_title', () => {
        const dupeSectionTitleDef = buildDefinition({
          sections: [
            { name: sectionName1, title: sectionTitle1 },
            { name: sectionName2, title: sectionTitle1 }
          ]
        })

        const { error } = formDefinitionV2Schema.validate(dupeSectionTitleDef)

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniqueSectionTitle,
            detail: { path: ['sections', 1], pos: 1, dupePos: 0 },
            message: '"sections[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })
    })

    describe('condition errors', () => {
      const conditionId2 = '2bbd7df2-c4d9-4d19-a87c-557db1beea7c'

      it('should handle unique_condition_id', () => {
        /** @type {ConditionDataV2} */
        const stringValueData = {
          id: '923086db-02d1-4e80-9d7c-ca1b20101de9',
          componentId: componentId1,
          operator: OperatorName.Is,
          type: ConditionType.StringValue,
          value: 'Enrique Chase'
        }

        /** @type {ConditionWrapperV2} */
        const stringValueCondition = {
          id: conditionId1,
          displayName: 'isFullNameEnriqueChase',
          items: [stringValueData]
        }

        const dupeConditionIdDef = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId1,
              components: [
                buildTextFieldComponent({
                  id: componentId1
                })
              ]
            })
          ],
          conditions: [stringValueCondition, stringValueCondition]
        })

        const { error } = formDefinitionV2Schema.validate(dupeConditionIdDef)

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniqueConditionId,
            detail: { path: ['conditions', 1], pos: 1, dupePos: 0 },
            message: '"conditions[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })

      it('should handle unique_condition_displayname', () => {
        /** @type {ConditionDataV2} */
        const stringValueData = {
          id: '923086db-02d1-4e80-9d7c-ca1b20101de9',
          componentId: componentId1,
          operator: OperatorName.Is,
          type: ConditionType.StringValue,
          value: 'Enrique Chase'
        }

        /** @type {ConditionWrapperV2} */
        const stringValueCondition1 = {
          id: conditionId1,
          displayName: 'isFullNameEnriqueChase',
          items: [stringValueData]
        }

        /** @type {ConditionWrapperV2} */
        const stringValueCondition2 = {
          id: conditionId2,
          displayName: 'isFullNameEnriqueChase',
          items: [stringValueData]
        }

        const dupeConditionDisplayNameDef = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId1,
              components: [
                buildTextFieldComponent({
                  id: componentId1
                })
              ]
            })
          ],
          conditions: [stringValueCondition1, stringValueCondition2]
        })

        const { error } = formDefinitionV2Schema.validate(
          dupeConditionDisplayNameDef
        )

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniqueConditionDisplayName,
            detail: { path: ['conditions', 1], pos: 1, dupePos: 0 },
            message: '"conditions[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })
    })

    describe('list errors', () => {
      const listId1 = 'c7b5864b-1e75-463b-b035-a4d3f7cff8ec'
      const listId2 = 'c1365859-c3eb-401d-98dc-b5f69af5092c'
      const listName1 = 'abcdef'
      const listName2 = 'ghijkl'
      const listTitle1 = 'Title 1'
      const listTitle2 = 'Title 2'

      it('should handle unique_list_id', () => {
        const dupeListIdDef = buildDefinition({
          lists: [
            buildList({ id: listId1, name: listName1, title: listTitle1 }),
            buildList({ id: listId1, name: listName2, title: listTitle2 })
          ]
        })

        const { error } = formDefinitionV2Schema.validate(dupeListIdDef)

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniqueListId,
            detail: { path: ['lists', 1], pos: 1, dupePos: 0 },
            message: '"lists[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })

      it('should handle unique_list_name', () => {
        const dupeListNameDef = buildDefinition({
          lists: [
            buildList({ id: listId1, name: listName1, title: listTitle1 }),
            buildList({ id: listId2, name: listName1, title: listTitle2 })
          ]
        })

        const { error } = formDefinitionV2Schema.validate(dupeListNameDef)

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniqueListName,
            detail: { path: ['lists', 1], pos: 1, dupePos: 0 },
            message: '"lists[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })

      it('should handle unique_list_title', () => {
        const dupeListTitleDef = buildDefinition({
          lists: [
            buildList({ id: listId1, name: listName1, title: listTitle1 }),
            buildList({ id: listId2, name: listName2, title: listTitle1 })
          ]
        })

        const { error } = formDefinitionV2Schema.validate(dupeListTitleDef)

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniqueListTitle,
            detail: { path: ['lists', 1], pos: 1, dupePos: 0 },
            message: '"lists[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })
    })

    describe('list item errors', () => {
      const listItemId1 = 'c7b5864b-1e75-463b-b035-a4d3f7cff8ec'
      const listItemId2 = 'c1365859-c3eb-401d-98dc-b5f69af5092c'
      const listItemText1 = 'Text 1'
      const listItemText2 = 'Text 2'
      const listItemValue1 = 'Value 1'
      const listItemValue2 = 'Value 2'

      it('should handle unique_list_item_id', () => {
        const dupeListItemIdDef = buildDefinition({
          lists: [
            buildList({
              items: [
                { id: listItemId1, text: listItemText1, value: listItemValue1 },
                { id: listItemId1, text: listItemText2, value: listItemValue2 }
              ]
            })
          ]
        })

        const { error } = formDefinitionV2Schema.validate(dupeListItemIdDef)

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniqueListItemId,
            detail: { path: ['lists', 0, 'items', 1], pos: 1, dupePos: 0 },
            message: '"lists[0].items[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })

      it('should handle unique_list_item_text', () => {
        const dupeListItemTextDef = buildDefinition({
          lists: [
            buildList({
              items: [
                { id: listItemId1, text: listItemText1, value: listItemValue1 },
                { id: listItemId2, text: listItemText1, value: listItemValue2 }
              ]
            })
          ]
        })

        const { error } = formDefinitionV2Schema.validate(dupeListItemTextDef)

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniqueListItemText,
            detail: { path: ['lists', 0, 'items', 1], pos: 1, dupePos: 0 },
            message: '"lists[0].items[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })

      it('should handle unique_list_item_value', () => {
        const dupeListItemValueDef = buildDefinition({
          lists: [
            buildList({
              items: [
                { id: listItemId1, text: listItemText1, value: listItemValue1 },
                { id: listItemId2, text: listItemText2, value: listItemValue1 }
              ]
            })
          ]
        })

        const { error } = formDefinitionV2Schema.validate(dupeListItemValueDef)

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.UniqueListItemValue,
            detail: { path: ['lists', 0, 'items', 1], pos: 1, dupePos: 0 },
            message: '"lists[0].items[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ])
      })
    })
  })

  describe('ref errors', () => {
    describe('page errors', () => {
      it('should handle ref_page_condition', () => {
        const invalidConditionId = '1f259e9f-af77-4dbe-a072-7a216f728e19'
        const refPageConditionDefinition = buildDefinition({
          pages: [
            buildQuestionPage({ id: pageId1, condition: invalidConditionId })
          ]
        })

        const { error } = formDefinitionV2Schema.validate(
          refPageConditionDefinition
        )

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.RefPageCondition,
            detail: { path: ['pages', 0, 'condition'] },
            message: '"pages[0].condition" must be [ref:root:conditions]',
            type: FormDefinitionErrorType.Ref
          }
        ])
      })
    })

    describe('condition errors', () => {
      it('should handle ref_condition_component_id', () => {
        /** @type {ConditionDataV2} */
        const stringValueData = {
          id: '923086db-02d1-4e80-9d7c-ca1b20101de9',
          componentId: componentId1,
          operator: OperatorName.Is,
          type: ConditionType.StringValue,
          value: 'Enrique Chase'
        }

        /** @type {ConditionWrapperV2} */
        const stringValueCondition = {
          id: conditionId1,
          displayName: 'isFullNameEnriqueChase',
          items: [stringValueData]
        }

        // Condition references a component that doesn't exist
        const refConditionComponentIdDefinition = buildDefinition({
          pages: [buildQuestionPage({ id: pageId1 })],
          conditions: [stringValueCondition]
        })

        const { error } = formDefinitionV2Schema.validate(
          refConditionComponentIdDefinition
        )

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.RefConditionComponentId,
            detail: { path: ['conditions', 0, 'items', 0, 'componentId'] },
            message:
              '"conditions[0].items[0].componentId" must be [ref:root:pages]',
            type: FormDefinitionErrorType.Ref
          }
        ])
      })

      it('should handle ref_condition_list_id', () => {
        const invalidListId = 'f1281c75-7fa1-4235-aaa2-360c935c4059'
        const invalidItemId = '530c95b5-b78a-4c9c-bd87-6c8ac2c05bd1'

        /** @type {ConditionListItemRefValueDataV2} */
        const listItemRefValueData = {
          listId: invalidListId,
          itemId: invalidItemId
        }

        /** @type {ConditionDataV2} */
        const listItemRefConditionItem = {
          id: '923086db-02d1-4e80-9d7c-ca1b20101de9',
          componentId: componentId1,
          operator: OperatorName.Is,
          type: ConditionType.ListItemRef,
          value: listItemRefValueData
        }

        /** @type {ConditionWrapperV2} */
        const listItemRefCondition = {
          id: conditionId1,
          displayName: 'isJavascript',
          items: [listItemRefConditionItem]
        }

        // Condition references a list that doesn't exist
        const refConditionListIdDefinition = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId1,
              components: [
                buildTextFieldComponent({
                  id: componentId1
                })
              ]
            })
          ],
          conditions: [listItemRefCondition]
        })

        const { error } = formDefinitionV2Schema.validate(
          refConditionListIdDefinition
        )

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.RefConditionListId,
            detail: { path: ['conditions', 0, 'items', 0, 'value', 'listId'] },
            message:
              '"conditions[0].items[0].value.listId" must be [ref:root:lists]',
            type: FormDefinitionErrorType.Ref
          }
        ])
      })

      it('should handle ref_condition_item_id', () => {
        const listId = '5ecb6d1a-acec-4c81-abe8-31bf66e757af'
        const invalidItemId = '530c95b5-b78a-4c9c-bd87-6c8ac2c05bd1'

        /** @type {ConditionListItemRefValueDataV2} */
        const listItemRefValueData = {
          listId,
          itemId: invalidItemId
        }

        /** @type {ConditionDataV2} */
        const listItemRefConditionItem = {
          id: '923086db-02d1-4e80-9d7c-ca1b20101de9',
          componentId: componentId1,
          operator: OperatorName.Is,
          type: ConditionType.ListItemRef,
          value: listItemRefValueData
        }

        /** @type {ConditionWrapperV2} */
        const listItemRefCondition = {
          id: conditionId1,
          displayName: 'isJavascript',
          items: [listItemRefConditionItem]
        }

        // Condition references a list item that doesn't exist
        const refConditionListIdDefinition = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId1,
              components: [
                buildTextFieldComponent({
                  id: componentId1
                })
              ]
            })
          ],
          lists: [
            buildList({
              id: listId,
              items: [
                buildListItem({
                  id: 'c41b069d-eded-4713-9d62-a4e874405d81',
                  text: 'Javascript',
                  value: 'javascript'
                }),
                buildListItem({
                  id: '772f67ac-edb6-4cc3-88b7-8626ecd61f27',
                  text: 'TypeScript',
                  value: 'typescript'
                })
              ]
            })
          ],
          conditions: [listItemRefCondition]
        })

        const { error } = formDefinitionV2Schema.validate(
          refConditionListIdDefinition
        )

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.RefConditionItemId,
            detail: { path: ['conditions', 0, 'items', 0, 'value', 'itemId'] },
            message:
              '"conditions[0].items[0].value.itemId" must be [ref:root:lists]',
            type: FormDefinitionErrorType.Ref
          }
        ])
      })

      it('should handle ref_condition_condition_id', () => {
        const listId = '5ecb6d1a-acec-4c81-abe8-31bf66e757af'
        const itemId1 = 'c41b069d-eded-4713-9d62-a4e874405d81'
        const itemId2 = '772f67ac-edb6-4cc3-88b7-8626ecd61f27'
        const invalidConditionRefId = '339ff648-768a-4778-844f-e0ad9ec88b80'

        /** @type {ConditionListItemRefValueDataV2} */
        const listItemRefValueData = {
          listId,
          itemId: itemId1
        }

        /** @type {ConditionDataV2} */
        const listItemRefConditionItem = {
          id: '923086db-02d1-4e80-9d7c-ca1b20101de9',
          componentId: componentId1,
          operator: OperatorName.Is,
          type: ConditionType.ListItemRef,
          value: listItemRefValueData
        }

        /** @type {ConditionWrapperV2} */
        const listItemRefCondition = {
          id: conditionId1,
          displayName: 'isJavascript',
          items: [listItemRefConditionItem]
        }

        /** @type {ConditionRefDataV2} */
        const conditionRefConditionItem = {
          id: '923086db-02d1-4e80-9d7c-ca1b20101de9',
          conditionId: invalidConditionRefId
        }

        /** @type {ConditionWrapperV2} */
        const conditionRefCondition = {
          id: conditionId1,
          displayName: 'isJavascriptRef',
          items: [conditionRefConditionItem]
        }

        // Condition references another condition that doesn't exist
        const refConditionConditionIdDefinition = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId1,
              components: [
                buildTextFieldComponent({
                  id: componentId1
                })
              ]
            })
          ],
          lists: [
            buildList({
              id: listId,
              items: [
                buildListItem({
                  id: itemId1,
                  text: 'Javascript',
                  value: 'javascript'
                }),
                buildListItem({
                  id: itemId2,
                  text: 'TypeScript',
                  value: 'typescript'
                })
              ]
            })
          ],
          conditions: [listItemRefCondition, conditionRefCondition]
        })

        const { error } = formDefinitionV2Schema.validate(
          refConditionConditionIdDefinition
        )

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.RefConditionConditionId,
            detail: { path: ['conditions', 1, 'items', 0, 'conditionId'] },
            message:
              '"conditions[1].items[0].conditionId" must be [ref:root:conditions]',
            type: FormDefinitionErrorType.Ref
          }
        ])
      })
    })

    describe('page component errors', () => {
      it('should handle ref_page_component_list', () => {
        const invalidListId = '8f3ad4e4-0ba2-45cf-8c36-8103c45a5ced'

        // Page component references a list that doesn't exist
        const refPageComponentListIdDefinition = buildDefinition({
          pages: [
            buildQuestionPage({
              id: pageId1,
              components: [
                buildRadioComponent({
                  list: invalidListId
                })
              ]
            })
          ]
        })

        const { error } = formDefinitionV2Schema.validate(
          refPageComponentListIdDefinition
        )

        expect(error).toBeDefined()

        const errors = getErrors(error)

        expect(errors).toEqual([
          {
            id: FormDefinitionError.RefPageComponentList,
            detail: { path: ['pages', 0, 'components', 0, 'list'] },
            message: '"pages[0].components[0].list" must be [ref:root:lists]',
            type: FormDefinitionErrorType.Ref
          }
        ])
      })
    })
  })

  describe('incompatibility errors', () => {
    const componentId = '7d722018-ea0f-45f7-9843-aacbf2be72ad'
    const component = buildUkAddressFieldComponent({
      id: componentId
    })
    const componentId2 = '33344018-ea0f-45f7-9843-aacbf2be72ad'
    const component2 = buildTextFieldComponent({
      id: componentId2
    })

    it('should handle invalid component type for condition', () => {
      const def = buildDefinition({
        pages: [
          buildQuestionPage({ id: pageId1 }),
          buildQuestionPage({
            id: pageId2,
            path: '/page-two',
            components: [component, component2]
          })
        ],
        conditions: [
          {
            id: '881296f9-d753-4b5b-8b61-6de387787cbd',
            displayName: 'cond1',
            items: [
              {
                id: '11472f07-bae0-4287-b26a-893fdd941603',
                componentId: componentId2,
                operator: OperatorName.Is,
                type: ConditionType.Value,
                value: 'Test'
              },
              {
                id: '29472f07-bae0-4287-b26a-893fdd941603',
                componentId,
                operator: OperatorName.Is,
                type: ConditionType.Value,
                value: 'Test'
              }
            ]
          }
        ]
      })

      const { error } = formDefinitionV2Schema.validate(def)

      expect(error).toBeDefined()

      const errors = getErrors(error)

      expect(errors).toEqual([
        {
          id: FormDefinitionError.IncompatibleConditionComponentType,
          detail: {
            path: ['conditions', 0, 'items', 1],
            key: 1,
            valueKey: 'componentId',
            label: 'conditions[0].items[1]',
            value: componentId,
            incompatibleObject: {
              key: 'type',
              value: {
                id: componentId,
                type: 'UkAddressField',
                name: 'UkAddressFieldComponent',
                title: 'UkAddressFieldComponent',
                options: {},
                schema: {}
              }
            },
            reason: 'does not support conditions'
          },
          message: 'Incompatible data value',
          type: FormDefinitionErrorType.Incompatible
        }
      ])
    })

    it('should handle invalid component type for condition in checkErrors', () => {
      const errors = checkErrors([
        FormDefinitionError.IncompatibleConditionComponentType
      ])

      const errorsToPass = [
        {
          local: {
            key: 'componentId'
          },
          code: 'custom.incompatible'
        }
      ] as ErrorReport[]
      expect(errors(errorsToPass)).toEqual([
        {
          code: 'custom.incompatible',
          local: {
            errorType: 'incompatible',
            errorCode: 'incompatible_condition_component_type',
            key: 'componentId'
          }
        }
      ])
    })
  })
})

/**
 * @import { ConditionWrapperV2, ConditionDataV2, ConditionListItemRefValueDataV2, ConditionRefDataV2 } from '@defra/forms-model'
 */
