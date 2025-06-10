import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Condition editor component', () => {
  let $buttons = /** @type {Element[]} */ ([])
  let $conditionlists = /** @type {Element[]} */ ([])

  describe('With no conditions', () => {
    beforeEach(() => {
      const { container } = renderMacro(
        'appConditionEditor',
        'condition-editor/macro.njk',
        {
          params: {
            conditionFieldsList: [],
            displayNameField: {}
          }
        }
      )

      $buttons = container.getAllByRole('button')
      $conditionlists = container.queryAllByRole('select')
    })

    it('should render button only', () => {
      expect($buttons[0]).toHaveClass('govuk-button govuk-button--inverse')
      expect($buttons[0]).toHaveTextContent('Add another condition')
      expect($conditionlists).toHaveLength(0)
    })
  })

  describe('With single condition of string value', () => {
    beforeEach(() => {
      const { container } = renderMacro(
        'appConditionEditor',
        'condition-editor/macro.njk',
        {
          params: {
            conditionFieldsList: [
              {
                component: {
                  id: 'items[0].componentId',
                  name: 'items[0][componentId]',
                  value: 'f453f07e-d636-404b-8792-e2e923c8032b'
                },
                operator: {
                  id: 'items[0].operator',
                  name: 'items[0][operator]',
                  label: {
                    text: 'Condition type'
                  },
                  items: [
                    { text: 'Is', value: 'is' },
                    { text: 'Is not', value: 'is not' }
                  ],
                  value: 'is'
                },
                value: {
                  id: 'items[0].value',
                  name: 'items[0][value][value]',
                  label: {
                    text: 'Enter a value'
                  },
                  classes: 'govuk-input--width-10',
                  value: 'John'
                },
                conditionType: 'StringValue',
                idField: {
                  id: 'id',
                  name: 'items[0][id]',
                  value: '73b96025-dcce-47fc-b120-5b26ae3f675c'
                },
                listId: undefined,
                conditionTypeName: 'items[0][value][type]',
                listIdName: ''
              }
            ],
            displayNameField: {
              id: 'displayName',
              name: 'displayName',
              label: {
                text: 'Condition name'
              },
              classes: 'govuk-input--width-20',
              value: 'My condition1',
              hint: {
                text: 'Display name hint'
              }
            }
          }
        }
      )

      $buttons = container.getAllByRole('button')
      $conditionlists = container.queryAllByRole('combobox')
    })

    it('should render select lists', () => {
      expect($buttons[0]).toHaveClass(
        'govuk-button govuk-!-margin-bottom-0 govuk-!-margin-left-3'
      )
      expect($buttons[0]).toHaveTextContent('Select')
      expect($conditionlists).toHaveLength(2)
    })
  })
})
