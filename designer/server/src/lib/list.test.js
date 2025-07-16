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
  createList,
  deleteList,
  populateListIds,
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

  describe('populateListIds', () => {
    test('should handle blank list', () => {
      const { definition, listIdWithItemIds } = listStubs.exampleWithListItemIds
      const populated = populateListIds(definition, listIdWithItemIds, [])
      expect(populated).toEqual([])
    })

    test('should handle incorrect list ref', () => {
      const { definition } = listStubs.exampleWithListItemIds
      const populated = populateListIds(definition, 'wrong-list-id', [
        { text: 'EnglandChanged', value: 'england' },
        { text: 'ScotandChanged', value: 'scotland' },
        { text: 'WalesChanged', value: 'wales' }
      ])
      expect(populated).toEqual([
        { id: undefined, text: 'EnglandChanged', value: 'england' },
        { id: undefined, text: 'ScotandChanged', value: 'scotland' },
        { id: undefined, text: 'WalesChanged', value: 'wales' }
      ])
    })

    test('should populate known ids using code value', () => {
      const { definition, listIdWithItemIds } = listStubs.exampleWithListItemIds
      const populated = populateListIds(definition, listIdWithItemIds, [
        { text: 'EnglandChanged', value: 'england' },
        { text: 'ScotandChanged', value: 'scotland' },
        { text: 'WalesChanged', value: 'wales' }
      ])
      expect(populated).toEqual([
        { id: 'id1', text: 'EnglandChanged', value: 'england' },
        { id: 'id2', text: 'ScotandChanged', value: 'scotland' },
        { id: 'id3', text: 'WalesChanged', value: 'wales' }
      ])
    })

    test('should populate known ids using display text', () => {
      const { definition, listIdWithItemIds } = listStubs.exampleWithListItemIds
      const populated = populateListIds(definition, listIdWithItemIds, [
        { text: 'England', value: 'eng' },
        { text: 'Scotland', value: 'scot' },
        { text: 'Wales', value: 'wal' }
      ])
      expect(populated).toEqual([
        { id: 'id1', text: 'England', value: 'eng' },
        { id: 'id2', text: 'Scotland', value: 'scot' },
        { id: 'id3', text: 'Wales', value: 'wal' }
      ])
    })

    test('should retain hint text if provided', () => {
      const { definition, listIdWithItemIds } = listStubs.exampleWithListItemIds
      const populated = populateListIds(definition, listIdWithItemIds, [
        { text: 'England', value: 'eng', hint: { text: 'help' } },
        { text: 'Scotland', value: 'scot' },
        { text: 'Wales', value: 'wal', hint: { text: 'cymorth' } }
      ])
      expect(populated).toEqual([
        { id: 'id1', text: 'England', value: 'eng', hint: { text: 'help' } },
        { id: 'id2', text: 'Scotland', value: 'scot' },
        { id: 'id3', text: 'Wales', value: 'wal', hint: { text: 'cymorth' } }
      ])
    })
  })
})
