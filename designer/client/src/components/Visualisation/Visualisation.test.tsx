import { Engine, type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { Visualisation } from '~/src/components/Visualisation/Visualisation.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('Visualisation', () => {
  test('Graph is rendered with correct number of pages and updates', () => {
    const data = {
      pages: [
        {
          title: 'my first page',
          path: '/1',
          next: [],
          components: []
        },
        {
          title: 'my second page',
          path: '/2',
          next: [],
          components: []
        }
      ],
      lists: [],
      sections: [],
      conditions: []
    } satisfies FormDefinition

    render(
      <RenderWithContext data={data}>
        <Visualisation />
      </RenderWithContext>
    )

    expect(screen.queryByText('my first page')).toBeInTheDocument()
    expect(screen.queryByText('my second page')).toBeInTheDocument()
    expect(screen.queryByText('my third page')).not.toBeInTheDocument()

    const updated: FormDefinition = {
      ...data,
      pages: [
        ...data.pages,
        {
          title: 'my third page',
          path: '/3',
          next: [],
          components: []
        }
      ]
    }

    render(
      <RenderWithContext data={updated}>
        <Visualisation />
      </RenderWithContext>
    )

    expect(screen.queryByText('my third page')).toBeInTheDocument()
  })

  test('Links between pages are navigable via keyboard', async () => {
    const data = {
      pages: [
        {
          title: 'link source',
          path: '/link-source',
          next: [{ path: '/link-target' }],
          components: []
        },
        {
          title: 'link target',
          path: '/link-target',
          next: [],
          components: []
        }
      ],
      lists: [],
      sections: [],
      conditions: []
    } satisfies FormDefinition

    render(
      <RenderWithContext data={data}>
        <Visualisation />
      </RenderWithContext>
    )

    // Check link exists and has the expected label
    const $lineTitle = screen.getByText(
      'Edit link from link-source to link-target'
    )

    // Check that link works when selected with the enter key
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    $lineTitle.parentElement?.focus()
    await userEvent.keyboard('[Enter]')

    expect(
      screen.getByRole('dialog', {
        name: 'Edit link'
      })
    ).toBeInTheDocument()

    await userEvent.click(screen.getByText('Close'))

    // Check that link works when selected with the space key
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    $lineTitle.parentElement?.focus()
    await userEvent.keyboard('[Space]')

    expect(
      screen.queryByRole('dialog', {
        name: 'Edit link'
      })
    ).toBeInTheDocument()
  })

  test('Graph is rendered with correct number of pages and updates using V2 engine', () => {
    const data = {
      engine: Engine.V2,
      pages: [
        {
          title: 'my first page',
          path: '/1',
          next: [],
          components: []
        },
        {
          title: 'my second page',
          path: '/2',
          next: [],
          components: []
        }
      ],
      lists: [],
      sections: [],
      conditions: []
    } satisfies FormDefinition

    render(
      <RenderWithContext data={data}>
        <Visualisation />
      </RenderWithContext>
    )

    expect(screen.queryByText('my first page')).toBeInTheDocument()
    expect(screen.queryByText('my second page')).toBeInTheDocument()
    expect(screen.queryByText('my third page')).not.toBeInTheDocument()

    const updated: FormDefinition = {
      ...data,
      pages: [
        ...data.pages,
        {
          title: 'my third page',
          path: '/3',
          next: [],
          components: []
        }
      ]
    }

    render(
      <RenderWithContext data={updated}>
        <Visualisation />
      </RenderWithContext>
    )

    expect(screen.queryByText('my third page')).toBeInTheDocument()
  })

  test('Links between pages are inactive using V2 engine', () => {
    const data = {
      engine: Engine.V2,
      pages: [
        {
          title: 'link source',
          path: '/link-source',
          next: [{ path: '/link-target' }],
          components: []
        },
        {
          title: 'link target',
          path: '/link-target',
          next: [],
          components: []
        }
      ],
      lists: [],
      sections: [],
      conditions: []
    } satisfies FormDefinition

    render(
      <RenderWithContext data={data}>
        <Visualisation />
      </RenderWithContext>
    )

    // Check link title does not exist
    expect(
      screen.queryByText('Edit link from link-source to link-target')
    ).not.toBeInTheDocument()
  })
})
