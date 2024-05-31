import { afterEach, beforeEach, describe, expect, test } from '@jest/globals'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { DateFieldEdit } from '~/src/components/FieldEditors/date-field-edit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('date field edit', () => {
  afterEach(cleanup)

  const { getByText } = screen

  describe('date field edit fields', () => {
    let stateProps

    beforeEach(() => {
      stateProps = {
        component: {
          type: 'dateFieldEdit',
          name: 'dateFieldEditClass',
          options: {}
        }
      }

      render(
        <RenderWithContext stateProps={stateProps}>
          <DateFieldEdit />
        </RenderWithContext>
      )
    })

    test('should display details link title', () => {
      const text = 'Additional settings'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display future title', () => {
      const text = 'Max days in the future'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display future help text', () => {
      const text = 'Determines the latest date users can enter'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display past title', () => {
      const text = 'Max days in the past'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display past help text', () => {
      const text = 'Determines the earliest date users can enter'
      expect(getByText(text)).toBeInTheDocument()
    })
  })
})
