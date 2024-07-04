import { ComponentSubType, ComponentType } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import React from 'react'

import { TextFieldEdit } from '~/src/components/FieldEditors/TextFieldEdit.jsx'
import {
  RenderWithContext,
  type RenderWithContextProps
} from '~/test/helpers/renderers.jsx'

describe('Text field edit', () => {
  describe('Text field edit fields', () => {
    let state: RenderWithContextProps['state']

    beforeEach(() => {
      state = {
        selectedComponent: {
          name: 'TextFieldEditClass',
          title: 'Text field edit class',
          type: ComponentType.TextField,
          subType: ComponentSubType.Field,
          options: {},
          schema: {}
        }
      }

      render(
        <RenderWithContext state={state}>
          <TextFieldEdit />
        </RenderWithContext>
      )
    })

    test('should display details link title', () => {
      const text = 'Additional settings'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display min length title', () => {
      const text = 'Min length'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display min length help text', () => {
      const text = 'Specifies the minimum number of characters users can enter'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display max length title', () => {
      const text = 'Max length'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display max length help text', () => {
      const text = 'Specifies the maximum number of characters users can enter'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display length title', () => {
      const text = 'Length'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display length help text', () => {
      const text =
        'Specifies the exact character length users must enter. Using this setting negates any values you set for Min length or Max length.'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display regex title', () => {
      const text = 'Regex'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display regex help text', () => {
      const text =
        "Specifies a regular expression to validate users' inputs. Use JavaScript syntax."
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display autocomplete title', () => {
      const text = 'Autocomplete'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display autocomplete help text', () => {
      const text =
        "Add the autocomplete attribute to this field. For example, 'on' or 'given-name'."
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })
})
