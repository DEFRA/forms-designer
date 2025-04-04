import { buildDefinition, buildList } from '~/src/__stubs__/form-definition.js'
import {
  baseOptions,
  createMockResponse,
  formsEndpoint,
  mockedDelJson,
  mockedPostJson,
  mockedPutJson,
  token
} from '~/src/lib/__stubs__/editor.js'
import {
  buildListFromDetails,
  createList,
  deleteList,
  updateList,
  upsertList
} from '~/src/lib/list.js'

jest.mock('~/src/lib/fetch.js')

describe('list.js', () => {
  const formId = '98dbfb6c-93b7-41dc-86e7-02c7abe4ba38'
  const listId = '8b10412c-cb4d-46bd-99d4-249bca722b3f'

  describe('buildListFromDetails', () => {
    it('should build a list from details', () => {
      const payload = {
        list: 'listname',
        name: 'questionname'
      }
      const listItems = [
        { text: 'English', value: 'en-gb' },
        { text: 'German', value: 'de-De' }
      ]

      expect(buildListFromDetails(payload, listItems)).toEqual({
        title: 'List for question questionname',
        name: 'listname',
        type: 'string',
        items: [
          { text: 'English', value: 'en-gb' },
          { text: 'German', value: 'de-De' }
        ]
      })
    })

    it('should build a list from details including populating random name', () => {
      const payload = {
        name: 'q-name'
      }
      const listItems = [
        { text: 'English', value: 'en-gb' },
        { text: 'German', value: 'de-De' }
      ]

      expect(buildListFromDetails(payload, listItems)).toEqual({
        title: 'List for question q-name',
        name: expect.any(String),
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
        response: createMockResponse(),
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
        response: createMockResponse(),
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
        response: createMockResponse(),
        body: {
          id: listId,
          status: 'deleted'
        }
      })
      await deleteList(formId, listId, token)

      expect(mockedDelJson).toHaveBeenCalledWith(requestUrl, baseOptions)
    })
  })

  describe('upsertList', () => {
    const baseList = buildList({
      name: 'AbcdE'
    })

    it('should create list if list does not exist', async () => {
      const requestUrl = new URL(
        `./${formId}/definition/draft/lists`,
        formsEndpoint
      )
      const expectedList = buildList({
        ...baseList,
        id: listId
      })
      const expectedResponse = {
        id: listId,
        list: expectedList,
        status: 'created'
      }
      mockedPostJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: expectedResponse
      })

      const definition = buildDefinition()

      const createdList = await upsertList(formId, definition, token, baseList)
      const [calledUrl] = mockedPostJson.mock.calls[0]
      expect(calledUrl).toEqual(requestUrl)
      expect(createdList).toEqual(expectedResponse)
    })

    it('should fail if id is missing from found list', async () => {
      const expectedList = buildList({
        ...baseList,
        id: undefined
      })

      const definition = buildDefinition({
        lists: [expectedList]
      })

      await expect(
        upsertList(formId, definition, token, baseList)
      ).rejects.toThrow(new Error('Id missing from list with name - AbcdE'))
    })

    it('should update list if list exists', async () => {
      const list = buildList({
        ...baseList,
        id: listId
      })
      mockedPutJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: {
          id: listId,
          list,
          status: 'updated'
        }
      })

      const requestUrl = new URL(
        `./${formId}/definition/draft/lists/${listId}`,
        formsEndpoint
      )
      const definition = buildDefinition({
        pages: [],
        lists: [list]
      })
      await upsertList(formId, definition, token, list)
      const [calledUrl] = mockedPutJson.mock.calls[0]
      expect(calledUrl).toEqual(requestUrl)
    })
  })
})
