import {
  ComponentType,
  ControllerPath,
  ControllerType,
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
  conditions: []
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
    expect(list.children).toHaveLength(3)
  })
})
