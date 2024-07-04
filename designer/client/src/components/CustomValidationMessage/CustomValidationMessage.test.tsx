import { ComponentSubType, ComponentType } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { act, cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { CustomValidationMessage } from '~/src/components/CustomValidationMessage/CustomValidationMessage.jsx'
import {
  RenderWithContext,
  type RenderWithContextProps
} from '~/test/helpers/renderers.jsx'

describe('CssClasses', () => {
  afterEach(cleanup)

  describe('CssClassField', () => {
    let state: RenderWithContextProps['state']

    beforeEach(() => {
      state = {
        selectedComponent: {
          name: 'TelephoneNumberField',
          title: 'Telephone number field',
          type: ComponentType.TelephoneNumberField,
          subType: ComponentSubType.Field,
          options: {},
          schema: {}
        }
      }

      render(
        <RenderWithContext state={state}>
          <CustomValidationMessage />
        </RenderWithContext>
      )
    })

    test('should display display correct title and hint', () => {
      const title = 'Validation message'
      const hint =
        'Enter the validation message to show when a validation error occurs'
      expect(screen.getByText(title)).toBeInTheDocument()
      expect(screen.getByText(hint)).toBeInTheDocument()
    })

    test('value should change and be displayed correctly', async () => {
      const $input =
        screen.getByLabelText<HTMLInputElement>('Validation message')
      expect($input.value).toBe('')

      await act(() => userEvent.clear($input))
      await act(() => userEvent.type($input, "It's wrong!"))

      expect($input.value).toBe("It's wrong!")
    })
  })
})
