import { ComponentType } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { DateFieldEdit } from '~/src/components/FieldEditors/DateFieldEdit.jsx'
import {
  RenderWithContext,
  type RenderWithContextProps
} from '~/test/helpers/renderers.jsx'

describe('date field edit', () => {
  afterEach(cleanup)

  describe('date field edit fields', () => {
    let state: RenderWithContextProps['state']

    beforeEach(() => {
      state = {
        selectedComponent: {
          name: 'DateFieldEditClass',
          title: 'Date field edit class',
          hint: 'Date field hint',
          type: ComponentType.DatePartsField,
          options: {}
        }
      }

      render(
        <RenderWithContext state={state}>
          <DateFieldEdit />
        </RenderWithContext>
      )
    })

    test('should display details link title', () => {
      const text = 'Additional settings'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display future title', () => {
      const text = 'Max days in the future'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display future help text', () => {
      const text = 'Determines the latest date users can enter'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display past title', () => {
      const text = 'Max days in the past'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display past help text', () => {
      const text = 'Determines the earliest date users can enter'
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })
})
