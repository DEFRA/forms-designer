import {
  OperatorName,
  ComponentType,
  ConditionType,
  type FormDefinition
} from '@defra/forms-model'
import { screen, within } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { LinkCreate } from '~/src/LinkCreate.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

const data = {
  pages: [
    {
      title: 'First page',
      path: '/first-page',
      components: [
        {
          name: 'ukPassport',
          title: 'Do you have a UK passport?',
          type: ComponentType.YesNoField,
          options: {
            required: true
          },
          schema: {}
        }
      ]
    },
    {
      title: 'Second page',
      path: '/second-page',
      components: []
    },
    {
      title: 'Summary',
      path: '/summary',
      controller: './pages/summary.js',
      components: []
    }
  ],
  lists: [],
  sections: [],
  conditions: []
} satisfies FormDefinition

afterEach(cleanup)

describe('LinkCreate', () => {
  test('hint text is rendered correctly', () => {
    const hint =
      'You can add links between different pages and set conditions for links to control the page that loads next. For example, a question page with a component for yes and no options could have link conditions based on which option a user selects.'

    render(
      <RenderWithContext data={data}>
        <LinkCreate />
      </RenderWithContext>
    )

    expect(screen.getByText(hint)).toBeInTheDocument()
  })

  test('cannot add condition hint is rendered correctly', async () => {
    const hintText =
      'You cannot add any conditions as there are no components on the page you wish to link from. Add a component, such as an Input or a Selection field, and then add a condition.'

    render(
      <RenderWithContext data={data}>
        <LinkCreate />
      </RenderWithContext>
    )

    const $source = screen.getByTestId('link-source')
    await act(() => userEvent.selectOptions($source, data.pages[1].path))

    expect(screen.getByText(hintText)).toBeInTheDocument()
  })

  test('Renders from and to inputs with the correct options', () => {
    render(
      <RenderWithContext data={data}>
        <LinkCreate />
      </RenderWithContext>
    )

    const $source = screen.getByTestId('link-source')
    const $target = screen.getByTestId('link-target')

    expect(within($source).getByText(data.pages[0].title)).toBeInTheDocument()
    expect(within($source).getByText(data.pages[1].title)).toBeInTheDocument()
    expect(within($target).getByText(data.pages[0].title)).toBeInTheDocument()
    expect(within($target).getByText(data.pages[1].title)).toBeInTheDocument()
  })

  test('Selecting a from value causes the SelectConditions component to be displayed', async () => {
    render(
      <RenderWithContext data={data}>
        <LinkCreate />
      </RenderWithContext>
    )

    expect(screen.queryByTestId('select-conditions')).toBeNull()

    const $source = screen.getByTestId('link-source')
    await act(() => userEvent.selectOptions($source, '/first-page'))

    await waitFor(() => screen.getByTestId('select-conditions'))
    const $conditions = screen.getByTestId('select-conditions')

    expect($conditions).toBeInTheDocument()
  })

  test('links are correctly generated when the form is submitted', async () => {
    const updated: FormDefinition = {
      ...data,
      conditions: [
        {
          name: 'hasUKPassport',
          displayName: 'hasUKPassport',
          value: {
            name: 'hasUKPassport',
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
                  value: 'yes',
                  display: 'Yes, I have a UK passport'
                }
              }
            ]
          }
        },
        {
          name: 'doesntHaveUKPassport',
          displayName: 'doesntHaveUKPassport',
          value: {
            name: 'doesntHaveUKPassport',
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
                  value: 'no',
                  display: 'No, I do not have a UK passport'
                }
              }
            ]
          }
        }
      ]
    }

    const save = jest.fn()

    render(
      <RenderWithContext data={updated} save={save}>
        <LinkCreate />
      </RenderWithContext>
    )

    const $source = screen.getByTestId('link-source')
    const $target = screen.getByTestId('link-target')
    const $button = screen.getByRole('button')

    await act(() => userEvent.selectOptions($source, '/first-page'))
    await act(() => userEvent.selectOptions($target, '/summary'))

    await waitFor(() => screen.getByTestId('select-condition'))
    const $condition = screen.getByTestId('select-condition')

    await act(() => userEvent.selectOptions($condition, 'hasUKPassport'))
    await act(() => userEvent.click($button))

    await waitFor(() => expect(save).toHaveBeenCalledTimes(1))

    expect(save.mock.calls[0]).toEqual(
      expect.arrayContaining([
        {
          ...updated,
          pages: [
            expect.objectContaining({
              title: 'First page',
              path: '/first-page',

              // Paths and conditions are correctly generated
              next: [{ path: '/summary', condition: 'hasUKPassport' }]
            }),
            expect.objectContaining({
              title: 'Second page',
              path: '/second-page'
            }),
            expect.objectContaining({
              title: 'Summary',
              path: '/summary'
            })
          ]
        }
      ])
    )

    await act(() => userEvent.selectOptions($source, '/summary'))
    await act(() => userEvent.selectOptions($target, '/first-page'))

    await act(() => userEvent.selectOptions($condition, ''))
    await act(() => userEvent.click($button))

    await waitFor(() => expect(save).toHaveBeenCalledTimes(2))

    expect(save.mock.calls[1]).toEqual(
      expect.arrayContaining([
        {
          ...updated,
          pages: [
            expect.objectContaining({
              title: 'First page',
              path: '/first-page'
            }),
            expect.objectContaining({
              title: 'Second page',
              path: '/second-page'
            }),
            expect.objectContaining({
              title: 'Summary',
              path: '/summary',

              // Paths are correctly generated
              next: [{ path: '/first-page' }]
            })
          ]
        }
      ])
    )
  })

  test('Submitting without selecting to/from options shows the user an error', async () => {
    const save = jest.fn()

    render(
      <RenderWithContext data={data} save={save}>
        <LinkCreate />
      </RenderWithContext>
    )

    await act(() => userEvent.click(screen.getByRole('button')))

    await waitFor(() => expect(save).not.toHaveBeenCalled())

    const summary = within(screen.getByRole('alert'))
    expect(summary.getByText('Enter from')).toBeInTheDocument()
    expect(summary.getByText('Enter to')).toBeInTheDocument()
  })
})
