import {
  ComponentSubType,
  ComponentType,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import {
  SelectConditions,
  type Props
} from '~/src/conditions/SelectConditions.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('SelectConditions', () => {
  afterEach(cleanup)

  const data = {
    pages: [],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  let props: Props

  beforeEach(() => {
    props = {
      path: '/some-path',
      conditionsChange: jest.fn(),
      noFieldsHintText: 'NoFieldsHintText'
    }
  })

  test('noFieldsAvailable hint text is rendered correctly', () => {
    render(
      <RenderWithContext data={data}>
        <SelectConditions {...props} />
      </RenderWithContext>
    )

    const hint = 'NoFieldsHintText'
    expect(screen.getByText(hint)).toBeInTheDocument()
  })

  test('SelectConditions renders available conditions', () => {
    const data = {
      pages: [
        {
          path: '/uk-passport',
          components: [
            {
              name: 'ukPassport',
              title: 'Do you have a UK passport?',
              type: ComponentType.YesNoField,
              subType: ComponentSubType.Field,
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
          components: [
            {
              name: 'notEligible',
              title: '',
              type: ComponentType.Html,
              subType: ComponentSubType.Content,
              content:
                '<p class="govuk-body">If you still think you’re eligible please contact the Foreign and Commonwealth Office.</p>',
              options: {},
              schema: {}
            }
          ],
          next: []
        },
        {
          path: '/how-many-people',
          components: [
            {
              name: 'numberOfApplicants',
              title: 'How many applicants are there?',
              type: ComponentType.SelectField,
              subType: ComponentSubType.ListField,
              list: 'numberOfApplicants',
              options: {
                classes: 'govuk-input--width-10',
                required: true
              },
              schema: {}
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
      lists: [],
      sections: [],
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
    } satisfies FormDefinition

    props = {
      conditionsChange: jest.fn(),
      noFieldsHintText: 'NoFieldsHintText'
    }

    render(
      <RenderWithContext data={data}>
        <SelectConditions {...props} />
      </RenderWithContext>
    )

    const expectedConditions = data.conditions.map(
      (condition) => condition.displayName
    )

    const $hint = screen.queryByText('You cannot add any conditions as')
    const $select = screen.getByTestId('select-conditions')

    expect($hint).not.toBeInTheDocument()
    expect($select).toBeInTheDocument()

    expectedConditions.forEach((condition) => {
      expect(screen.getByText(condition)).toBeInTheDocument()
    })
  })
})
