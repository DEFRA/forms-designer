import { testFormDefinitionWithTwoQuestions } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { validateFileSelected } from '~/src/routes/forms/editor-v2/translations.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/forms.js')

describe('Translations routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('GET - should render english/welsh fields in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/welsh',
      auth
    }

    const { container, document } = await renderResponse(server, options)

    const $mastheadHeadings = container.getAllByText('Test form')
    const $cardTitle = container.getByText(
      'Add Welsh translations for your form'
    )
    const $captions = document.getElementsByClassName('govuk-table__caption')

    const $actions = container.getAllByRole('button')

    expect($mastheadHeadings[0]).toHaveTextContent('Test form')
    expect($mastheadHeadings[0]).toHaveClass('govuk-caption-l')
    expect($cardTitle).toHaveTextContent('Add Welsh translations for your form')
    expect($cardTitle).toHaveClass('app-masthead__heading govuk-heading-xl')

    expect($captions).toHaveLength(9)
    expect($captions[0]).toHaveTextContent('Form name')
    expect($captions[1]).toHaveTextContent(
      'Contact details for support: email address and response time'
    )
    expect($captions[2]).toHaveTextContent('Contact link for support')
    expect($captions[3]).toHaveTextContent('Phone number and opening times')
    expect($captions[4]).toHaveTextContent(
      'Information about what happens next'
    )
    expect($captions[5]).toHaveTextContent(
      'Privacy information for this form (uses inline content)'
    )
    expect($captions[6]).toHaveTextContent('Page 1')
    expect($captions[7]).toHaveTextContent('Page 1, question 1')
    expect($captions[8]).toHaveTextContent('Page 1, question 2')

    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Save changes')
    expect($actions[3]).toHaveTextContent('Preview form in Welsh')
  })

  test('validateFileSelected returns translation workbook error for invalid workbook bytes', () => {
    const buffer = Buffer.from('invalid')
    const mockHelpers = {
      error: jest.fn((type) => ({ type, isJoiError: true }))
    }

    const result = validateFileSelected(buffer, mockHelpers)

    expect(mockHelpers.error).toHaveBeenCalledWith(
      'custom.invalidTranslationWorkbook',
      {
        reason: 'Wrong number of columns (expected 5, got 1)'
      }
    )
    expect(result).toEqual({
      type: 'custom.invalidTranslationWorkbook',
      isJoiError: true
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
