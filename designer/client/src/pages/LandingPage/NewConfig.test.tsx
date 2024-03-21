import React from 'react'
import { NewConfig } from './NewConfig'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { server, http } from '../../../../test/testServer'
import { MemoryRouter } from 'react-router-dom'
import type { FormConfiguration } from '@defra/forms-model'

describe('Newconfig', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

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
    expect(
      await screen.findByText(/Enter a name for your form/i)
    ).toBeInTheDocument()

    await fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Form A' }
    })
    await fireEvent.click(screen.getByText('Next'))
    await waitFor(() => expect(push).toHaveBeenCalledTimes(1))
    expect(push).toHaveBeenCalledWith('designer/somekey')

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

    expect(
      await screen.findByText(/Enter a name for your form/i)
    ).toBeInTheDocument()

    await fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'My feedback form' }
    })
    await fireEvent.click(screen.getByText('Next'))
    expect(apiCalled).toBeFalsy()
    expect(await screen.findByText(/There is a problem/i)).toBeInTheDocument()
    expect(
      await screen.findAllByText(/A form with this name already exists/i)
    ).toHaveLength(2)
  })

  test('Enter form name error shown correctly', async () => {
    render(<NewConfig />, { wrapper: MemoryRouter })

    expect(
      await screen.findByText(/Enter a name for your form/i)
    ).toBeInTheDocument()

    await fireEvent.click(screen.getByText('Next'))
    expect(await screen.findByText(/There is a problem/i)).toBeInTheDocument()
    expect(await screen.findAllByText(/Enter form name/i)).toHaveLength(2)
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

    expect(
      await screen.findByText(/Enter a name for your form/i)
    ).toBeInTheDocument()

    await fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Visa & Form' }
    })
    await fireEvent.click(screen.getByText('Next'))
    expect(apiCalled).toBeFalsy()
    expect(await screen.findByText(/There is a problem/i)).toBeInTheDocument()
    expect(
      await screen.findAllByText(
        /Form name should not contain special characters/i
      )
    ).toHaveLength(2)
  })
})
