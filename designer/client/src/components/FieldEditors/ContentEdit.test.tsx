import {
  ComponentType,
  type DetailsComponent,
  type FormDefinition,
  type HtmlComponent
} from '@defra/forms-model'
import { render } from '@testing-library/react'
import React from 'react'

import { ContentEdit } from '~/src/components/FieldEditors/ContentEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('ContentEdit', () => {
  const selectedComponent = {
    name: 'IDDQl4',
    title: 'abc',
    type: ComponentType.Html,
    content: '',
    options: {},
    schema: {}
  } as HtmlComponent | DetailsComponent

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

  it('should render with correct screen text', () => {
    const { container } = render(
      <RenderWithContext data={data} state={{ selectedComponent }}>
        <ContentEdit />
      </RenderWithContext>
    )

    expect(container).toHaveTextContent(
      'Enter the text you want to show. You can apply basic HTML, such as text formatting and hyperlinks.'
    )
  })

  it('should render with correct screen text (details only)', () => {
    selectedComponent.type = ComponentType.Details

    const { container } = render(
      <RenderWithContext data={data} state={{ selectedComponent }}>
        <ContentEdit />
      </RenderWithContext>
    )

    expect(container).toHaveTextContent(
      'Enter the text you want to show when users expand the title. You can apply basic HTML, such as text formatting and hyperlinks.'
    )
  })
})
