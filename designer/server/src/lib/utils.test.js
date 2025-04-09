import { ComponentType } from '@defra/forms-model'
import { getTraceId } from '@defra/hapi-tracing'

import {
  buildAutoCompleteComponent,
  buildDefinition,
  buildList,
  buildListItem,
  buildQuestionPage,
  buildRadioComponent,
  buildTextFieldComponent,
  testFormDefinitionWithNoQuestions,
  testFormDefinitionWithTwoPagesAndQuestions
} from '~/src/__stubs__/form-definition.js'
import config from '~/src/config.js'
import {
  findPageUniquelyMappedLists,
  findUniquelyMappedList,
  getComponentFromDefinition,
  getComponentsOnPageFromDefinition,
  getHeaders,
  getListFromComponent,
  mapListToAutoCompleteStr,
  noListToSave
} from '~/src/lib/utils.js'

jest.mock('@defra/hapi-tracing')

const autoCompletePageId = '938d0853-7874-4b46-bd7e-3eeb93413f51'
const questionPageId = '938d0853-7874-4b46-bd7e-3eeb93413f51'
const componentId = 'b96fa4e3-a4dc-4e71-a4b5-86db511dec7a'
const autoCompleteListId = '390ed821-8925-4ab8-9b35-9b6e55d5cac5'
const radioPageId = '6282ee22-5474-4701-b517-f8fdf61c1b3e'
const listName = 'ListName'

const autoCompletePage = buildQuestionPage({
  id: autoCompletePageId,
  title: 'Autocomplete page',
  components: [
    buildAutoCompleteComponent({
      id: componentId,
      list: listName
    })
  ]
})
const questionPage = buildQuestionPage({
  id: questionPageId,
  title: 'Text Field Question Page',
  components: [
    buildTextFieldComponent({
      id: '394bfc81-1994-4c9c-b734-6742dadb22e0'
    })
  ]
})

const radioComponent = buildRadioComponent({
  id: '3382678a-2f3b-437c-997a-a2586eacb671',
  list: listName,
  type: ComponentType.RadiosField
})
const radioPage = buildQuestionPage({
  id: radioPageId,
  title: 'Radio page',
  components: [radioComponent]
})

const list = buildList({
  id: autoCompleteListId,
  name: listName,
  items: [
    buildListItem({ value: 'england', text: 'England' }),
    buildListItem({ value: 'scotland', text: 'Scotland' }),
    buildListItem({ value: 'wales', text: 'Wales' })
  ]
})

