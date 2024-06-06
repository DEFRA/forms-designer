import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { SectionEdit } from '~/src/section/SectionEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('Section edit fields', () => {
  afterEach(cleanup)

  const { getByText } = screen

  test('should display titles and help texts', () => {
    const stateProps = {
      component: {
        type: 'sectionFieldEdit',
        name: 'sectionFieldEditClass',
        options: {}
      }
    }

    render(
      <RenderWithContext stateProps={stateProps}>
        <SectionEdit />
      </RenderWithContext>
    )

    expect(getByText('Section title')).toBeInTheDocument()
    expect(
      getByText(
        'Appears above the page title. However, if these titles are the same, the form will only show the page title.'
      )
    ).toBeInTheDocument()
    expect(getByText('Section name')).toBeInTheDocument()
    expect(
      getByText(
        'Automatically populated. It does not show on the page. You usually do not need to change it unless an integration requires it. It must not contain spaces.'
      )
    ).toBeInTheDocument()
  })
})
