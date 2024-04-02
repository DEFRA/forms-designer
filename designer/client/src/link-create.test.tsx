import React from 'react'
import { FormDefinition } from '@defra/forms-model'
import {
  act,
  cleanup,
  render,
  type RenderResult,
  waitFor
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import LinkCreate from '~/src/link-create.js'
import { DataContext } from '~/src/context/index.js'
import { screen, within } from '@testing-library/dom'

const rawData: FormDefinition = {
  lists: [],
  pages: [
    {
      title: 'First page',
      path: '/first-page',
      components: [
        {
          type: 'YesNoField',
          name: 'ukPassport',
          title: 'Do you have a UK passport?',
          option: {
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
  sections: [],
  startPage: '',
  conditions: []
}

const data: FormDefinition = { ...rawData }
const dataValue = { data, save: jest.fn() }

function customRender(
  element: React.JSX.Element,
  providerProps = dataValue
): RenderResult {
  return render(
    <DataContext.Provider value={providerProps}>
      {element}
      <div id="portal-root" />
    </DataContext.Provider>
  )
}

afterEach(cleanup)

describe('LinkCreate', () => {
  const { getByRole, getByTestId, getByText, queryByTestId } = screen

  test('hint texts are rendered correctly', () => {
    const hint1 =
      'You can add links between different pages and set conditions for links to control the page that loads next. For example, a question page with a component for yes and no options could have link conditions based on which option a user selects.'
    const hint2 =
      'To add a link in the main screen, click and hold the title of a page and drag a line to the title of the page you want to link it to. To edit a link, select its line.'

    customRender(<LinkCreate />)
    expect(getByText(hint1)).toBeInTheDocument()
    expect(getByText(hint2)).toBeInTheDocument()
  })

  test('cannot add condition hint is rendered correctly', async () => {
    const hint =
      'You cannot add any conditions as there are no components on the page you wish to link from. Add a component, such as an Input or a Selection field, and then add a condition.'

    customRender(<LinkCreate />)

    const $source = getByTestId('link-source')
    await act(() => userEvent.selectOptions($source, data.pages[1].path))

    expect(getByText(hint)).toBeInTheDocument()
  })

  test('Renders from and to inputs with the correct options', () => {
    customRender(<LinkCreate />)

    const $source = getByTestId('link-source')
    const $target = getByTestId('link-target')

    expect(within($source).getByText(data.pages[0].title)).toBeInTheDocument()
    expect(within($source).getByText(data.pages[1].title)).toBeInTheDocument()
    expect(within($target).getByText(data.pages[0].title)).toBeInTheDocument()
    expect(within($target).getByText(data.pages[1].title)).toBeInTheDocument()
  })

  test('Selecting a from value causes the SelectConditions component to be displayed', async () => {
    customRender(<LinkCreate />)
    expect(queryByTestId('select-conditions')).toBeNull()

    const $source = getByTestId('link-source')
    await act(() => userEvent.selectOptions($source, '/first-page'))

    await waitFor(() => getByTestId('select-conditions'))
    const $conditions = getByTestId('select-conditions')

    expect($conditions).toBeInTheDocument()
  })

  test('links for older conditions are correctly generated when the form is submitted', async () => {
    const data: FormDefinition = {
      ...rawData,
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

    customRender(<LinkCreate />, {
      data,
      save
    })

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
    expect(save.mock.calls[0][0].pages[0].next).toContainEqual({
      path: '/summary',
      condition: 'hasUKPassport'
    })

    await act(() => userEvent.selectOptions($source, '/summary'))
    await act(() => userEvent.selectOptions($target, '/first-page'))
    await act(() => userEvent.selectOptions($condition, ''))
    await act(() => userEvent.click($button))

    expect(save).toHaveBeenCalledTimes(2)
    expect(save.mock.calls[1][0].pages[2].next).toContainEqual({
      path: '/first-page'
    })
  })

  test('links are correctly generated when the form is submitted', async () => {
    const data: FormDefinition = {
      ...rawData,
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
                  type: 'YesNoField',
                  display: 'Do you have a UK passport?'
                },
                operator: 'is',
                value: {
                  type: 'Value',
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
                  type: 'YesNoField',
                  display: 'Do you have a UK passport?'
                },
                operator: 'is',
                value: {
                  type: 'Value',
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

    customRender(<LinkCreate />, {
      data,
      save
    })

    const $source = getByTestId('link-source')
    const $target = getByTestId('link-target')
    const $button = getByRole('button')

    await act(() => userEvent.selectOptions($source, '/first-page'))
    await act(() => userEvent.selectOptions($target, '/summary'))

    await waitFor(() => getByTestId('select-condition'))
    const $condition = getByTestId('select-condition')

    await act(() => userEvent.selectOptions($condition, 'hasUKPassport'))
    await act(() => userEvent.click($button))

    expect(save).toHaveBeenCalledTimes(1)
    expect(save.mock.calls[0][0].pages[0].next).toContainEqual({
      path: '/summary',
      condition: 'hasUKPassport'
    })

    await act(() => userEvent.selectOptions($source, '/summary'))
    await act(() => userEvent.selectOptions($target, '/first-page'))
    await act(() => userEvent.selectOptions($condition, ''))
    await act(() => userEvent.click($button))

    expect(save).toHaveBeenCalledTimes(2)
    expect(save.mock.calls[1][0].pages[2].next).toContainEqual({
      path: '/first-page'
    })
  })

  test('Submitting without selecting to/from options shows the user an error', async () => {
    const data: FormDefinition = {
      ...rawData
    }
    const save = jest.fn()

    customRender(<LinkCreate />, {
      data,
      save
    })

    await act(() => userEvent.click(getByRole('button')))
    expect(save).not.toHaveBeenCalled()

    const summary = within(getByRole('alert'))
    expect(summary.getByText('Enter from')).toBeInTheDocument()
    expect(summary.getByText('Enter to')).toBeInTheDocument()
  })
})
