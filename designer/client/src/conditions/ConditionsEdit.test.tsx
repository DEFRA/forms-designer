import { type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { act, cleanup, render, type RenderResult } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import ConditionsEdit from '~/src/conditions/ConditionsEdit.jsx'
import { DataContext, FlyoutContext } from '~/src/context/index.js'

const flyoutValue = {
  increment: jest.fn(),
  decrement: jest.fn(),
  count: 0
}
const data: FormDefinition = {
  pages: [
    { path: '/1', next: [{ path: '/2' }] },
    {
      path: '/2',
      components: [{ type: 'TextField', name: 'field1', title: 'Something' }],
      next: [{ path: '/3' }]
    },
    {
      path: '/3',
      components: [
        { type: 'TextField', name: 'field2', title: 'Something else' },
        { type: 'TextField', name: 'field3', title: 'beep' }
      ]
    }
  ],
  conditions: []
}

const dataValue = { data, save: jest.fn() }

function customRender(
  element: React.JSX.Element,
  providerProps = dataValue
): RenderResult {
  return render(
    <DataContext.Provider value={providerProps}>
      <FlyoutContext.Provider value={flyoutValue}>
        {element}
      </FlyoutContext.Provider>
      <div id="portal-root" />
    </DataContext.Provider>
  )
}

describe('ConditionsEdit', () => {
  afterEach(cleanup)

  const { getByTestId, getByText, queryByTestId } = screen

  describe('hint texts', () => {
    test('main hint text is correct', () => {
      customRender(<ConditionsEdit />)

      const hint =
        'Set conditions for components and links to control the flow of a form. For example, a question page with a component for yes and no options could have link conditions based on which option a user selects.'
      expect(getByText(hint)).toBeInTheDocument()
    })

    test('no field hint test is correct', () => {
      customRender(<ConditionsEdit />, {
        data: { pages: [], conditions: [] },
        save: jest.fn()
      })
      const hint =
        'You cannot add a condition as no components are available. Create a component on a page in the form. You can then add a condition.'
      expect(getByText(hint)).toBeInTheDocument()
    })
  })

  describe('with existing conditions', () => {
    const condition = {
      name: 'abdefg',
      displayName: 'My condition',
      value: 'badgers'
    }
    const condition2 = {
      name: 'abdefgh',
      displayName: 'My condition 2',
      value: 'badgers again'
    }

    const providerProps = {
      data: {
        ...data,
        conditions: [condition, condition2]
      },
      save: jest.fn()
    }

    test('Renders edit links for each condition and add new condition ', () => {
      customRender(<ConditionsEdit />, providerProps)
      expect(getByText(condition.displayName)).toBeInTheDocument()
      expect(getByText(condition2.displayName)).toBeInTheDocument()
      expect(queryByTestId('edit-conditions')).not.toBeInTheDocument()
    })

    test('Clicking an edit link causes the edit view to be rendered and all other elements hidden', async () => {
      customRender(<ConditionsEdit />, providerProps)
      const $link = getByText(condition.displayName)
      await act(() => userEvent.click($link))
      expect(getByTestId('edit-conditions')).toBeTruthy()
    })
  })

  describe('without existing conditions', () => {
    const providerProps = {
      data: { ...data, conditions: [] },
      save: jest.fn()
    }

    test('Renders no edit condition links', () => {
      customRender(<ConditionsEdit />, providerProps)

      const $listItem = queryByTestId('conditions-list-items')
      expect($listItem).not.toBeInTheDocument()
    })

    test('Renders add new condition link if inputs are available', () => {
      customRender(<ConditionsEdit />, providerProps)
      expect(queryByTestId('add-condition-link')).toBeInTheDocument()
    })

    test('Renders no new condition message if there are no inputs available', () => {
      customRender(<ConditionsEdit />, {
        data: { pages: [], conditions: [] },
        save: jest.fn()
      })

      const hint =
        'You cannot add a condition as no components are available. Create a component on a page in the form. You can then add a condition.'
      expect(getByText(hint)).toBeInTheDocument()
    })
  })
})
