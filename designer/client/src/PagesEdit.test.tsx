import {
  ComponentType,
  ConditionType,
  ControllerPath,
  ControllerType,
  OperatorName,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'

import { PagesEdit } from '~/src/PagesEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

const data = {
  pages: [
    {
      title: 'First page',
      path: '/first-page',
      next: [],
      components: [
        {
          name: 'ukPassport',
          title: 'Do you have a UK passport?',
          type: ComponentType.YesNoField,
          options: {
            required: true
          }
        }
      ]
    },
    {
      title: 'Second page',
      path: '/second-page',
      controller: ControllerType.Terminal,
      next: [],
      components: [],
      condition: 'VHfpoC'
    },
    {
      title: 'Third page',
      path: '/third-page',
      controller: ControllerType.Repeat,
      repeat: {
        options: { name: 'pizza', title: 'Pizza' },
        schema: { min: 1, max: 4 }
      },
      next: [],
      components: []
    },
    {
      title: 'Summary',
      path: ControllerPath.Summary,
      controller: ControllerType.Summary
    }
  ],
  lists: [],
  sections: [],
  conditions: [
    {
      name: 'VHfpoC',
      displayName: 'Do you have a UK passport?',
      value: {
        name: 'Do you have a UK passport?',
        conditions: [
          {
            field: {
              name: 'ukPassport',
              type: ComponentType.YesNoField,
              display: 'Do you have a UK passport?'
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

describe('PagesEdit', () => {
  test('Results are rendered correctly', () => {
    render(
      <RenderWithContext data={data}>
        <PagesEdit onSave={jest.fn()} />
      </RenderWithContext>
    )

    const list = screen.getByRole('list')

    expect(list).toBeInTheDocument()
    expect(list.children).toHaveLength(4)
  })
})
