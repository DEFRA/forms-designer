import {
  ComponentType,
  ConditionType,
  ControllerPath,
  ControllerType,
  OperatorName,
  type FormDefinition
} from '@defra/forms-model'
import { screen, within } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { LinkEdit } from '~/src/LinkEdit.jsx'
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

describe('LinkEdit', () => {
  test('hint text is rendered correctly', () => {
    const hint =
      'You can add links between different pages and set conditions for links to control the page that loads next. For example, a question page with a component for yes and no options could have link conditions based on which option a user selects.'

    render(
      <RenderWithContext data={data}>
        <LinkEdit onSave={jest.fn()} />
      </RenderWithContext>
    )

    expect(screen.getByText(hint)).toBeInTheDocument()
  })

  test('cannot add condition hint is rendered correctly', async () => {
    const hintText =
      'You cannot add any conditions as there are no components on the page you wish to link from. Add a component, such as an Input or a Selection field, and then add a condition.'

    render(
      <RenderWithContext data={data}>
        <LinkEdit onSave={jest.fn()} />
      </RenderWithContext>
    )

    const $source = screen.getByRole('combobox', { name: 'Link from' })
    await userEvent.selectOptions($source, data.pages[1].path)

    expect(screen.getByText(hintText)).toBeInTheDocument()
  })

  test('Renders from and to inputs with the correct options', () => {
    render(
      <RenderWithContext data={data}>
        <LinkEdit onSave={jest.fn()} />
      </RenderWithContext>
    )

    const $source = screen.getByRole('combobox', { name: 'Link from' })
    const $target = screen.getByRole('combobox', { name: 'Link to' })

    expect(within($source).getByText(data.pages[0].title)).toBeInTheDocument()
    expect(within($source).getByText(data.pages[1].title)).toBeInTheDocument()
    expect(within($target).getByText(data.pages[0].title)).toBeInTheDocument()
    expect(within($target).getByText(data.pages[1].title)).toBeInTheDocument()
  })

  test('Selecting a from value causes the SelectConditions component to be displayed', async () => {
    render(
      <RenderWithContext data={data}>
        <LinkEdit onSave={jest.fn()} />
      </RenderWithContext>
    )

    let $conditions = screen.queryByRole('link', {
      name: 'Add a new condition'
    })

    expect($conditions).not.toBeInTheDocument()

    const $source = screen.getByRole('combobox', { name: 'Link from' })
    await userEvent.selectOptions($source, '/first-page')

    $conditions = screen.getByRole('link', {
      name: 'Add a new condition'
    })

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
        <LinkEdit onSave={jest.fn()} />
      </RenderWithContext>
    )

    const $source = screen.getByRole('combobox', { name: 'Link from' })
    const $target = screen.getByRole('combobox', { name: 'Link to' })
    const $button = screen.getByRole('button', { name: 'Save' })

    await userEvent.selectOptions($source, '/first-page')
    await userEvent.selectOptions($target, '/summary')

    const $condition = screen.getByRole('combobox', {
      name: 'Select a condition'
    })

    await userEvent.selectOptions($condition, 'hasUKPassport')
    await userEvent.click($button)

    expect(save).toHaveBeenCalledTimes(1)

    expect(save.mock.calls[0]).toEqual(
      expect.arrayContaining<FormDefinition>([
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

    await userEvent.selectOptions($source, '/first-page')
    await userEvent.selectOptions($target, '/second-page')

    await userEvent.selectOptions($condition, '')
    await userEvent.click($button)

    expect(save).toHaveBeenCalledTimes(2)

    expect(save.mock.calls[1]).toEqual(
      expect.arrayContaining<FormDefinition>([
        {
          ...updated,
          pages: [
            expect.objectContaining({
              title: 'First page',
              path: '/first-page',

              // Paths are correctly generated
              next: [{ path: '/second-page' }]
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
  })

  test('Submitting without selecting to/from options shows the user an error', async () => {
    const save = jest.fn()

    render(
      <RenderWithContext data={data} save={save}>
        <LinkEdit onSave={jest.fn()} />
      </RenderWithContext>
    )

    await userEvent.click(screen.getByRole('button'))

    expect(save).not.toHaveBeenCalled()

    const summary = within(screen.getByRole('alert'))
    expect(summary.getByText('Enter link from')).toBeInTheDocument()
    expect(summary.getByText('Enter link to')).toBeInTheDocument()
  })
})
