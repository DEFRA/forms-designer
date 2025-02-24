import { ComponentType, ControllerType } from '@defra/forms-model'

import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

describe('Editor v2 questions routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  const now = new Date()
  const authorId = 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
  const authorDisplayName = 'Enrique Chase'

  /**
   * @satisfies {FormMetadataAuthor}
   */
  const author = {
    id: authorId,
    displayName: authorDisplayName
  }

  /**
   * @satisfies {FormMetadata}
   */
  const formMetadata = {
    id: '661e4ca5039739ef2902b214',
    slug: 'my-form-slug',
    title: 'Test form',
    organisation: 'Defra',
    teamName: 'Defra Forms',
    teamEmail: 'defraforms@defra.gov.uk',
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author,
    draft: {
      createdAt: now,
      createdBy: author,
      updatedAt: now,
      updatedBy: author
    }
  }

  /**
   * @satisfies {FormDefinition}
   */
  const formDefinitionWithTwoQuestions = {
    name: 'Test form',
    pages: [
      {
        id: 'f07fbbb1-268c-429b-bba5-5fc1f7353d7c',
        path: '/page-one',
        title: 'Page one',
        section: 'section',
        components: [
          {
            type: ComponentType.TextField,
            name: 'textField',
            title: 'This is your first question',
            hint: 'Help text',
            options: {},
            schema: {}
          },
          {
            type: ComponentType.TextField,
            name: 'textField',
            title: 'This is your second question',
            hint: 'Help text',
            options: {},
            schema: {}
          }
        ],
        next: [{ path: '/summary' }]
      },
      {
        id: '2',
        title: 'Summary',
        path: '/summary',
        controller: ControllerType.Summary
      }
    ],
    conditions: [],
    sections: [],
    lists: []
  }

  /**
   * @satisfies {FormDefinition}
   */
  const formDefinitionWithNoQuestions = {
    name: 'Test form',
    pages: [
      {
        id: 'f07fbbb1-268c-429b-bba5-5fc1f7353d7c',
        path: '/page-one',
        title: 'Page one',
        section: 'section',
        components: [],
        next: [{ path: '/summary' }]
      },
      {
        id: '2',
        title: 'Summary',
        path: '/summary',
        controller: ControllerType.Summary
      }
    ],
    conditions: [],
    sections: [],
    lists: []
  }

  test('GET - should render two questions in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(formDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/f07fbbb1-268c-429b-bba5-5fc1f7353d7c/questions',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')
    const $cardTitle = container.getByText('Page 1 overview')
    const $cardHeading = container.getByText('Page 1')
    const $questionNumbers = container.getAllByRole('term')
    const $questionTitles = container.getAllByRole('definition')

    const $actions = container.getAllByRole('button')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardTitle).toHaveTextContent('Page 1 overview')
    expect($cardTitle).toHaveClass('editor-card-title')
    expect($cardHeading).toHaveTextContent('Page 1')
    expect($cardHeading).toHaveClass('govuk-heading-l')

    expect($questionNumbers[0]).toHaveTextContent('Question 1')
    expect($questionNumbers[1]).toHaveTextContent('Question 2')

    expect($questionTitles[1]).toHaveTextContent('This is your first question')
    expect($questionTitles[3]).toHaveTextContent('This is your second question')

    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Add another question')
    expect($actions[3]).toHaveTextContent('Save changes')
  })

  test('GET - should render no questions in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(formDefinitionWithNoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/f07fbbb1-268c-429b-bba5-5fc1f7353d7c/questions',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')
    const $cardTitle = container.getByText('Page 1 overview')
    const $cardHeading = container.getByText('Page 1')
    const $questionNumbers = container.getAllByRole('term')
    const $questionTitles = container.getAllByRole('definition')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardTitle).toHaveTextContent('Page 1 overview')
    expect($cardTitle).toHaveClass('editor-card-title')
    expect($cardHeading).toHaveTextContent('Page 1')
    expect($cardHeading).toHaveClass('govuk-heading-l')

    expect($questionNumbers).toHaveLength(1)
    expect($questionTitles).toHaveLength(2)
    expect($questionNumbers[0]).toHaveTextContent('')
    expect($questionTitles[0]).toHaveTextContent('No questions')
  })
})

/**
 * @import { FormDefinition, FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
