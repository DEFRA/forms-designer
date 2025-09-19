import { ComponentType, Engine } from '@defra/forms-model'
import { buildDefinition } from '@defra/forms-model/stubs'
import { StatusCodes } from 'http-status-codes'

import { testFormDefinitionWithRadioQuestionAndList } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { matchLists, upsertList } from '~/src/lib/list.js'
import { getQuestionSessionState } from '~/src/lib/session-helper.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/session-helper.js')
jest.mock('~/src/lib/list.js')

describe('Editor v2 edit-list-resolve routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const testForm = buildDefinition({
    ...testFormDefinitionWithRadioQuestionAndList,
    engine: Engine.V2
  })
  // Change radio to autocomplete
  const firstQuestion = /** @type {PageQuestion} */ (testForm.pages[0])
    .components[0]
  firstQuestion.type = ComponentType.AutocompleteField

  const listConflicts = /** @type {ListConflict[]} */ ([
    {
      conflictItem: { id: '1', text: 'conflict-item' },
      originalItem: { id: '2', text: 'original-item' },
      conditionNames: ['Condition name 1', 'Condition name 2'],
      linkableItems: [
        { id: '3', text: 'linkable-item-1', value: 'val1' },
        { id: '4', text: 'linkable-item-2', value: 'val2' }
      ]
    }
  ])

  describe('GET', () => {
    test('should display list of conflicts', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(testForm)
      jest
        .mocked(getQuestionSessionState)
        .mockReturnValueOnce({ listConflicts })
      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/page/p1/question/q1/details/state/resolve',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $mainHeading = container.getByRole('heading', { level: 1 })
      const $cardHeadings = container.getAllByText('Test form')
      const $questionText = container.getAllByText('List: Select a colour')

      expect($mainHeading).toHaveTextContent('Resolve issues in your list')
      expect($cardHeadings[0]).toHaveTextContent('Test form')
      expect($cardHeadings).toHaveLength(1)
      expect($questionText[0]).toHaveTextContent('List: Select a colour')
      expect($questionText).toHaveLength(1)

      const $rows = container.getAllByRole('row')
      expect($rows).toHaveLength(2)

      expect($rows[1]).toHaveTextContent('conflict-item')
      expect($rows[1]).toHaveTextContent('Condition name 1')
      expect($rows[1]).toHaveTextContent('Condition name 2')
    })
  })

  describe('POST', () => {
    const listConflicts = /** @type {ListConflict[]} */ ([
      {
        conflictItem: { id: '1', text: 'conflict-item' },
        originalItem: { id: '2', text: 'original-item' },
        conditionNames: ['Condition name 1', 'Condition name 2'],
        linkableItems: [
          { id: '3', text: 'linkable-item-1', value: 'val1' },
          { id: '4', text: 'linkable-item-2', value: 'val2' }
        ]
      },
      {
        conflictItem: { id: '2-1', text: 'conflict-item-2' },
        originalItem: { id: '2-2', text: 'original-item-2' },
        conditionNames: ['Condition name 2-1', 'Condition name 2-2'],
        linkableItems: [
          { id: '2-3', text: 'linkable-item-2-1', value: 'val2-1' },
          { id: '2-4', text: 'linkable-item-2-2', value: 'val2-2' }
        ]
      }
    ])

    const listItems = /** @type {ListItem[]} */ ([
      { id: '2', text: 'original-item' },
      { id: '2-2', text: 'original-item-2' }
    ])

    const questionDetails = {
      id: 'q-id',
      type: ComponentType.AutocompleteField,
      list: 'my-list-guid'
    }

    const additions = [
      { text: 'New Item 1', value: 'New Item 1' },
      { text: 'New Item 2', value: 'New Item 2' }
    ]

    const listItemsWithIds = [
      { id: '2', text: 'original-item', value: 'original-item' },
      { id: '2-2', text: 'original-item-2', value: 'original-=item-2' }
    ]

    test('should replace multiple list values', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(testForm)
      jest
        .mocked(getQuestionSessionState)
        .mockReturnValueOnce({ listConflicts, listItems, questionDetails })
      jest
        .mocked(matchLists)
        .mockReturnValueOnce({ additions, deletions: [], listItemsWithIds })
      // @ts-expect-error - blank list is allowed here
      jest
        .mocked(upsertList)
        .mockResolvedValueOnce({ id: '1', list: [], status: 'updated' })
      const payload = {
        'replaceWith[2]': 'New Item 1',
        'replaceWith[2-2]': 'New Item 2'
      }
      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/p1/question/q1/details/state/resolve',
        auth,
        payload
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(upsertList).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        {
          id: 'my-list-guid',
          items: [
            {
              id: '2',
              text: 'original-item',
              value: 'original-item'
            },
            {
              id: '2-2',
              text: 'original-item-2',
              value: 'original-=item-2'
            }
          ],
          name: 'my-list',
          title: 'List for question undefined',
          type: 'string'
        }
      )
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 * @import { ListConflict, ListItem, PageQuestion } from '@defra/forms-model'
 */
