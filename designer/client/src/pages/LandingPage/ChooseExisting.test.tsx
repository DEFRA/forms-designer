import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { ChooseExisting } from './ChooseExisting'
import {
  server,
  http,
  mockedFormHandlers,
  mockedFormConfigurations
} from '../../../test/testServer'

describe('ChooseExisting', () => {
  beforeAll(() => server.listen())
  beforeEach(() => server.resetHandlers(...mockedFormHandlers))
  afterEach(cleanup)
  afterAll(() => server.close())

  const { findByText, getByText } = screen

  test('no existing configurations', async () => {
    server.resetHandlers(
      http.get('/forms-designer/api/configurations', () => {
        return new Response(JSON.stringify([]), {
          headers: { 'Content-Type': 'application/json' }
        })
      })
    )

    const push = jest.fn()
    const history = { push }
    const { asFragment } = render(<ChooseExisting history={history} />)
    await waitFor(() =>
      expect(findByText(/Form name/i)).resolves.toBeInTheDocument()
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test('with existing configurations', async () => {
    const push = jest.fn()
    const history = { push }
    const { asFragment } = render(<ChooseExisting history={history} />)
    await waitFor(() =>
      expect(findByText(/Form name/i)).resolves.toBeInTheDocument()
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test('should post to server and redirect to a new page on choosing a form', async () => {
    server.use(
      http.post('/forms-designer/api/new', () => {
        return new Response(JSON.stringify({ id: 'somekey', previewUrl: '' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      })
    )
    const push = jest.fn()
    const history = { push }

    render(<ChooseExisting history={history} />)
    await waitFor(() =>
      expect(findByText(/Form name/i)).resolves.toBeInTheDocument()
    )

    await act(() =>
      userEvent.click(getByText(mockedFormConfigurations[0].DisplayName))
    )

    await waitFor(() => expect(push).toHaveBeenCalledWith('/designer/somekey'))
  })
})
