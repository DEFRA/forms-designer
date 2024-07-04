import {
  ComponentType,
  ComponentSubType,
  type ComponentDef,
  type FormDefinition
} from '@defra/forms-model'
import { render } from '@testing-library/react'
import React from 'react'

import { ParaEdit } from '~/src/components/FieldEditors/ParaEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('ParaEdit', () => {
  const selectedComponent = {
    name: 'IDDQl4',
    title: 'abc',
    type: ComponentType.Html,
    subType: ComponentSubType.Content,
    content: '',
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

  it('Should render with correct screen text', () => {
    const { container } = render(
      <RenderWithContext data={data} state={{ selectedComponent }}>
        <ParaEdit />
      </RenderWithContext>
    )

    expect(container).toHaveTextContent(
      'Enter the text you want to show. You can apply basic HTML, such as text formatting and hyperlinks.'
    )
  })
})
