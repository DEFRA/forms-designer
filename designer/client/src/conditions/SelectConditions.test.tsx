import { type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render, type RenderResult } from '@testing-library/react'
import React from 'react'

import { DataContext } from '../context'

import SelectConditions from './SelectConditions'

describe('SelectConditions', () => {
  afterEach(cleanup)

  const { getByText, getByTestId, queryByText } = screen

  const data: FormDefinition = {
    lists: [],
    pages: [],
    sections: [],
    startPage: '',
    conditions: []
  }

  const dataValue = { data, save: jest.fn() }

  let props

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

  beforeEach(() => {
    props = {
      path: '/some-path',
      conditionsChange: jest.fn() as any,
      hints: [],
      noFieldsHintText: 'NoFieldsHintText'
    }
  })

  test('noFieldsAvailable hint text is rendered correctly', () => {
    customRender(<SelectConditions {...props} />)

    const hint = 'NoFieldsHintText'
    expect(getByText(hint)).toBeInTheDocument()
  })

  test('SelectConditions renders available conditions', () => {
    const data: FormDefinition = {
      lists: [],
      pages: [
        {
          path: '/uk-passport',
          components: [
            {
              type: 'YesNoField',
              name: 'ukPassport',
              title: 'Do you have a UK passport?',
              options: {
                required: true
              },
              schema: {}
            }
          ],
          next: [
            {
              path: '/how-many-people'
            },
            {
              path: '/no-uk-passport',
              condition: 'b-NGgWvGISkJJLuzsJIjv'
            }
          ],
          title: 'Do you have a UK passport?'
        },
        {
          path: '/no-uk-passport',
          title: "You're not eligible for this service",
          component: [
            {
              type: 'Para',
              content:
                "If you still think you're eligible please contact the Foreign and Commonwealth Office.",
              options: {
                required: true
              },
              schema: {}
            }
          ],
          next: []
        },
        {
          path: '/how-many-people',
          components: [
            {
              options: {
                classes: 'govuk-input--width-10',
                required: true
              },
              type: 'SelectField',
              name: 'numberOfApplicants',
              title: 'How many applicants are there?',
              list: 'numberOfApplicants'
            }
          ],
          next: [
            {
              path: '/applicant-one'
            }
          ],
          title: 'How many applicants are there?'
        }
      ],
      sections: [],
      startPage: '',
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
        },
        {
          name: 'moreThanOneApplicant',
          displayName: 'moreThanOneApplicant',
          value: 'applicantDetails.numberOfApplicants > 1'
        },
        {
          name: 'moreThanTwoApplicants',
          displayName: 'moreThanTwoApplicants',
          value: 'applicantDetails.numberOfApplicants > 2'
        },
        {
          name: 'moreThanThreeApplicants',
          displayName: 'moreThanThreeApplicants',
          value: 'applicantDetails.numberOfApplicants > 3'
        }
      ]
    }

    const providerProps = {
      data,
      save: jest.fn()
    }

    customRender(<SelectConditions />, providerProps)

    const expectedConditions = data.conditions.map(
      (condition) => condition.displayName
    )

    expect(
      queryByText('You cannot add any conditions as')
    ).not.toBeInTheDocument()
    expect(getByTestId('select-conditions')).toBeInTheDocument()

    expectedConditions.forEach((condition) => {
      expect(getByText(condition)).toBeInTheDocument()
    })
  })
})
