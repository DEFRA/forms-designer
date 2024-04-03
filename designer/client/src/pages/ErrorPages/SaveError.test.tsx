import { screen } from '@testing-library/dom'
import { act, render, cleanup, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { SaveError } from '~/src/pages/ErrorPages/SaveError.jsx'

describe('SaveErrorPage', () => {
  afterEach(cleanup)

  const { findByText, getByText } = screen

  test('should render correctly', async () => {
    const push = jest.fn()
    const history = { push }
    const location = { state: { id: 'testid' } }

    render(<SaveError history={history} location={location} />)

    await waitFor(() =>
      expect(findByText('Back to Designer')).resolves.toBeInTheDocument()
    )

    await waitFor(() =>
      expect(
        findByText('Sorry, there is a problem with the service')
      ).resolves.toBeInTheDocument()
    )

    await waitFor(() =>
      expect(
        findByText('An error occurred while saving.')
      ).resolves.toBeInTheDocument()
    )

    await waitFor(() =>
      expect(
        findByText(
          'We saved the last valid version of your form. Return to the Designer to continue.'
        )
      ).resolves.toBeInTheDocument()
    )

    await waitFor(() =>
      expect(
        findByText('So we can check what went wrong, complete the following:')
      ).resolves.toBeInTheDocument()
    )

    await waitFor(() =>
      expect(
        findByText('download your crash report')
      ).resolves.toBeInTheDocument()
    )

    await waitFor(() =>
      expect(
        findByText('create an issue on GitHub')
      ).resolves.toBeInTheDocument()
    )

    expect(getByText('create an issue on GitHub').closest('a')).toHaveAttribute(
      'href',
      'https://github.com/XGovFormBuilder/digital-form-builder/issues/new?template=bug_report.md'
    )
  })

  test('back link should take back to designer page', async () => {
    const push = jest.fn()
    const history = { push }
    const location = { state: { id: 'testid' } }
    render(<SaveError history={history} location={location} />)

    const $backLink = await waitFor(() => findByText('Back to Designer'))

    await act(() => userEvent.click($backLink))
    await waitFor(() => expect(push).toHaveBeenCalledWith('designer/testid'))
  })
})
