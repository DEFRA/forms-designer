import {
  OperatorName,
  ComponentType,
  ConditionType,
  type FormDefinition
} from '@defra/forms-model'
import { screen, within } from '@testing-library/dom'
import {
  act,
  cleanup,
  render,
  waitFor,
  type RenderResult
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React, { type ReactElement } from 'react'

import { LinkCreate } from '~/src/LinkCreate.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

const data: FormDefinition = {
  pages: [
    {
      title: 'First page',
      path: '/first-page',
      components: [
        {
          type: ComponentType.YesNoField,
          name: 'ukPassport',
          title: 'Do you have a UK passport?',
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
}

afterEach(cleanup)

describe('LinkCreate', () => {
  const { getByRole, getByTestId, getByText, queryByTestId } = screen

  test('hint text is rendered correctly', () => {
    const hint =
      'You can add links between different pages and set conditions for links to control the page that loads next. For example, a question page with a component for yes and no options could have link conditions based on which option a user selects.'

    render(
      <RenderWithContext data={data}>
        <LinkCreate />
      </RenderWithContext>
    )

    expect(getByText(hint)).toBeInTheDocument()
  })

  test('cannot add condition hint is rendered correctly', async () => {
    const hint =
      'You cannot add any conditions as there are no components on the page you wish to link from. Add a component, such as an Input or a Selection field, and then add a condition.'

    render(
      <RenderWithContext data={data}>
        <LinkCreate />
      </RenderWithContext>
    )

    const $source = getByTestId('link-source')
    await act(() => userEvent.selectOptions($source, data.pages[1].path))

    expect(getByText(hint)).toBeInTheDocument()
  })

  test('Renders from and to inputs with the correct options', () => {
    render(
      <RenderWithContext data={data}>
        <LinkCreate />
      </RenderWithContext>
    )

    const $source = getByTestId('link-source')
    const $target = getByTestId('link-target')

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

    expect(queryByTestId('select-conditions')).toBeNull()

    const $source = getByTestId('link-source')
    await act(() => userEvent.selectOptions($source, '/first-page'))

    await waitFor(() => getByTestId('select-conditions'))
    const $conditions = getByTestId('select-conditions')

    expect($conditions).toBeInTheDocument()
  })

  test('links for older conditions are correctly generated when the form is submitted', async () => {
    const updated: FormDefinition = {
      ...data,
      conditions: [
        {
          name: 'hasUKPassport',
          displayName: 'hasUKPassport',
          value: 'checkBeforeYouStart.ukPassport==true'
        },
        {
          name: 'doesntHaveUKPassport',
          displayName: 'doesntHaveUKPassport',
          value: 'checkBeforeYouStart.ukPassport==false'
        }
      ]
    }

    const save = jest.fn()

    render(
      <RenderWithContext data={updated} save={save}>
        <LinkCreate />
      </RenderWithContext>
    )

    const $source = getByTestId('link-source')
    const $target = getByTestId('link-target')
    const $button = getByRole('button')

    await act(() => userEvent.selectOptions($source, '/first-page'))
    await act(() => userEvent.selectOptions($target, '/summary'))

    await waitFor(() => getByTestId('select-condition'))
    const $condition = getByTestId('select-condition')

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

    const $source = getByTestId('link-source')
    const $target = getByTestId('link-target')
    const $button = getByRole('button')

    await act(() => userEvent.selectOptions($source, '/first-page'))
    await act(() => userEvent.selectOptions($target, '/summary'))

    await waitFor(() => getByTestId('select-condition'))
    const $condition = getByTestId('select-condition')

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

    await act(() => userEvent.click(getByRole('button')))

    await waitFor(() => expect(save).not.toHaveBeenCalled())

    const summary = within(getByRole('alert'))
    expect(summary.getByText('Enter from')).toBeInTheDocument()
    expect(summary.getByText('Enter to')).toBeInTheDocument()
  })
})
