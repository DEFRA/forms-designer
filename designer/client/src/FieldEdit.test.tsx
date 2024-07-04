import {
  ComponentSubType,
  ComponentType,
  type ComponentDef,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { FieldEdit } from '~/src/FieldEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('Field Edit', () => {
  const selectedComponent = {
    name: 'IDDQl4',
    type: ComponentType.UkAddressField,
    title: 'UK address field',
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  } satisfies ComponentDef

  const data = {
    pages: [
      {
        title: 'First page',
        path: '/first-page',
        components: [selectedComponent]
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  afterEach(cleanup)

  test('Help text changes', () => {
    const { container } = render(
      <RenderWithContext data={data} state={{ selectedComponent }}>
        <FieldEdit />
      </RenderWithContext>
    )

    expect(container).toHaveTextContent('Enter the name to show for this field')

    expect(container).toHaveTextContent(
      'Enter the description to show for this field'
    )

    expect(container).toHaveTextContent(
      'Tick this box if you do not want the title to show on the page'
    )

    expect(container).toHaveTextContent(
      'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
    )

    expect(
      screen.getByText(
        'Tick this box if users do not need to complete this field to progress through the form'
      )
    ).toBeInTheDocument()
  })

  test('Content fields should not have optional checkbox', () => {
    const { container } = render(
      <RenderWithContext data={data} state={{ selectedComponent }}>
        <FieldEdit isContentField={true} />
      </RenderWithContext>
    )
    expect(container).toHaveTextContent('Enter the name to show for this field')

    expect(container).toHaveTextContent(
      'Enter the description to show for this field'
    )

    expect(container).toHaveTextContent(
      'Tick this box if you do not want the title to show on the page'
    )

    expect(container).toHaveTextContent(
      'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
    )

    expect(container).not.toHaveTextContent(
      'Tick this box if users do not need to complete this field to progress through the form'
    )
  })
})
