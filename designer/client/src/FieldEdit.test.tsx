import { ComponentType, type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { FieldEdit } from '~/src/FieldEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('Field Edit', () => {
  const { getByText } = screen

  const data: FormDefinition = {
    pages: [
      {
        title: 'First page',
        path: '/first-page',
        components: [
          {
            name: 'IDDQl4',
            title: 'abc',
            list: 'myList',
            type: ComponentType.List,
            options: {
              required: true
            },
            schema: {}
          }
        ]
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  }

  afterEach(cleanup)

  test('Help text changes', () => {
    const { container } = render(
      <RenderWithContext data={data}>
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
      getByText(
        'Tick this box if users do not need to complete this field to progress through the form'
      )
    ).toBeInTheDocument()
  })

  test('Content fields should not have optional checkbox', () => {
    const { container } = render(
      <RenderWithContext data={data}>
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
