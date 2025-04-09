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
import config from '~/src/config.js'
import {
  getComponentFromDefinition,
  getComponentsOnPageFromDefinition,
  getHeaders,
  getListFromComponent,
  mapListToAutoCompleteStr,
  noListToSave
} from '~/src/lib/utils.js'

jest.mock('@defra/hapi-tracing')

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
})
