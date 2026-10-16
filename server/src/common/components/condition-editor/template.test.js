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
      expect($buttons[0]).toHaveClass('govuk-button')
      expect($buttons[0]).toHaveTextContent('Save condition')
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
                  value: 'f453f07e-d636-404b-8792-e2e923c8032b',
                  items: [
                    {
                      components: [
                        {
                          type: 'RadiosField',
                          title: 'Hair colour',
                          name: 'CMhiZv',
                          shortDescription: 'Hair colour',
                          hint: '',
                          list: '1a822117-d981-4409-b264-c45534d03ee4',
                          options: { required: true },
                          schema: {},
                          id: '4d2f0222-dec1-481c-87cc-71aaa7e73379'
                        },
                        {
                          type: 'RadiosField',
                          title: 'Fave channel',
                          name: 'nhfAXA',
                          shortDescription: 'Fave channel',
                          hint: '',
                          list: 'f20442ba-587d-4467-8876-128c07dee207',
                          options: { required: true },
                          schema: {},
                          id: '715e2681-ef28-4501-a7bd-dcd6986ec13b'
                        }
                      ]
                    }
                  ]
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

      expect($conditionlists[0].innerHTML).toContain(
        '<option value="">Select a question</option>'
      )
      expect($conditionlists[0].innerHTML).toContain(
        '<option value="4d2f0222-dec1-481c-87cc-71aaa7e73379">Page : Hair colour</option>'
      )
      expect($conditionlists[0].innerHTML).toContain(
        '<option value="715e2681-ef28-4501-a7bd-dcd6986ec13b">Page : Fave channel</option>'
      )

      expect($conditionlists[1].innerHTML).toContain(
        '<option value="is" selected="">Is</option>'
      )
      expect($conditionlists[1].innerHTML).toContain(
        '<option value="is not">Is not</option>'
      )
    })
  })
})
