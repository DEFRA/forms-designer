import { ComponentType, yesNoListId } from '@defra/forms-model'
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
  findPageUniquelyMappedLists,
  findUniquelyMappedList,
  getComponentFromDefinition,
  getComponentsOnPageFromDefinition,
  getHeaders,
  getListFromComponent,
  mapListToTextareaStr,
  noListToSave,
  sanitiseJSON
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

    it('should return undefined component is undefined', () => {
      expect(getListFromComponent(undefined, buildDefinition())).toBeUndefined()
    })

    it('should return yes/no list', () => {
      const yesNoList = getListFromComponent(
        /** @type {ComponentDef} */ ({ type: ComponentType.YesNoField }),
        buildDefinition()
      )
      expect(yesNoList?.id).toBe(yesNoListId)
    })
  })

  describe('mapListToTextareaStr', () => {
    it('should map a list to an autocomplete string', () => {
      const list = buildList({
        items: [
          buildListItem({
            text: 'Javascript',
            value: 'javascript'
          }),
          buildListItem({
            text: 'Typescript',
            value: 'typescript'
          }),
          buildListItem({
            text: 'Haskell',
            value: 'haskell'
          })
        ]
      })
      const list2 = buildList({
        items: [
          buildListItem({
            text: 'Javascript',
            value: 'Javascript'
          }),
          buildListItem({
            text: 'Typescript',
            value: 'Typescript'
          }),
          buildListItem({
            text: 'Haskell',
            value: 'Haskell'
          })
        ]
      })
      expect(mapListToTextareaStr(list.items)).toEqual(
        'Javascript:javascript\r\n' +
          'Typescript:typescript\r\n' +
          'Haskell:haskell'
      )
      expect(mapListToTextareaStr(list2.items)).toEqual(
        'Javascript\r\n' + 'Typescript\r\n' + 'Haskell'
      )
    })

    it('should return an empty string for undefined', () => {
      expect(mapListToTextareaStr(undefined)).toBe('')
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

  describe('sanitiseJSON', () => {
    it('should remove HTML tags from JSON objects', () => {
      const dirtyJSON = JSON.stringify({
        text: "<script>alert('xss')</script>"
      })
      expect(sanitiseJSON(dirtyJSON)).toEqual(
        JSON.stringify({ text: "alert('xss')" })
      )
    })
  })
})

/**
 * @import { ComponentDef } from '@defra/forms-model'
 */
