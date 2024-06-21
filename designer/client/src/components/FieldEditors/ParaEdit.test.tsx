import { ComponentType, type FormDefinition } from '@defra/forms-model'
import { render } from '@testing-library/react'
import React from 'react'

import { ParaEdit } from '~/src/components/FieldEditors/ParaEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('ParaEdit', () => {
  const data: FormDefinition = {
    pages: [
      {
        title: 'First page',
        path: '/first-page',
        components: [
          {
            name: 'IDDQl4',
            title: 'abc',
            type: ComponentType.Html,
            content: '',
            options: {},
            schema: {}
          }
        ]
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  }

  it('Should render with correct screen text', () => {
    const { container } = render(
      <RenderWithContext data={data}>
        <ParaEdit />
      </RenderWithContext>
    )

    expect(container).toHaveTextContent(
      'Enter the text you want to show. You can apply basic HTML, such as text formatting and hyperlinks.'
    )
  })
})
