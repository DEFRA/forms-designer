import { ComponentType, Engine } from '@defra/forms-model'
import { buildDefinition } from '@defra/forms-model/stubs'

import { testFormDefinitionWithRadioQuestionAndList } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { getQuestionSessionState } from '~/src/lib/session-helper.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/session-helper.js')

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
})

/**
 * @import { Server } from '@hapi/hapi'
 * @import { ListConflict, PageQuestion } from '@defra/forms-model'
 */
