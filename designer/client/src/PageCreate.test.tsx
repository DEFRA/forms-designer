import { type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { PageCreate } from '~/src/PageCreate.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('page create fields text', () => {
  const data = {
    pages: [],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  afterEach(cleanup)

  test('displays field titles and help texts', () => {
    render(
      <RenderWithContext data={data}>
        <PageCreate onSave={jest.fn()} />
      </RenderWithContext>
    )

    const $pageTypeLabel = screen.getByText('Page type')
    const $pageTypeContent = screen.getByText(
      'Select a Start Page to start a form, a Question Page to request information, and a Summary Page at the end of a section or form. For example, use a Summary to let users check their answers to questions before they submit the form.'
    )

    expect($pageTypeLabel).toBeInTheDocument()
    expect($pageTypeContent).toBeInTheDocument()

    const $linkFromLabel = screen.getByText('Link from (optional)')
    const $linkFromContent = screen.getByText(
      'Add a link to this page from a different page in the form'
    )

    expect($linkFromLabel).toBeInTheDocument()
    expect($linkFromContent).toBeInTheDocument()

    const $pageTitleLabel = screen.getByText('Page title')

    expect($pageTitleLabel).toBeInTheDocument()

    const $pathLabel = screen.getByText('Path')
    const $pathContent = screen.getByText(
      'Appears in the browser path. The value you enter in the page title field automatically populates the path name. To override it, enter your own path name, relevant to the page, and use lowercase text and hyphens between words. For example, ‘/personal-details’'
    )

    expect($pathLabel).toBeInTheDocument()
    expect($pathContent).toBeInTheDocument()

    const $sectionLabel = screen.getByText('Section (optional)')
    const $sectionContent = screen.getByText(
      'Use sections to split a form. For example, to add a section per applicant. The section title appears above the page title. However, if these titles are the same, the form will only show the page title.'
    )

    expect($sectionLabel).toBeInTheDocument()
    expect($sectionContent).toBeInTheDocument()
  })
})

test.todo('Renders a form with the appropriate initial inputs')
test.todo('Inputs remain populated when amending other fields')
test.todo('editing the fields and submitting persists changes correctly')
test.todo('editing the title automatically generates a path')
