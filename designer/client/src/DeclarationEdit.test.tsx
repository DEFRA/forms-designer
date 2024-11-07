import { type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render, type RenderResult } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { DeclarationEdit } from '~/src/DeclarationEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('Declaration Edit', () => {
  let onSave: jest.Mock
  let save: jest.Mock

  let data: FormDefinition
  let result: RenderResult

  beforeEach(() => {
    onSave = jest.fn()
    save = jest.fn()

    data = {
      pages: [],
      lists: [],
      sections: [],
      conditions: []
    }

    result = render(
      <RenderWithContext data={data} save={save}>
        <DeclarationEdit onSave={onSave} />
      </RenderWithContext>
    )
  })

  it('should render textarea', () => {
    const $textarea = screen.getByRole('textbox', {
      name: 'Declaration',
      description:
        'The declaration can include HTML and the `govuk-prose-scope` css class is available. Use this on a wrapping element to apply default govuk styles.'
    })

    expect($textarea).toBeInTheDocument()
    expect($textarea).toHaveValue('')
  })

  it('should render textarea with existing declaration', () => {
    result.unmount()

    const updated = structuredClone(data)
    updated.declaration = 'I do solemnly declare'

    render(
      <RenderWithContext data={updated} save={save}>
        <DeclarationEdit onSave={onSave} />
      </RenderWithContext>
    )

    const $textarea = screen.getByRole('textbox', { name: 'Declaration' })
    expect($textarea).toHaveValue(updated.declaration)
  })

  it('should render save button', () => {
    const $button = screen.getByRole('button', { name: 'Save' })
    expect($button).toBeInTheDocument()
  })

  it('should save definition without empty declaration', async () => {
    const $button = screen.getByRole('button', { name: 'Save' })
    await userEvent.click($button)

    expect(onSave).toHaveBeenCalled()
    expect(save).toHaveBeenCalledWith(data)
  })

  it('should save definition without updated declaration', async () => {
    const $textarea = screen.getByRole('textbox', { name: 'Declaration' })
    const $button = screen.getByRole('button', { name: 'Save' })

    await userEvent.type($textarea, 'I do solemnly declare')
    await userEvent.click($button)

    const updated = structuredClone(data)
    updated.declaration = 'I do solemnly declare'

    expect(onSave).toHaveBeenCalled()
    expect(save).toHaveBeenCalledWith(updated)
  })
})
