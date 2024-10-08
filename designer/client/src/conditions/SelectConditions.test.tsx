import {
  ComponentType,
  ConditionType,
  OperatorName,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'

import { SelectConditions } from '~/src/conditions/SelectConditions.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('SelectConditions', () => {
  const data = {
    pages: [],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  let props: ConstructorParameters<typeof SelectConditions>[0]

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

    const $paragraphs = screen.getAllByRole('paragraph')
    const $conditions = screen.queryByRole('link', {
      name: 'Add a new condition'
    })

    expect($paragraphs).toHaveLength(1)
    expect($paragraphs[0]).toContainHTML('NoFieldsHintText')
    expect($conditions).not.toBeInTheDocument()
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
              options: {
                required: true
              }
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
          next: [],
          components: [
            {
              name: 'notEligible',
              title: '',
              type: ComponentType.Html,
              content:
                '<p class="govuk-body">If you still think you’re eligible please contact the Foreign and Commonwealth Office.</p>',
              options: {}
            }
          ]
        },
        {
          path: '/how-many-people',
          components: [
            {
              name: 'numberOfApplicants',
              title: 'How many applicants are there?',
              type: ComponentType.SelectField,
              list: 'numberOfApplicants',
              options: {
                classes: 'govuk-input--width-10',
                required: true
              }
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
      lists: [
        {
          name: 'numberOfApplicants',
          title: 'Number of applicants',
          type: 'string',
          items: [
            {
              text: '1',
              value: '1'
            },
            {
              text: '2',
              value: '2'
            },
            {
              text: '3',
              value: '3'
            }
          ]
        }
      ],
      sections: [],
      conditions: [
        {
          name: 'hasUKPassport',
          displayName: 'Do you have a UK passport?',
          value: {
            name: 'Do you have a UK passport?',
            conditions: [
              {
                field: {
                  name: 'ukPassport',
                  display: 'Do you have a UK passport?',
                  type: ComponentType.YesNoField
                },
                operator: OperatorName.Is,
                value: {
                  type: ConditionType.Value,
                  value: 'true',
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
            name: 'Do you have a UK passport?',
            conditions: [
              {
                field: {
                  name: 'ukPassport',
                  display: 'Do you have a UK passport?',
                  type: ComponentType.YesNoField
                },
                operator: OperatorName.Is,
                value: {
                  type: ConditionType.Value,
                  value: 'false',
                  display: 'No, I do not have a UK passport'
                }
              }
            ]
          }
        },
        {
          name: 'oneApplicant',
          displayName: 'oneApplicant',
          value: {
            name: 'How many applicants are there?',
            conditions: [
              {
                field: {
                  name: 'numberOfApplicants',
                  display: 'How many applicants are there?',
                  type: ComponentType.SelectField
                },
                operator: OperatorName.Is,
                value: {
                  type: ConditionType.Value,
                  value: '1',
                  display: '1'
                }
              }
            ]
          }
        },
        {
          name: 'twoApplicants',
          displayName: 'twoApplicants',
          value: {
            name: 'How many applicants are there?',
            conditions: [
              {
                field: {
                  name: 'numberOfApplicants',
                  display: 'How many applicants are there?',
                  type: ComponentType.SelectField
                },
                operator: OperatorName.Is,
                value: {
                  type: ConditionType.Value,
                  value: '2',
                  display: '2'
                }
              }
            ]
          }
        },
        {
          name: 'threeApplicants',
          displayName: 'threeApplicants',
          value: {
            name: 'How many applicants are there?',
            conditions: [
              {
                field: {
                  name: 'numberOfApplicants',
                  display: 'How many applicants are there?',
                  type: ComponentType.SelectField
                },
                operator: OperatorName.Is,
                value: {
                  type: ConditionType.Value,
                  value: '3',
                  display: '3'
                }
              }
            ]
          }
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

    const $paragraphs = screen.getAllByRole('paragraph')
    const $conditions = screen.getByRole('link', {
      name: 'Add a new condition'
    })

    expect($paragraphs).toHaveLength(1)
    expect($paragraphs[0]).not.toContainHTML('NoFieldsHintText')
    expect($conditions).toBeInTheDocument()

    expectedConditions.forEach((condition) => {
      expect(screen.getByText(condition)).toBeInTheDocument()
    })
  })
})
