import {
  ComponentType,
  ConditionType,
  OperatorName,
  type FormDefinition
} from '@defra/forms-model'
import { screen, within } from '@testing-library/dom'
import { act, cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { LinkCreate } from '~/src/LinkCreate.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('LinkEdit', () => {
  const data = {
    pages: [
      {
        path: '/1',
        title: 'Page 1',
        components: [
          {
            name: 'field1',
            title: 'Something',
            type: ComponentType.YesNoField,
            options: {},
            schema: {}
          }
        ],
        next: [{ path: '/2' }]
      },
      { path: '/2', title: 'Page 2' }
    ],
    lists: [],
    sections: [],
    conditions: [
      {
        name: 'someCondition',
        displayName: 'My condition',
        value: {
          name: 'My condition',
          conditions: [
            {
              field: {
                name: 'field1',
                display: 'Something',
                type: ComponentType.YesNoField
              },
              operator: OperatorName.Is,
              value: {
                type: ConditionType.Value,
                value: 'true',
                display: 'Yes'
              }
            }
          ]
        }
      },
      {
        name: 'anotherCondition',
        displayName: 'Another condition',
        value: {
          name: 'Another condition',
          conditions: [
            {
              field: {
                name: 'field1',
                display: 'Something',
                type: ComponentType.YesNoField
              },
              operator: OperatorName.Is,
              value: {
                type: ConditionType.Value,
                value: 'false',
                display: 'No'
              }
            }
          ]
        }
      }
    ]
  } satisfies FormDefinition

  afterEach(cleanup)

  test('Submitting with a condition updates the link', async () => {
    render(
      <RenderWithContext data={data}>
        <LinkCreate onSave={jest.fn} />
      </RenderWithContext>
    )

    await act(() => userEvent.click(screen.getByRole('button')))
    const summary = within(screen.getByRole('alert'))

    expect(summary.getByText('Enter from')).toBeInTheDocument()
    expect(summary.getByText('Enter to')).toBeInTheDocument()
  })
})