describe('utils', () => {
  describe('Header helper functions', () => {
    it('should include the trace id in the headers if available', () => {
      jest.mocked(getTraceId).mockReturnValue('my-trace-id')

      const result = getHeaders('token')
      expect(result).toEqual({
        headers: {
          Authorization: 'Bearer token',
          [config.tracing.header]: 'my-trace-id'
        }
      })
    })

    it('should exclude the trace id in the headers if missing', () => {
      jest.mocked(getTraceId).mockReturnValue(null)

      const result = getHeaders('token')
      expect(result).toEqual({
        headers: {
          Authorization: 'Bearer token'
        }
      })
    })
  })

  describe('getComponentFromDefinition', () => {
    it('should find component when exists', () => {
      const comp = getComponentFromDefinition(
        testFormDefinitionWithTwoPagesAndQuestions,
        'p1',
        'q1'
      )
      expect(comp).toEqual({
        id: 'q1',
        type: ComponentType.TextField,
        name: 'textField',
        title: 'This is your first question',
        hint: 'Help text',
        options: {},
        schema: {}
      })
    })

    it('should return undefined when component not found', () => {
      const comp = getComponentFromDefinition(
        testFormDefinitionWithTwoPagesAndQuestions,
        'p1',
        'qxx'
      )
      expect(comp).toBeUndefined()
    })

    it('should return undefined when page not found', () => {
      const comp = getComponentFromDefinition(
        testFormDefinitionWithTwoPagesAndQuestions,
        'p1xx',
        'q1'
      )
      expect(comp).toBeUndefined()
    })
  })

  describe('getComponentsOnPageFromDefinition', () => {
    it('should find all components of a page when exists', () => {
      const comps = getComponentsOnPageFromDefinition(
        testFormDefinitionWithTwoPagesAndQuestions,
        'p1'
      )
      expect(comps).toEqual([
        {
          id: 'q1',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first question',
          hint: 'Help text',
          options: {},
          schema: {}
        },
        {
          id: 'q2',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your second question',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ])
    })

    it('should return empty array if page has no components', () => {
      const comps = getComponentsOnPageFromDefinition(
        testFormDefinitionWithNoQuestions,
        'p1'
      )
      expect(comps).toHaveLength(0)
    })

    it('should return undefined when page not found', () => {
      const comp = getComponentFromDefinition(
        testFormDefinitionWithTwoPagesAndQuestions,
        'p1xx',
        'q1'
      )
      expect(comp).toBeUndefined()
    })
  })

  describe('getListFromComponent', () => {
    it('should return list when found', () => {
      const list = buildList({
        id: '4d35e5ec-7681-422b-92eb-65c49f1458b6',
        name: 'AbCdEFg'
      })
      const autoCompleteComponent = buildAutoCompleteComponent({
        id: 'af1ed4f1-ef37-4e35-a5da-210f9e5fc336',
        list: list.name
      })
      const page = buildQuestionPage({
        components: [autoCompleteComponent]
      })
      const definition = buildDefinition({
        pages: [page],
        lists: [list]
      })
      const foundList = getListFromComponent(autoCompleteComponent, definition)
      expect(foundList).toEqual(list)
    })

    it('should return undefined when not found', () => {
      const textFieldComponent = buildTextFieldComponent()
      const page = buildQuestionPage({
        components: [textFieldComponent]
      })
      const definition = buildDefinition({
        pages: [page]
      })
      const foundList = getListFromComponent(textFieldComponent, definition)
      expect(foundList).toBeUndefined()
    })

    it('should return undefined component is undefined', () => {
      expect(getListFromComponent(undefined, buildDefinition())).toBeUndefined()
    })
  })

  describe('mapListToAutoCompleteStr', () => {
    it('should map a list to an autocomplete string', () => {
      const list = buildList({
        items: [
          buildListItem({
            text: 'JavaScript',
            value: 'javascript'
          }),
          buildListItem({
            text: 'TypeScript',
            value: 'typescript'
          }),
          buildListItem({
            text: 'Haskell',
            value: 'haskell'
          })
        ]
      })
      expect(mapListToAutoCompleteStr(list)).toEqual(
        'JavaScript:javascript\r\n' +
          'TypeScript:typescript\r\n' +
          'Haskell:haskell'
      )
    })

    it('should return an empty string for undefined', () => {
      expect(mapListToAutoCompleteStr(undefined)).toBe('')
    })
  })

  describe('noListToSave', () => {
    it('should return true if not a list component', () => {
      expect(noListToSave(undefined, undefined)).toBeTruthy()
    })

    it('should return true if a list component but no list items', () => {
      expect(
        noListToSave(ComponentType.AutocompleteField, undefined)
      ).toBeTruthy()
      expect(noListToSave(ComponentType.RadiosField, undefined)).toBeTruthy()
      expect(
        noListToSave(ComponentType.CheckboxesField, undefined)
      ).toBeTruthy()
    })

    it('should return false if a list component with list items', () => {
      const someListItems = { listItems: [] }
      expect(
        noListToSave(ComponentType.AutocompleteField, someListItems)
      ).toBeFalsy()
      expect(noListToSave(ComponentType.RadiosField, someListItems)).toBeFalsy()
      expect(
        noListToSave(ComponentType.CheckboxesField, someListItems)
      ).toBeFalsy()
    })
  })

  describe('findUniquelyMappedList', () => {
    it('should return list id if list is orphaned', () => {
      const definition = buildDefinition({
        pages: [autoCompletePage],
        lists: [list]
      })

      expect(
        findUniquelyMappedList(definition, autoCompletePageId, componentId)
      ).toBe(autoCompleteListId)
    })

    it('should return undefined if list is not orphaned', () => {
      const definition = buildDefinition({
        pages: [autoCompletePage, radioPage],
        lists: [list]
      })
      expect(
        findUniquelyMappedList(definition, autoCompletePageId, componentId)
      ).toBeUndefined()
    })

    it('should return undefined if page has no list', () => {
      const definition = buildDefinition({
        pages: [questionPage]
      })
      expect(
        findUniquelyMappedList(definition, questionPageId, componentId)
      ).toBeUndefined()
    })

    it('should return undefined if component does not exist', () => {
      const definition = buildDefinition({
        pages: [autoCompletePage]
      })
      expect(
        findUniquelyMappedList(definition, autoCompletePageId, questionPageId)
      ).toBeUndefined()
    })
  })
  describe('findPageUniquelyMappedLists', () => {
    const radioList2Id = '366942ab-640b-4d2e-8637-a6c1f1001d9a'
    const radioPage2Id = '55c220b1-bfda-48ff-9297-504721be919c'
    const radioList2Name = 'RadioList2'
    const radioList2 = buildList({
      id: radioList2Id,
      name: radioList2Name
    })
    const radioComponent2Id = 'fb612bb3-1442-41c8-b36f-8ab210f9b24c'
    const radioCompnent2 = buildRadioComponent({
      id: radioComponent2Id,
      list: radioList2Name
    })
    const radioPage2 = buildQuestionPage({
      ...radioPage,
      id: radioPage2Id,
      components: [radioComponent, radioCompnent2]
    })
    it('should return an array of list ids', () => {
      const definition = buildDefinition({
        pages: [autoCompletePage, radioPage, radioPage2],
        lists: [list, radioList2]
      })
      expect(findPageUniquelyMappedLists(definition, radioPage2Id)).toEqual([
        radioList2Id
      ])
    })

    it('should return empty list if lists are not orphaned', () => {
      const definition = buildDefinition({
        pages: [autoCompletePage, radioPage],
        lists: [list]
      })
      expect(findPageUniquelyMappedLists(definition, radioPageId)).toEqual([])
    })

    it('should return empty list if page does not exist', () => {
      expect(
        findPageUniquelyMappedLists(
          buildDefinition(),
          'e36fdaad-1395-4efe-bfec-ceae7efaf8e3'
        )
      ).toEqual([])
    })
  })
})
