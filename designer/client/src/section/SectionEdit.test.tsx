import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { SectionEdit } from '~/src/section/SectionEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('Section edit fields', () => {
  afterEach(cleanup)

  test('should display titles and help texts', () => {
    render(
      <RenderWithContext>
        <SectionEdit />
      </RenderWithContext>
    )

    const $sectionTitleLabel = screen.getByText('Section title')
    const $sectionTitleContent = screen.getByText(
      'Appears above the page title. However, if these titles are the same, the form will only show the page title.'
    )

    expect($sectionTitleLabel).toBeInTheDocument()
    expect($sectionTitleContent).toBeInTheDocument()

    const $sectionNameLabel = screen.getByText('Section name')
    const $sectionNameContent = screen.getByText(
      'Automatically populated. It does not show on the page. You usually do not need to change it unless an integration requires it. It must not contain spaces.'
    )

    expect($sectionNameLabel).toBeInTheDocument()
    expect($sectionNameContent).toBeInTheDocument()
  })
})
