import { buildList } from '~/src/__stubs__/form-definition.js'
import {
  baseOptions,
  editor,
  formsEndpoint,
  mockedDelJson,
  mockedPostJson,
  mockedPutJson,
  token
} from '~/src/lib/__stubs__/editor.js'
import { buildAutoCompletePayload } from '~/src/lib/__stubs__/list.js'
import {
  buildAutoCompleteComponentFromPayload,
  buildAutoCompleteListFromPayload,
  createList,
  deleteList,
  updateList
} from '~/src/lib/list.js'

jest.mock('~/src/lib/fetch.js')

describe('list.js', () => {
  const formId = '98dbfb6c-93b7-41dc-86e7-02c7abe4ba38'
  const listId = '8b10412c-cb4d-46bd-99d4-249bca722b3f'
  const basePayload = buildAutoCompletePayload({
    name: 'tzrHYW',
    question: 'What is your first language?',
    questionType: 'AutocompleteField',
    shortDescription: 'your first language',
    hintText: 'Hint Text'
  })

  describe('buildAutoCompleteComponentFromPayload', () => {
    it('should build an autocomplete field from the payload', () => {
      const expectedAutoCompleteField = {
        name: 'tzrHYW',
        title: 'What is your first language?',
        type: 'AutocompleteField',
        shortDescription: 'your first language',
        hint: 'Hint Text',
        list: 'tzrHYW',
        options: { required: true },
        schema: {}
      }

      expect(buildAutoCompleteComponentFromPayload(basePayload)).toEqual(
        expectedAutoCompleteField
      )
    })
  })

  describe('buildAutoCompleteListFromPayload', () => {
    it('should build an autocomplete list from payload', () => {
      const payload = buildAutoCompletePayload({
        ...basePayload,
        autoCompleteOptions: [
          { text: 'English', value: 'en-gb' },
          { text: 'German', value: 'de-De' }
        ]
      })

      expect(buildAutoCompleteListFromPayload(payload)).toEqual({
        title: 'What is your first language?',
        name: 'tzrHYW',
        type: 'string',
        items: [
          { text: 'English', value: 'en-gb' },
          { text: 'German', value: 'de-De' }
        ]
      })
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
        id: listId,
        list: buildList({
          ...payload,
          id: listId
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

  describe('deleteList', () => {
    const requestUrl = new URL(
      `./${formId}/definition/draft/lists/${listId}`,
      formsEndpoint
    )

    it('should delete a list', async () => {
      mockedDelJson.mockResolvedValueOnce({
        response: editor(),
        body: {
          id: listId,
          status: 'deleted'
        }
      })
      await deleteList(formId, listId, token)

      expect(mockedDelJson).toHaveBeenCalledWith(requestUrl, baseOptions)
    })
  })
})
