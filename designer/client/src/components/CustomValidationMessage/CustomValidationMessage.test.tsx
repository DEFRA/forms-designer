import { screen } from '@testing-library/dom'
import { act, cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { CustomValidationMessage } from '~/src/components/CustomValidationMessage/index.js'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('CssClasses', () => {
  afterEach(cleanup)

  describe('CssClassField', () => {
    const { getByLabelText, getByText } = screen

    let stateProps

    beforeEach(() => {
      stateProps = {
        component: {
          type: 'TelephoneNumberField',
          name: 'testTelephone',
          options: {}
        }
      }

      render(
        <RenderWithContext stateProps={stateProps}>
          <CustomValidationMessage />
        </RenderWithContext>
      )
    })

    test('should display display correct title and hint', () => {
      const title = 'Validation message'
      const hint =
        'Enter the validation message to show when a validation error occurs'
      expect(getByText(title)).toBeInTheDocument()
      expect(getByText(hint)).toBeInTheDocument()
    })

    test('value should change and be displayed correctly', async () => {
      const $input = getByLabelText('Validation message') as HTMLInputElement
      expect($input.value).toBe('')

      await act(() => userEvent.clear($input))
      await act(() => userEvent.type($input, "It's wrong!"))

      expect($input.value).toBe("It's wrong!")
    })
  })
})
