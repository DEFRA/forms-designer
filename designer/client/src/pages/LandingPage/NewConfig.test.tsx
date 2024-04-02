import { NewConfig } from '~/src/pages/LandingPage/NewConfig.jsx'
import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { server, http, mockedFormHandlers } from '~/test/testServer.js'
import type { FormConfiguration } from '@defra/forms-model'

describe('Newconfig', () => {
  beforeAll(() => server.listen())
  beforeEach(() => server.resetHandlers(...mockedFormHandlers))
  afterEach(cleanup)
  afterAll(() => server.close())

  const { findAllByText, findByText, getByLabelText, getByText } = screen

  test('new configuration is submitted correctly', async () => {
    let postBodyMatched = false
    server.use(
      http.post<never, { name: string; selected: FormConfiguration }>(
        '/forms-designer/api/new',
        async ({ request }) => {
          const { name, selected } = await request.json()
          postBodyMatched = name === 'test-form-a' && selected.Key === 'New'

          return new Response(
            JSON.stringify({ id: 'somekey', previewUrl: '' }),
            { headers: { 'Content-Type': 'application/json' } }
          )
        }
      )
    )
    const push = jest.fn()
    const history = { push }

    render(<NewConfig history={history} />)
    await waitFor(() =>
      expect(
        findByText(/Enter a name for your form/i)
      ).resolves.toBeInTheDocument()
    )

    const $input = getByLabelText('Title')
    const $button = getByText('Next')

    await act(() => userEvent.clear($input))
    await act(() => userEvent.type($input, 'Test Form A'))
    await act(() => userEvent.click($button))

    await waitFor(() => expect(push).toHaveBeenCalledWith('designer/somekey'))
    expect(postBodyMatched).toBe(true)
  })

  test('it will not submit when alreadyExistsError', async () => {
    let apiCalled = false
    server.use(
      http.post('/forms-designer/api/new', () => {
        apiCalled = true
        return new Response(JSON.stringify({ id: 'somekey', previewUrl: '' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      })
    )
    render(<NewConfig />, { wrapper: MemoryRouter })

    await waitFor(() =>
      expect(
        findByText(/Enter a name for your form/i)
      ).resolves.toBeInTheDocument()
    )

    const $input = getByLabelText('Title')
    const $button = getByText('Next')

    await act(() => userEvent.clear($input))
    await act(() => userEvent.type($input, 'My feedback form'))
    await act(() => userEvent.click($button))

    expect(apiCalled).toBeFalsy()

    await waitFor(() =>
      expect(findByText(/There is a problem/i)).resolves.toBeInTheDocument()
    )

    await waitFor(() =>
      expect(
        findAllByText(/A form with this name already exists/i)
      ).resolves.toHaveLength(2)
    )
  })

  test('Enter form name error shown correctly', async () => {
    render(<NewConfig />, { wrapper: MemoryRouter })

    await waitFor(() =>
      expect(
        findByText(/Enter a name for your form/i)
      ).resolves.toBeInTheDocument()
    )

    const $button = getByText('Next')
    await act(() => userEvent.click($button))

    await waitFor(() =>
      expect(findByText(/There is a problem/i)).resolves.toBeInTheDocument()
    )

    await waitFor(() =>
      expect(findAllByText(/Enter form name/i)).resolves.toHaveLength(2)
    )
  })

  test('Form name with special characters results in error', async () => {
    let apiCalled = false
    server.use(
      http.post('/forms-designer/api/new', () => {
        apiCalled = true
        return new Response(JSON.stringify({ id: 'somekey', previewUrl: '' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      })
    )
    render(<NewConfig />, { wrapper: MemoryRouter })

    await waitFor(() =>
      expect(
        findByText(/Enter a name for your form/i)
      ).resolves.toBeInTheDocument()
    )

    const $input = getByLabelText('Title')
    const $button = getByText('Next')

    await act(() => userEvent.clear($input))
    await act(() => userEvent.type($input, 'Visa & Form'))
    await act(() => userEvent.click($button))

    expect(apiCalled).toBeFalsy()

    await waitFor(() =>
      expect(findByText(/There is a problem/i)).resolves.toBeInTheDocument()
    )

    await waitFor(() =>
      expect(
        findAllByText(/Form name should not contain special characters/i)
      ).resolves.toHaveLength(2)
    )
  })
})
