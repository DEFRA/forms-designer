import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'

import { SectionEdit } from '~/src/section/SectionEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('Section edit fields', () => {
  it('should display title and hint text', () => {
    render(
      <RenderWithContext>
        <SectionEdit onSave={jest.fn()} />
      </RenderWithContext>
    )

    const $sectionTitle = screen.getByRole('textbox', {
      name: 'Section title',
      description:
        'Appears above the page title. However, if these titles are the same, the form will only show the page title.'
    })

    expect($sectionTitle).toBeInTheDocument()
  })
})
