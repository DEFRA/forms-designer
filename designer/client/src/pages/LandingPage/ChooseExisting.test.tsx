import React from 'react'
import { ChooseExisting } from './ChooseExisting'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import {
  server,
  http,
  mockedFormConfigurations
} from '../../../../test/testServer'

describe('ChooseExisting', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

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
    expect(await screen.findByText(/Form name/i)).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })

  test('with existing configurations', async () => {
    const push = jest.fn()
    const history = { push }
    const { asFragment } = render(<ChooseExisting history={history} />)
    expect(await screen.findByText(/Form name/i)).toBeInTheDocument()
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
    expect(await screen.findByText(/Form name/i)).toBeInTheDocument()

    await fireEvent.click(
      screen.getByText(mockedFormConfigurations[0].DisplayName)
    )
    await waitFor(() => expect(push).toHaveBeenCalledTimes(1))
    expect(push).toHaveBeenCalledWith('/designer/somekey')
  })
})
