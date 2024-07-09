import { ComponentSubType, ComponentType } from '@defra/forms-model'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { DetailsEdit } from '~/src/components/FieldEditors/DetailsEdit.jsx'
import {
  RenderWithContext,
  type RenderWithContextProps
} from '~/test/helpers/renderers.jsx'

describe('Details edit', () => {
  const state: RenderWithContextProps['state'] = {
    selectedComponent: {
      name: 'TextFieldEditClass',
      title: 'Text field edit class',
      type: ComponentType.Details,
      subType: ComponentSubType.Content,
      content: '',
      options: {},
      schema: {}
    }
  }

  afterEach(cleanup)

  it('Should render with correct screen text', () => {
    const { container } = render(
      <RenderWithContext state={state}>
        <DetailsEdit />
      </RenderWithContext>
    )

    expect(container).toHaveTextContent(
      'Enter the name to show for this component'
    )

    expect(container).toHaveTextContent(
      'Enter the text you want to show when users expand the title. You can apply basic HTML, such as text formatting and hyperlinks.'
    )
  })
})
