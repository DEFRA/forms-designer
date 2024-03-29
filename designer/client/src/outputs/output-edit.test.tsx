import React from 'react'
import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { RenderWithContextAndDataContext } from '../../test/helpers/renderers'
import { FormDefinition } from '@defra/forms-model'

import OutputEdit from './output-edit'

describe('OutputEdit', () => {
  afterEach(cleanup)

  const { getByText, getByLabelText } = screen

  let mockData: FormDefinition
  let mockSave: any

  beforeEach(() => {
    mockSave = jest.fn().mockResolvedValue(mockData)
    mockData = {
      pages: [
        {
          title: 'First page',
          path: '/first-page',
          components: [
            {
              name: '9WH4EX',
              options: {},
              type: 'TextField',
              title: 'Email'
            }
          ],
          controller: './pages/summary.js'
        }
      ],
      outputs: [],
      conditions: [],
      lists: []
    }
  })

  describe('Notify', () => {
    test('Notify Output object is created correctly', async () => {
      const props: any = {
        onEdit: jest.fn(),
        onCancel: jest.fn(),
        data: mockData,
        output: {
          name: 'Notify Test',
          title: 'Notify Test',
          type: 'notify',
          outputConfiguration: {
            templateId: '123ID',
            apiKey: '123KEY',
            emailField: '9WH4EX',
            personalisation: []
          }
        }
      }

      render(
        <RenderWithContextAndDataContext
          mockData={mockData}
          mockSave={mockSave}
        >
          <OutputEdit {...props} />
        </RenderWithContextAndDataContext>
      )

      const $title = getByLabelText('Title')
      const $name = getByLabelText('Name')
      const $templateId = getByLabelText('Template ID')
      const $apiKey = getByLabelText('API Key')
      const $selectEmail = getByLabelText('Email field')
      const $checkbox = getByText('Include webhook and payment references')
      const $button = getByText('Save')

      // change title
      await act(() => userEvent.clear($title))
      await act(() => userEvent.type($title, 'NewTitle'))

      // change name
      await act(() => userEvent.clear($name))
      await act(() => userEvent.type($name, 'NewName'))

      // change templateId
      await act(() => userEvent.clear($templateId))
      await act(() => userEvent.type($templateId, 'NewTemplateId'))

      // change apiKey
      await act(() => userEvent.clear($apiKey))
      await act(() => userEvent.type($apiKey, 'NewAPIKey'))

      // change email field
      await act(() => userEvent.selectOptions($selectEmail, '9WH4EX'))

      // include references
      await act(() => userEvent.click($checkbox))

      // save
      await act(() => userEvent.click($button))
      await waitFor(() => expect(mockSave).toHaveBeenCalledTimes(1))

      expect(mockSave.mock.calls[0][0].outputs).toEqual([
        {
          name: 'NewName',
          title: 'NewTitle',
          type: 'notify',
          outputConfiguration: {
            personalisation: [],
            templateId: 'NewTemplateId',
            apiKey: 'NewAPIKey',
            emailField: '9WH4EX',
            addReferencesToPersonalisation: true
          }
        }
      ])
    })
  })
})
