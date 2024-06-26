import { ComponentType, type ComponentDef } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import React from 'react'

import { TextFieldEdit } from '~/src/components/FieldEditors/TextFieldEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('Text field edit', () => {
  const { getByText } = screen

  describe('Text field edit fields', () => {
    let state

    beforeEach(() => {
      state = {
        selectedComponent: {
          name: 'TextFieldEditClass',
          title: 'Text field edit class',
          type: ComponentType.TextField,
          options: {},
          schema: {}
        } satisfies ComponentDef
      }

      render(
        <RenderWithContext state={state}>
          <TextFieldEdit />
        </RenderWithContext>
      )
    })

    test('should display details link title', () => {
      const text = 'Additional settings'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display min length title', () => {
      const text = 'Min length'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display min length help text', () => {
      const text = 'Specifies the minimum number of characters users can enter'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display max length title', () => {
      const text = 'Max length'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display max length help text', () => {
      const text = 'Specifies the maximum number of characters users can enter'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display length title', () => {
      const text = 'Length'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display length help text', () => {
      const text =
        'Specifies the exact character length users must enter. Using this setting negates any values you set for Min length or Max length.'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display regex title', () => {
      const text = 'Regex'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display regex help text', () => {
      const text =
        "Specifies a regular expression to validate users' inputs. Use JavaScript syntax."
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display autocomplete title', () => {
      const text = 'Autocomplete'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display autocomplete help text', () => {
      const text =
        "Add the autocomplete attribute to this field. For example, 'on' or 'given-name'."
      expect(getByText(text)).toBeInTheDocument()
    })
  })
})
