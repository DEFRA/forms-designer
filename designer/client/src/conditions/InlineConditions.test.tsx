import { ComponentType, type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'

import { InlineConditions } from '~/src/conditions/InlineConditions.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('InlineConditions', () => {
  test('Strings are rendered correctly', () => {
    const props = {
      path: '/some-path',
      conditionsChange: jest.fn(),
      cancelCallback: jest.fn()
    }

    const data = {
      pages: [
        {
          title: 'page1',
          path: '/1',
          next: [{ path: '/2' }],
          components: []
        },
        {
          title: 'page2',
          path: '/2',
          components: [
            {
              name: 'field1',
              title: 'Something',
              type: ComponentType.TextField,
              options: {},
              schema: {}
            }
          ],
          next: [{ path: '/3' }]
        },
        {
          title: 'page3',
          path: '/3',
          next: [],
          components: [
            {
              name: 'field2',
              title: 'Something else',
              type: ComponentType.TextField,
              options: {},
              schema: {}
            },
            {
              name: 'field3',
              title: 'beep',
              type: ComponentType.TextField,
              options: {},
              schema: {}
            }
          ]
        }
      ],
      lists: [],
      sections: [],
      conditions: []
    } satisfies FormDefinition

    render(
      <RenderWithContext data={data}>
        <InlineConditions {...props} />
      </RenderWithContext>
    )

    const $addOrEditHint = screen.getByText(
      'Set the rules that determine the conditional behaviour in the form flow. For example, a question page might have a component for yes and no options that need two conditions – one to control what happens if a user selects yes and one for when a user selects no.'
    )

    const $displayNameHint = screen.getByText(
      'Set a condition name that is easy to recognise. It appears as an option in the settings menus for the pages, components and links in a form.'
    )

    const $hint = screen.getByText(
      'Set when a condition might be met in the form. For example, when the form asks a question and the user selects Yes instead of No (yes=true).'
    )

    expect($addOrEditHint).toBeInTheDocument()
    expect($displayNameHint).toBeInTheDocument()
    expect($hint).toBeInTheDocument()
  })
})
