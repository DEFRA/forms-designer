import {
  ComponentType,
  ConditionType,
  OperatorName,
  type ConditionWrapper,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { ConditionsEdit } from '~/src/conditions/ConditionsEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('ConditionsEdit', () => {
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
        next: [{ path: '/3' }],
        components: [
          {
            name: 'field1',
            title: 'Something',
            type: ComponentType.TextField,
            options: {},
            schema: {}
          }
        ]
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

  describe('hint texts', () => {
    test('main hint text is correct', () => {
      render(
        <RenderWithContext data={data}>
          <ConditionsEdit />
        </RenderWithContext>
      )

      const hint =
        'Set conditions for components and links to control the flow of a form. For example, a question page with a component for yes and no options could have link conditions based on which option a user selects.'
      expect(screen.getByText(hint)).toBeInTheDocument()
    })

    test('no field hint test is correct', () => {
      const updated: FormDefinition = {
        pages: [],
        lists: [],
        sections: [],
        conditions: []
      }

      render(
        <RenderWithContext data={updated}>
          <ConditionsEdit />
        </RenderWithContext>
      )

      const hint =
        'You cannot add a condition as no components are available. Create a component on a page in the form. You can then add a condition.'
      expect(screen.getByText(hint)).toBeInTheDocument()
    })
  })

  describe('with existing conditions', () => {
    const condition = {
      displayName: 'Badgers',
      name: 'isBadger',
      value: {
        name: 'Badgers',
        conditions: [
          {
            field: {
              name: 'name1',
              display: 'Name 1',
              type: ComponentType.TextField
            },
            operator: OperatorName.Is,
            value: {
              type: ConditionType.Value,
              value: 'badger',
              display: 'badger'
            }
          }
        ]
      }
    } satisfies ConditionWrapper

    const condition2 = {
      displayName: 'Kangaroos',
      name: 'isKangaroo',
      value: {
        name: 'Kangaroos',
        conditions: [
          {
            field: {
              name: 'name1',
              display: 'Name 1',
              type: ComponentType.TextField
            },
            operator: OperatorName.Is,
            value: {
              type: ConditionType.Value,
              value: 'kangaroo',
              display: 'kangaroo'
            }
          }
        ]
      }
    } satisfies ConditionWrapper

    const updated: FormDefinition = {
      ...data,
      conditions: [condition, condition2]
    }

    test('Renders edit links for each condition and add new condition', () => {
      render(
        <RenderWithContext data={updated}>
          <ConditionsEdit />
        </RenderWithContext>
      )

      const $link = screen.getByRole('link', {
        name: condition.displayName
      })

      const $link2 = screen.getByRole('link', {
        name: condition2.displayName
      })

      expect($link).toBeInTheDocument()
      expect($link2).toBeInTheDocument()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    test('Clicking an edit link causes the edit view to be rendered and all other elements hidden', async () => {
      render(
        <RenderWithContext data={updated}>
          <ConditionsEdit />
        </RenderWithContext>
      )

      const $link = screen.getByRole('link', {
        name: condition.displayName
      })

      await userEvent.click($link)

      const $dialog = screen.getByRole('dialog', {
        name: 'Add or edit condition'
      })

      expect($dialog).toBeInTheDocument()
    })
  })

  describe('without existing conditions', () => {
    const updated: FormDefinition = {
      ...data,
      conditions: []
    }

    render(
      <RenderWithContext data={updated}>
        <ConditionsEdit />
      </RenderWithContext>
    )

    test('Renders no edit condition links', () => {
      render(
        <RenderWithContext data={updated}>
          <ConditionsEdit />
        </RenderWithContext>
      )

      const $listItems = screen.queryAllByRole('listitem')
      expect($listItems).toHaveLength(0)
    })

    test('Renders add condition button if inputs are available', () => {
      render(
        <RenderWithContext data={updated}>
          <ConditionsEdit />
        </RenderWithContext>
      )

      const $button = screen.getByRole('button', {
        name: 'Add a new condition'
      })

      expect($button).toBeInTheDocument()
    })

    test('Renders no new condition message if there are no inputs available', () => {
      const updated: FormDefinition = {
        pages: [],
        lists: [],
        sections: [],
        conditions: []
      }

      render(
        <RenderWithContext data={updated}>
          <ConditionsEdit />
        </RenderWithContext>
      )

      const hint =
        'You cannot add a condition as no components are available. Create a component on a page in the form. You can then add a condition.'
      expect(screen.getByText(hint)).toBeInTheDocument()
    })
  })
})
