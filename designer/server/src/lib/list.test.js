import { buildDefinition, buildList } from '~/src/__stubs__/form-definition.js'
import { uniquelyMappedListsStubs } from '~/src/__stubs__/list.js'
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
  removeUniquelyMappedListFromQuestion,
  removeUniquelyMappedListsFromPage,
  updateList,
  upsertList
} from '~/src/lib/list.js'

jest.mock('~/src/lib/fetch.js')

const listStubs = uniquelyMappedListsStubs()

describe('list.js', () => {
  const formId = '98dbfb6c-93b7-41dc-86e7-02c7abe4ba38'
  const listId = '8b10412c-cb4d-46bd-99d4-249bca722b3f'

  describe('buildListFromDetails', () => {
    it('should build a list from details', () => {
      const payload = {
        list: listId,
        name: 'questionname'
      }
      const listItems = [
        { text: 'English', value: 'en-gb' },
        { text: 'German', value: 'de-De' }
      ]

      const definition = buildDefinition({
        lists: [
          {
            id: listId,
            name: 'listname',
            items: listItems,
            title: 'List for question questionname',
            type: 'string'
          }
        ]
      })

      expect(buildListFromDetails(payload, listItems, definition)).toEqual({
        id: listId,
        title: 'List for question questionname',
        name: 'listname',
        type: 'string',
        items: [
          { text: 'English', value: 'en-gb', id: undefined, hint: undefined },
          { text: 'German', value: 'de-De', id: undefined, hint: undefined }
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

      const definition = buildDefinition({
        lists: [
          {
            id: listId,
            name: 'listname',
            items: listItems,
            title: 'List for question questionname',
            type: 'string'
          }
        ]
      })

      expect(buildListFromDetails(payload, listItems, definition)).toEqual({
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

  describe('removeUniquelyMappedListFromQuestion', () => {
    it('should remove a list from a question if it is not attached to any other questions', async () => {
      const { definition, pageId, componentId, listId } =
        listStubs.orphanedListOnComponent

      await removeUniquelyMappedListFromQuestion(
        formId,
        definition,
        token,
        pageId,
        componentId
      )

      expect(mockedDelJson).toHaveBeenCalledTimes(1)
      const [requestUrl] = mockedDelJson.mock.calls[0]
      expect(requestUrl).toEqual(
        new URL(`./${formId}/definition/draft/lists/${listId}`, formsEndpoint)
      )
    })

    it('should not remove a list if list is attached to multiple questions', async () => {
      const { definition, pageId, componentId } =
        listStubs.nonOrphanedListOnComponent

      await removeUniquelyMappedListFromQuestion(
        formId,
        definition,
        token,
        pageId,
        componentId
      )

      expect(mockedDelJson).toHaveBeenCalledTimes(0)
    })
  })

  describe('removeUniquelyMappedListsFromPage', () => {
    it('should remove all the uniquely mapped lists from a page', async () => {
      const { definition, pageId, listIds } =
        listStubs.pageWithUniquelyMappedLists
      await removeUniquelyMappedListsFromPage(formId, definition, token, pageId)
      expect(mockedDelJson).toHaveBeenCalledTimes(2)
      const [requestUrl1] = mockedDelJson.mock.calls[0]
      const [requestUrl2] = mockedDelJson.mock.calls[1]
      expect(requestUrl1).toEqual(
        new URL(
          `./${formId}/definition/draft/lists/${listIds[0]}`,
          formsEndpoint
        )
      )
      expect(requestUrl2).toEqual(
        new URL(
          `./${formId}/definition/draft/lists/${listIds[1]}`,
          formsEndpoint
        )
      )
    })

    it('should not remove lists given no lists are uniquely mapped', async () => {
      const { definition, pageId } = listStubs.pageWithNonUniquelyMappedList
      await removeUniquelyMappedListsFromPage(formId, definition, token, pageId)
      expect(mockedDelJson).toHaveBeenCalledTimes(0)
    })
  })
})
