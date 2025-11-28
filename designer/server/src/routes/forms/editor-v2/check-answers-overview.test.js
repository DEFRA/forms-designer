import {
  testFormDefinitionWithExistingSummaryDeclaration,
  testFormDefinitionWithTwoQuestions
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

describe('Editor v2 check-answers-settings routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('GET - should render the check answers overview page', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/check-answers-settings',
      auth
    }

    const { container, document } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')
    const $pageOverviewLinks = container.getAllByText('Page overview')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($pageOverviewLinks.length).toBeGreaterThan(0)

    const $previewPanel = document.getElementById('preview-panel')
    expect($previewPanel).toBeTruthy()
    expect($previewPanel?.innerHTML).toContain('setupSummaryPageController')
  })

  test('GET - should display declaration summary when declaration exists', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithExistingSummaryDeclaration)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p2/check-answers-settings',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $declarationKey = container.getByText('Declaration text (optional)')
    expect($declarationKey).toBeTruthy()

    const $changeLinks = container.getAllByText('Change')
    expect($changeLinks.length).toBeGreaterThan(0)
  })

  test('GET - should display add declaration link when no declaration', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/check-answers-settings',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $addDeclarationLink = container.getByText('Add declaration text')
    expect($addDeclarationLink).toBeTruthy()
    expect($addDeclarationLink).toHaveClass('govuk-link')
  })

  test('GET - should show tab navigation', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/check-answers-settings',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $declarationTab = container.getByText('Declaration')
    const $confirmationEmailTab = container.getByText('Confirmation email')
    const $sectionsTab = container.getByText('Sections')

    expect($declarationTab).toBeTruthy()
    expect($confirmationEmailTab).toBeTruthy()
    expect($sectionsTab).toBeTruthy()
  })

  test('GET - should include preview panel with correct properties', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/check-answers-settings',
      auth
    }

    const { document } = await renderResponse(server, options)

    const $previewPanel = document.getElementById('preview-panel')
    expect($previewPanel?.innerHTML).toContain('showConfirmationEmail:')
    expect($previewPanel?.innerHTML).toContain('declarationText:')
    expect($previewPanel?.innerHTML).toContain('needDeclaration:')
    expect($previewPanel?.innerHTML).toContain(
      'isConfirmationEmailSettingsPanel:'
    )
  })

  test('GET - should require authentication', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/check-answers-settings'
      // No auth
    }

    const { response } = await renderResponse(server, options)

    expect(response.statusCode).toBe(302)
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
