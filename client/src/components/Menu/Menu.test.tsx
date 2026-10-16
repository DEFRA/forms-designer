import { Engine, type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { Menu } from '~/src/components/Menu/Menu.jsx'
import { RenderWithContext } from '~/test/helpers/renderers'

beforeAll(() => {
  document.documentElement.style.setProperty(
    '--govuk-breakpoint-tablet',
    '768px'
  )
})

describe('Menu', () => {
  const data = {
    pages: [],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  it('Renders button strings correctly', () => {
    render(
      <RenderWithContext data={data}>
        <Menu />
      </RenderWithContext>
    )

    expect(screen.getByText('Add page')).toBeInTheDocument()
    expect(screen.getByText('Add link')).toBeInTheDocument()
    expect(screen.getByText('Sections')).toBeInTheDocument()
    expect(screen.getByText('Conditions')).toBeInTheDocument()
    expect(screen.getByText('Lists')).toBeInTheDocument()
    expect(screen.getByText('Summary')).toBeInTheDocument()
  })

  it('Can open flyouts and close them', async () => {
    render(
      <RenderWithContext data={data}>
        <Menu />
      </RenderWithContext>
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const $buttonSummary = screen.getByRole('button', {
      name: 'Summary'
    })

    await userEvent.click($buttonSummary)

    const $dialog = screen.getByRole('dialog', {
      name: 'Edit summary'
    })

    expect($dialog).toBeInTheDocument()

    const $close = screen.getByRole('button', {
      name: 'Close'
    })

    await userEvent.click($close)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('clicking on a form overview tab shows different tab content', async () => {
    render(
      <RenderWithContext data={data}>
        <Menu />
      </RenderWithContext>
    )

    const $buttonFormOverview = screen.getByRole('button', {
      name: 'Form overview'
    })

    await userEvent.click($buttonFormOverview)

    const $dialog = screen.getByRole('dialog', {
      name: 'Form overview'
    })

    expect($dialog).toBeInTheDocument()

    const $tabs = screen.getAllByRole('tab')
    const $panels = screen.getAllByRole('tabpanel')

    // All tabs links are visible
    expect($tabs[0]).toBeVisible()
    expect($tabs[1]).toBeVisible()
    expect($tabs[2]).toBeVisible()
    expect($tabs[3]).toBeVisible()

    // Only first tab panel (Data model) is visible
    expect($panels[0]).not.toHaveClass('govuk-tabs__panel--hidden')
    expect($panels[1]).toHaveClass('govuk-tabs__panel--hidden')
    expect($panels[2]).toHaveClass('govuk-tabs__panel--hidden')
    expect($panels[3]).toHaveClass('govuk-tabs__panel--hidden')

    // Click JSON tab link
    await userEvent.click($tabs[1])

    // Only second tab panel (JSON) is visible
    expect($panels[0]).toHaveClass('govuk-tabs__panel--hidden')
    expect($panels[1]).not.toHaveClass('govuk-tabs__panel--hidden')
    expect($panels[2]).toHaveClass('govuk-tabs__panel--hidden')
    expect($panels[3]).toHaveClass('govuk-tabs__panel--hidden')
  })

  it('flyouts close on Save', async () => {
    const save = jest.fn()

    render(
      <RenderWithContext data={data} save={save}>
        <Menu />
      </RenderWithContext>
    )

    const $buttonSummary = screen.getByRole('button', {
      name: 'Summary'
    })

    await userEvent.click($buttonSummary)

    const $dialog = screen.getByRole('dialog', {
      name: 'Edit summary'
    })

    expect($dialog).toBeInTheDocument()

    const $buttonSave = screen.getByRole('button', {
      name: 'Save'
    })

    await userEvent.click($buttonSave)
    expect(save).toHaveBeenCalledTimes(1)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('Renders button strings correctly in V2', () => {
    render(
      <RenderWithContext data={{ engine: Engine.V2, ...data }}>
        <Menu />
      </RenderWithContext>
    )

    expect(screen.getByText('Add page')).toBeInTheDocument()
    expect(screen.getByText('Pages')).toBeInTheDocument()
    expect(screen.getByText('Sections')).toBeInTheDocument()
    expect(screen.getByText('Conditions')).toBeInTheDocument()
    expect(screen.getByText('Lists')).toBeInTheDocument()
    expect(screen.getByText('Summary')).toBeInTheDocument()
  })
})
