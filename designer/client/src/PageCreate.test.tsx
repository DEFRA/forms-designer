import { type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { PageCreate } from '~/src/PageCreate.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('page create fields text', () => {
  const data: FormDefinition = {
    pages: [],
    lists: [],
    sections: [],
    conditions: []
  }

  afterEach(cleanup)

  const { getByText } = screen

  test('displays field titles and help texts', () => {
    render(
      <RenderWithContext data={data}>
        <PageCreate />
      </RenderWithContext>
    )

    expect(getByText('Page type')).toBeInTheDocument()
    expect(
      getByText(
        'Select a Start Page to start a form, a Question Page to request information, and a Summary Page at the end of a section or form. For example, use a Summary to let users check their answers to questions before they submit the form.'
      )
    ).toBeInTheDocument()
    expect(getByText('Link from (optional)')).toBeInTheDocument()
    expect(
      getByText('Add a link to this page from a different page in the form.')
    ).toBeInTheDocument()
    expect(getByText('Page title')).toBeInTheDocument()
    expect(getByText('Path')).toBeInTheDocument()
    expect(
      getByText(
        "Appears in the browser path. The value you enter in the page title field automatically populates the path name. To override it, enter your own path name, relevant to the page, and use lowercase text and hyphens between words. For example, '/personal-details'."
      )
    ).toBeInTheDocument()
    expect(getByText('Section (optional)')).toBeInTheDocument()
    expect(
      getByText(
        'Use sections to split a form. For example, to add a section per applicant. The section title appears above the page title. However, if these titles are the same, the form will only show the page title.'
      )
    ).toBeInTheDocument()
  })
})

test.todo('Renders a form with the appropriate initial inputs')
test.todo('Inputs remain populated when amending other fields')
test.todo('editing the fields and submitting persists changes correctly')
test.todo('editing the title automatically generates a path')
