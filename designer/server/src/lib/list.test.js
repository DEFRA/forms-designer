import { buildList } from '~/src/__stubs__/form-definition.js'
import {
  baseOptions,
  editor,
  formsEndpoint,
  mockedPostJson,
  mockedPutJson,
  token
} from '~/src/lib/__stubs__/editor.js'
import {
  buildAutoCompleteComponentFromPayload,
  createList,
  updateList
} from '~/src/lib/list.js'

jest.mock('~/src/lib/fetch.js')

describe('list.js', () => {
  const formId = '98dbfb6c-93b7-41dc-86e7-02c7abe4ba38'

  describe('buildAutoCompleteComponentFromPayload', () => {
    it('should build an autocomplete field from the payload', () => {
      const payload = {
        name: 'tzrHYW',
        question: 'What is your first language?',
        questionType: 'AutocompleteField',
        shortDescription: 'your first language',
        hintText: 'Hint Text',
        autoCompleteOptions: [
          { text: 'English', value: 'en-gb' },
          { text: 'German', value: 'de-De' }
        ]
      }

      const expectedAutoCompleteField = {
        name: 'tzrHYW',
        title: 'What is your first language?',
        type: 'AutocompleteField',
        shortDescription: 'your first language',
        hint: 'Hint Text',
        list: 'TEpZOq',
        options: { required: true },
        schema: {}
      }

      expect(buildAutoCompleteComponentFromPayload(payload, 'TEpZOq')).toEqual(
        expectedAutoCompleteField
      )
    })
  })
  describe('createList', () => {
    const requestUrl = new URL(
      `./${formId}/definition/draft/lists`,
      formsEndpoint
    )

    it('should post the new list', async () => {
      const payload = buildList()
      const expectedList = {
        id: '8b10412c-cb4d-46bd-99d4-249bca722b3f',
        list: buildList({
          ...payload,
          id: '8b10412c-cb4d-46bd-99d4-249bca722b3f'
        }),
        status: 'created'
      }
      mockedPostJson.mockResolvedValueOnce({
        response: editor(),
        body: expectedList
      })
      const list = await createList(formId, token, payload)
      expect(list).toEqual(expectedList)

      expect(mockedPostJson).toHaveBeenCalledWith(requestUrl, {
        payload,
        ...baseOptions
      })
    })
  })

  describe('updateList', () => {
    const listId = '8b10412c-cb4d-46bd-99d4-249bca722b3f'
    const requestUrl = new URL(
      `./${formId}/definition/draft/lists/${listId}`,
      formsEndpoint
    )

    it('should post the new list', async () => {
      const payload = buildList({
        id: listId
      })

      const expectedList = {
        id: listId,
        list: buildList({
          ...payload,
          id: listId
        }),
        status: 'created'
      }

      mockedPutJson.mockResolvedValueOnce({
        response: editor(),
        body: expectedList
      })
      const list = await updateList(formId, listId, token, payload)
      expect(list).toEqual(expectedList)

      expect(mockedPutJson).toHaveBeenCalledWith(requestUrl, {
        payload,
        ...baseOptions
      })
    })
  })
})
