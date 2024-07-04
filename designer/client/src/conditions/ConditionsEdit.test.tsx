import {
  ComponentSubType,
  ComponentType,
  type ConditionRawData,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { act, cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { ConditionsEdit } from '~/src/conditions/ConditionsEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('ConditionsEdit', () => {
  const data = {
    pages: [
      {
        title: 'page1',
        path: '/1',
        next: [{ path: '/2' }]
      },
      {
        title: 'page2',
        path: '/2',
        components: [
          {
            name: 'field1',
            title: 'Something',
            type: ComponentType.TextField,
            subType: ComponentSubType.Field,
            options: {},
            schema: {}
          }
        ],
        next: [{ path: '/3' }]
      },
      {
        title: 'page3',
        path: '/3',
        components: [
          {
            name: 'field2',
            title: 'Something else',
            type: ComponentType.TextField,
            subType: ComponentSubType.Field,
            options: {},
            schema: {}
          },
          {
            name: 'field3',
            title: 'beep',
            type: ComponentType.TextField,
            subType: ComponentSubType.Field,
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

  afterEach(cleanup)

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
      name: 'abdefg',
      displayName: 'My condition',
      value: 'badgers'
    } satisfies ConditionRawData

    const condition2 = {
      name: 'abdefgh',
      displayName: 'My condition 2',
      value: 'badgers again'
    } satisfies ConditionRawData

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

      expect(screen.getByText(condition.displayName)).toBeInTheDocument()
      expect(screen.getByText(condition2.displayName)).toBeInTheDocument()
      expect(screen.queryByTestId('flyout-1')).not.toBeInTheDocument()
    })

    test('Clicking an edit link causes the edit view to be rendered and all other elements hidden', async () => {
      render(
        <RenderWithContext data={updated}>
          <ConditionsEdit />
        </RenderWithContext>
      )

      const $link = screen.getByText(condition.displayName)
      await act(() => userEvent.click($link))
      expect(screen.getByTestId('flyout-1')).toBeTruthy()
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

      const $listItem = screen.queryByTestId('conditions-list-items')
      expect($listItem).not.toBeInTheDocument()
    })

    test('Renders add new condition link if inputs are available', () => {
      render(
        <RenderWithContext data={updated}>
          <ConditionsEdit />
        </RenderWithContext>
      )

      expect(screen.queryByTestId('add-condition-link')).toBeInTheDocument()
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
