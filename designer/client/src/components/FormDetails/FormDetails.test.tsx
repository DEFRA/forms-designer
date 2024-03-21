import { screen } from '@testing-library/dom'
import {
  act,
  cleanup,
  fireEvent,
  render,
  type RenderResult,
  waitFor
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { FormDetails } from '~/src/components/FormDetails/index.js'
import { DataContext } from '~/src/context/index.js'
import {
  server,
  mockedFormConfigurations,
  mockedFormHandlers
} from '~/test/testServer.js'

describe('FormDetails', () => {
  const { findByTestId, findByText, getByLabelText, getByText, queryByText } =
    screen

  let providerProps

  beforeAll(() => server.listen())

  beforeEach(() => {
    providerProps = {
      data: {
        name: 'Default Title'
      },
      save: jest.fn()
    }

    server.resetHandlers(...mockedFormHandlers)
  })

  afterEach(cleanup)

  afterAll(() => {
    server.close()
  })

  function customRender(
    element: React.JSX.Element,
    providerProps
  ): RenderResult {
    return render(
      <DataContext.Provider value={providerProps}>
        {element}
      </DataContext.Provider>
    )
  }

  describe('Title', () => {
    it('updates the form title', async () => {
      customRender(<FormDetails />, providerProps)

      const $input = getByLabelText('Title')
      const $button = getByText('Save')

      await act(() => userEvent.clear($input))
      await act(() => userEvent.type($input, 'Test Form'))

      act(() => {
        fireEvent.submit($button)
      })

      await waitFor(() => expect(providerProps.save).toHaveBeenCalled())
      expect(providerProps.save.mock.calls[0][0]).toMatchObject({
        name: 'Test Form',
        phaseBanner: { phase: undefined }
      })
    })
  })

  describe('Phase banner', () => {
    it('sets alpha phase', async () => {
      customRender(<FormDetails />, providerProps)

      const $radioAlpha = getByLabelText('Alpha') as HTMLInputElement
      const $radioNone = getByLabelText('None') as HTMLInputElement
      const $button = getByText('Save')

      expect($radioAlpha.checked).toBe(false)
      expect($radioNone.checked).toBe(true)

      await act(() => userEvent.click($radioAlpha))
      expect($radioAlpha.checked).toBe(true)
      expect($radioNone.checked).toBe(false)

      act(() => {
        fireEvent.submit($button)
      })

      await waitFor(() => expect(providerProps.save).toHaveBeenCalled())
      expect(providerProps.save.mock.calls[0][0]).toMatchObject({
        name: 'Default Title',
        phaseBanner: { phase: 'alpha' }
      })
    })

    it('sets beta phase', async () => {
      customRender(<FormDetails />, providerProps)

      const $radioBeta = getByLabelText('Beta') as HTMLInputElement
      const $radioNone = getByLabelText('None') as HTMLInputElement
      const $button = getByText('Save')

      expect($radioBeta.checked).toBe(false)
      expect($radioNone.checked).toBe(true)

      await act(() => userEvent.click($radioBeta))
      expect($radioBeta.checked).toBe(true)
      expect($radioNone.checked).toBe(false)

      act(() => {
        fireEvent.submit($button)
      })

      await waitFor(() => expect(providerProps.save).toHaveBeenCalled())
      expect(providerProps.save.mock.calls[0][0]).toMatchObject({
        name: 'Default Title',
        phaseBanner: { phase: 'beta' }
      })
    })

    it('sets none phase', async () => {
      customRender(<FormDetails />, {
        ...providerProps,
        data: {
          ...providerProps.data,
          phaseBanner: { phase: 'alpha' }
        }
      })

      const $radioAlpha = getByLabelText('Alpha') as HTMLInputElement
      const $radioNone = getByLabelText('None') as HTMLInputElement

      expect($radioAlpha.checked).toBe(true)
      expect($radioNone.checked).toBe(false)

      await act(() => userEvent.click($radioNone))
      expect($radioAlpha.checked).toBe(false)
      expect($radioNone.checked).toBe(true)

      const $button = getByText('Save')

      act(() => {
        fireEvent.submit($button)
      })

      await waitFor(() => expect(providerProps.save).toHaveBeenCalled())
      expect(providerProps.save.mock.calls[0][0]).toMatchObject({
        name: 'Default Title',
        phaseBanner: { phase: undefined }
      })
    })
  })

  describe('Feedback form', () => {
    it('sets `Yes` feedback form', async () => {
      customRender(<FormDetails />, providerProps)

      const $radioFeedbackYes = getByLabelText('yes') as HTMLInputElement
      const $radioFeedbackNo = getByLabelText('no') as HTMLInputElement
      const $button = getByText('Save')

      expect($radioFeedbackYes.checked).toBe(false)
      expect($radioFeedbackNo.checked).toBe(true)

      await act(() => userEvent.click($radioFeedbackYes))
      expect($radioFeedbackYes.checked).toBe(true)
      expect($radioFeedbackNo.checked).toBe(false)

      act(() => {
        fireEvent.submit($button)
      })

      await waitFor(() => expect(providerProps.save).toHaveBeenCalled())
      expect(providerProps.save.mock.calls[0][0]).toMatchObject({
        feedback: {
          feedbackForm: true,
          url: ''
        },
        name: 'Default Title',
        phaseBanner: { phase: undefined }
      })
    })

    it('sets `No` feedback form', async () => {
      customRender(<FormDetails />, {
        ...providerProps,
        data: {
          ...providerProps.data,
          feedback: {
            feedbackForm: true
          }
        }
      })

      const $radioFeedbackYes = getByLabelText('yes') as HTMLInputElement
      const $radioFeedbackNo = getByLabelText('no') as HTMLInputElement
      const $button = getByText('Save')

      expect($radioFeedbackYes.checked).toBe(true)
      expect($radioFeedbackNo.checked).toBe(false)

      await act(() => userEvent.click($radioFeedbackNo))
      expect($radioFeedbackYes.checked).toBe(false)
      expect($radioFeedbackNo.checked).toBe(true)

      act(() => {
        fireEvent.submit($button)
      })

      await waitFor(() => expect(providerProps.save).toHaveBeenCalled())
      expect(providerProps.save.mock.calls[0][0]).toMatchObject({
        name: 'Default Title',
        feedback: {
          feedbackForm: false
        },
        phaseBanner: { phase: undefined }
      })
    })

    it('displays correct feedback form list', async () => {
      customRender(<FormDetails />, providerProps)

      const formKey1 = mockedFormConfigurations[0].DisplayName
      const formKey2 = mockedFormConfigurations[1].DisplayName

      await waitFor(() => findByText(formKey2))

      const $option1 = queryByText(formKey1)
      const $option2 = queryByText(formKey2)

      expect($option1).toBeFalsy()
      expect($option2).toBeTruthy()
    })

    it('sets correct feedback url when target feedback form is selected', async () => {
      customRender(<FormDetails />, providerProps)

      const formKey = mockedFormConfigurations[1].Key

      const $select = await waitFor(() => findByTestId('target-feedback-form'))
      const $button = getByText('Save')

      await act(() => userEvent.selectOptions($select, formKey))

      act(() => {
        fireEvent.submit($button)
      })

      await waitFor(() => expect(providerProps.save).toHaveBeenCalled())
      expect(providerProps.save.mock.calls[0][0]).toMatchObject({
        feedback: {
          url: `/${formKey}`
        }
      })
    })
  })
})
