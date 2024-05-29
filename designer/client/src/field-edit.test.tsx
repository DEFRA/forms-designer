import { type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { FieldEdit } from '~/src/field-edit.jsx'
import { RenderWithContextAndDataContext } from '~/test/helpers/renderers.jsx'

describe('Field edit', () => {
  const { getByText } = screen

  const mockData: FormDefinition = {
    pages: [
      {
        title: 'First page',
        path: '/first-page',
        components: [],
        controller: './pages/summary.js',
        section: 'home'
      }
    ],
    lists: [],
    sections: [],
    conditions: [],
    outputs: []
  }

  let stateProps

  beforeEach(() => {
    stateProps = {
      component: {
        type: 'UkAddressField',
        name: 'UkAddressField',
        options: {}
      }
    }

    render(
      <RenderWithContextAndDataContext
        stateProps={stateProps}
        mockData={mockData}
      >
        <FieldEdit />
      </RenderWithContextAndDataContext>
    )
  })

  afterEach(cleanup)

  test('helpTextField should display display correct title', () => {
    const text = 'Help text (optional)'
    expect(getByText(text)).toBeInTheDocument()
  })

  test('helpTextField should display display correct helpText', () => {
    const text = 'Enter the description to show for this field'
    expect(getByText(text)).toBeInTheDocument()
  })

  test('hideOptionalTextOption should display display correct title', () => {
    const text = "Hide '(optional)' text"
    expect(getByText(text)).toBeInTheDocument()
  })

  test('hideOptionalTextOption should display display correct helpText', () => {
    const text =
      'Tick this box if you do not want the title to indicate that this field is optional'
    expect(getByText(text)).toBeInTheDocument()
  })

  test('hideTitleOption should display display correct title', () => {
    const text = 'Hide title'
    expect(getByText(text)).toBeInTheDocument()
  })

  test('hideTitleOption should display display correct helpText', () => {
    const text =
      'Tick this box if you do not want the title to show on the page'
    expect(getByText(text)).toBeInTheDocument()
  })

  test('titleField should display display correct title', () => {
    const text = 'Title'
    expect(getByText(text)).toBeInTheDocument()
  })

  test('titleField should display display correct helpText', () => {
    const text = 'Enter the name to show for this field'
    expect(getByText(text)).toBeInTheDocument()
  })

  test('componentOptionalOption should display display correct title', () => {
    const text = 'Make UK address field optional'
    expect(getByText(text)).toBeInTheDocument()
  })

  test('componentOptionalOption should display display correct helpText', () => {
    const text =
      'Tick this box if users do not need to complete this field to progress through the form'
    expect(getByText(text)).toBeInTheDocument()
  })

  test('componentNameField should display display correct title', () => {
    const text = 'Component name'
    expect(getByText(text)).toBeInTheDocument()
  })

  test('componentNameField should display display correct helpText', () => {
    const text =
      'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
    expect(getByText(text)).toBeInTheDocument()
  })
})
