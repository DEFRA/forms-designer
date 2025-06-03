import { ComponentType } from '@defra/forms-model'
import { getTraceId } from '@defra/hapi-tracing'

import {
  buildAutoCompleteComponent,
  buildDefinition,
  buildList,
  buildListItem,
  buildQuestionPage,
  buildTextFieldComponent,
  testFormDefinitionWithNoQuestions,
  testFormDefinitionWithTwoPagesAndQuestions
} from '~/src/__stubs__/form-definition.js'
import { uniquelyMappedListsStubs } from '~/src/__stubs__/list.js'
import config from '~/src/config.js'
import {
  createRuntimeFormModel,
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

const listStubs = uniquelyMappedListsStubs()

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
        list: list.id
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

    it('should return undefined when component references non-existent list', () => {
      const autoCompleteComponent = buildAutoCompleteComponent({
        id: 'af1ed4f1-ef37-4e35-a5da-210f9e5fc336',
        list: 'NonExistentList'
      })
      const page = buildQuestionPage({
        components: [autoCompleteComponent]
      })
      const definition = buildDefinition({
        pages: [page],
        lists: [] // No lists in definition
      })
      const foundList = getListFromComponent(autoCompleteComponent, definition)
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
      const { definition, pageId, componentId, listId } =
        listStubs.orphanedListOnComponent

      expect(findUniquelyMappedList(definition, pageId, componentId)).toBe(
        listId
      )
    })

    it('should return undefined if list is not orphaned', () => {
      const { definition, componentId, pageId } =
        listStubs.nonOrphanedListOnComponent

      expect(
        findUniquelyMappedList(definition, pageId, componentId)
      ).toBeUndefined()
    })

    it('should return undefined if page has no list', () => {
      const { definition, pageId, componentId } = listStubs.noListOnPage
      expect(
        findUniquelyMappedList(definition, pageId, componentId)
      ).toBeUndefined()
    })

    it('should return undefined if component does not exist', () => {
      const { definition, pageId } = listStubs.orphanedListOnComponent
      expect(
        findUniquelyMappedList(definition, pageId, listStubs.questionPageId)
      ).toBeUndefined()
    })
  })

  describe('findPageUniquelyMappedLists', () => {
    it('should return an array of list ids', () => {
      const { definition, pageId, listId } = listStubs.pageWithUniqueMappedList
      expect(findPageUniquelyMappedLists(definition, pageId)).toEqual([listId])
    })

    it('should return empty list if lists are not orphaned', () => {
      const { definition, pageId } = listStubs.pageWithNonUniquelyMappedList

      expect(findPageUniquelyMappedLists(definition, pageId)).toEqual([])
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

  describe('createRuntimeFormModel', () => {
    const list = buildList({
      id: 'test-list-id',
      name: 'TestList'
    })
    const component = buildTextFieldComponent({
      id: 'test-component-id'
    })
    const page = buildQuestionPage({
      components: [component]
    })
    const definition = buildDefinition({
      pages: [page],
      lists: [list],
      conditions: []
    })

    it('should return runtime model with getListById accessor', () => {
      const runtimeModel = createRuntimeFormModel(definition)

      expect(runtimeModel.getListById('test-list-id')).toEqual(list)
    })

    it('should return undefined when list not found by id', () => {
      const runtimeModel = createRuntimeFormModel(definition)

      expect(runtimeModel.getListById('non-existent-id')).toBeUndefined()
    })

    it('should return runtime model with getComponentById accessor', () => {
      const runtimeModel = createRuntimeFormModel(definition)

      expect(runtimeModel.getComponentById('test-component-id')).toEqual(
        component
      )
    })

    it('should return undefined when component not found by id', () => {
      const runtimeModel = createRuntimeFormModel(definition)

      expect(runtimeModel.getComponentById('non-existent-id')).toBeUndefined()
    })

    it('should return runtime model with getConditionById accessor', () => {
      const runtimeModel = createRuntimeFormModel(definition)

      expect(
        runtimeModel.getConditionById('non-existent-condition')
      ).toBeUndefined()
    })
  })
})
