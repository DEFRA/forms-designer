import { ComponentType } from '~/src/components/enums.js'
import {
  type DatePartsFieldComponent,
  type NumberFieldComponent,
  type RadiosFieldComponent,
  type TextFieldComponent
} from '~/src/components/types.js'
import {
  ConditionType,
  Coordinator,
  DateDirections,
  DateUnits,
  OperatorName
} from '~/src/conditions/enums.js'
import { convertConditionWrapperFromV2 } from '~/src/conditions/migration.js'
import { type FormDefinition, type List, type PageQuestion, type PageSummary } from '~/src/form/form-definition/types.js'
import { ControllerPath, ControllerType } from '~/src/pages/enums.js'


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

const buildTextFieldComponent = (
  partialComponent: Partial<TextFieldComponent>
): TextFieldComponent => {
  return {
    name: 'abcdef',
    title: 'Default title',
    options: {},
    schema: {},
    ...partialComponent,
    type: ComponentType.TextField
  }
}

const buildDateComponent = (
  partialComponent: Partial<DatePartsFieldComponent>
): DatePartsFieldComponent => {
  return {
    name: 'bcdefg',
    title: 'Default title',
    options: {},
    ...partialComponent,
    type: ComponentType.DatePartsField
  }
}

const buildRadiosComponent = (
  partialComponent: Partial<RadiosFieldComponent>
): RadiosFieldComponent => {
  return {
    name: 'cdefgh',
    title: 'Default title',
    options: {},
    list: 'Default list Id ref',
    ...partialComponent,
    type: ComponentType.RadiosField
  }
}

describe('Migration', () => {
  test('can convert condition wrapper from V2', () => {
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

      const stringValueConditionData: ConditionStringValueDataV2 = {
        type: ConditionType.StringValue,
        value: 'Enrique Chase'
      }

      const relativeDateConditionData: RelativeDateValueData = {
        type: ConditionType.RelativeDate,
        period: '7',
        unit: DateUnits.DAYS,
        direction: DateDirections.FUTURE
      }

      const listItemRefConditionData: ConditionListItemRefValueDataV2 = {
        type: ConditionType.ListItemRef,
        listId: '14ec8ab5-05a0-4b00-b866-d40146077d7a',
        itemId: 'a9dd35af-187e-4027-b8b1-e58a4aab3a82'
      }

      const stringValueData: ConditionDataV2 = {
        id: '923086db-02d1-4e80-9d7c-ca1b20101de9',
        componentId: 'd8115721-7b71-4587-8a93-6499d3a3f94c',
        operator: OperatorName.Is,
        value: stringValueConditionData
      }

      const relativeDateData: ConditionDataV2 = {
        id: '43c2fc24-de68-4495-80f8-485bc8e5384b',
        componentId: '91c22b37-75a0-4d59-8879-6b9790e694f7',
        operator: OperatorName.IsLessThan,
        value: relativeDateConditionData
      }

      const listItemRefData: ConditionDataV2 = {
        id: '8a85e45a-c577-4748-a095-3a86d782b336',
        componentId: '69272c34-5acb-42cd-b9fe-38ad58e3a524',
        operator: OperatorName.Is,
        value: listItemRefConditionData
      }

      const stringValueCondition: ConditionWrapperV2 = {
        name: 'ab1bbaae-bf0e-4577-8416-8a8c83da1fb9',
        displayName: 'isFullNameEnriqueChase',
        conditions: [stringValueData]
      }

      const relativeDateCondition: ConditionWrapperV2 = {
        name: '193a413b-65d3-42bd-bddb-d02ca100c749',
        displayName: 'isDueDateWithin7Days',
        conditions: [relativeDateData]
      }

      const listItemRefCondition: ConditionWrapperV2 = {
        name: '7baf03ce-e0d8-47a5-9010-fbe461031399',
        displayName: 'isFaveColourRed',
        conditions: [listItemRefData]
      }

      const fullNameConditionRefData: ConditionRefDataV2 = {
        id: 'a436ef0b-15f3-432b-9219-e16f309a6502',
        conditionId: stringValueCondition.name
      }

      const faveColourRefData: ConditionRefDataV2 = {
        id: 'a1903a7e-6fd0-499a-92ce-aa9f4b75b103',
        conditionId: listItemRefCondition.name
      }

      const conditionRefCondition: ConditionWrapperV2 = {
        name: 'dc1e112f-2855-42d0-830c-bd5d2332975c',
        displayName: 'isEnriqueChaseAndFaveColourRed',
        coordinator: Coordinator.AND,
        conditions: [fullNameConditionRefData, faveColourRefData]
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

    const wrapper = convertConditionWrapperFromV2(wrapperV2, model)
    // expect(wrapper).toBe(true)
  })
})
