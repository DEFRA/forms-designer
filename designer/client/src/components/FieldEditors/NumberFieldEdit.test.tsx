import { ComponentType, type ComponentDef } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { NumberFieldEdit } from '~/src/components/FieldEditors/NumberFieldEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('Number field edit', () => {
  afterEach(cleanup)

  describe('Number field edit fields', () => {
    const { getByText } = screen

    let stateProps

    beforeEach(() => {
      stateProps = {
        component: {
          name: 'NumberFieldEditClass',
          title: 'Number field edit class',
          hint: 'Number field hint',
          type: ComponentType.NumberField,
          options: {},
          schema: {}
        } satisfies ComponentDef
      }

      render(
        <RenderWithContext stateProps={stateProps}>
          <NumberFieldEdit />
        </RenderWithContext>
      )
    })

    test('should display details link title', () => {
      const text = 'Additional settings'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display min title', () => {
      const text = 'Min'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display min help text', () => {
      const text = 'Specifies the lowest number users can enter'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display max title', () => {
      const text = 'Max'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display max help text', () => {
      const text = 'Specifies the highest number users can enter'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display precision title', () => {
      const text = 'Precision'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display precision help text', () => {
      const text =
        'Specifies the number of decimal places users can enter. For example, to allow users to enter numbers with up to two decimal places, set this to 2'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display prefix help text', () => {
      const text = 'Specifies the prefix of the field.'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display suffix help text', () => {
      const text = 'Specifies the suffix of the field.'
      expect(getByText(text)).toBeInTheDocument()
    })
  })
})
