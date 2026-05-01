import { ConditionType, OperatorName } from '@defra/forms-model'
import { buildQuestionPage, buildTextFieldComponent  } from '@defra/forms-model/stubs'

import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import { getPaymentConditionalAmountsViewModel } from '~/src/models/forms/editor-v2/payment-conditional-amounts.js'

const componentId = 'test-field'
const testComponent = buildTextFieldComponent({
  id: componentId,
  name: 'testField',
  title: 'Test Field'
})

/**
 * @param {string} id
 * @param {string} displayName
 * @param {string} value
 * @returns {import('@defra/forms-model').ConditionWrapperV2}
 */
const condition = (id, displayName, value) => ({
  id,
  displayName,
  items: [
    {
      id: `${id}-item`,
      componentId,
      operator: OperatorName.Is,
      type: ConditionType.StringValue,
      value
    }
  ]
})

const baseDefinition = buildDefinition({
  pages: [buildQuestionPage({ components: [testComponent] })],
  conditions: [
    condition('c2', 'NotFarmer', 'no'),
    condition('c1', 'IsFarmer', 'yes')
  ]
})

describe('getPaymentConditionalAmountsViewModel', () => {
  it('returns empty tiles and a collapsed editRow when state is empty', () => {
    const result = getPaymentConditionalAmountsViewModel({
      definition: baseDefinition,
      state: { conditionalAmounts: [] }
    })
    expect(result.tiles).toEqual([])
    expect(result.editRow.expanded).toBe(false)
    expect(result.editRowIndex).toBe(0)
  })

  it('returns empty tiles and a collapsed editRow when state is undefined', () => {
    const result = getPaymentConditionalAmountsViewModel({
      definition: baseDefinition,
      state: undefined
    })
    expect(result.tiles).toEqual([])
    expect(result.editRow.expanded).toBe(false)
  })

  it('renders one tile per state entry with sequential index and formatted amount', () => {
    const result = getPaymentConditionalAmountsViewModel({
      definition: baseDefinition,
      state: {
        conditionalAmounts: [
          { id: 'a1', amount: 300, condition: 'c1' },
          { id: 'a2', amount: 500, condition: 'c2' }
        ]
      }
    })
    expect(result.tiles).toHaveLength(2)
    expect(result.tiles[0]).toMatchObject({
      index: 1,
      id: 'a1',
      amount: 300,
      amountFormatted: '£300.00',
      conditionId: 'c1',
      conditionDisplayName: 'IsFarmer'
    })
    expect(result.tiles[0].conditionExpression).toEqual(expect.any(String))
    expect(result.tiles[0].conditionExpression.length).toBeGreaterThan(0)
    expect(result.tiles[1]).toMatchObject({
      index: 2,
      id: 'a2',
      conditionDisplayName: 'NotFarmer'
    })
  })

  it('falls back to the conditionId when the condition no longer exists', () => {
    const result = getPaymentConditionalAmountsViewModel({
      definition: baseDefinition,
      state: {
        conditionalAmounts: [{ id: 'a1', amount: 1, condition: 'c-orphan' }]
      }
    })
    expect(result.tiles[0]).toMatchObject({
      conditionId: 'c-orphan',
      conditionDisplayName: 'c-orphan',
      conditionExpression: ''
    })
  })

  it('builds conditionsForDropdown sorted alphabetically by displayName', () => {
    const result = getPaymentConditionalAmountsViewModel({
      definition: baseDefinition,
      state: { conditionalAmounts: [] }
    })
    expect(result.conditionsForDropdown.map((o) => o.text)).toEqual([
      'IsFarmer',
      'NotFarmer'
    ])
    expect(result.conditionsForDropdown.map((o) => o.value)).toEqual([
      'c1',
      'c2'
    ])
  })

  it('editRowIndex matches the position of the row being edited', () => {
    const result = getPaymentConditionalAmountsViewModel({
      definition: baseDefinition,
      state: {
        conditionalAmounts: [
          { id: 'a1', amount: 1, condition: 'c1' },
          { id: 'a2', amount: 2, condition: 'c2' }
        ],
        conditionalAmountEditRow: {
          expanded: true,
          id: 'a2',
          amount: 2,
          condition: 'c2'
        }
      }
    })
    expect(result.editRowIndex).toBe(2)
    expect(result.editRow.expanded).toBe(true)
  })

  it('editRowIndex points past the last tile when adding a new entry', () => {
    const result = getPaymentConditionalAmountsViewModel({
      definition: baseDefinition,
      state: {
        conditionalAmounts: [{ id: 'a1', amount: 1, condition: 'c1' }],
        conditionalAmountEditRow: {
          expanded: true,
          id: '',
          amount: '',
          condition: ''
        }
      }
    })
    expect(result.editRowIndex).toBe(2)
  })

  it('editRowIndex falls through to last+1 if the editRow id is stale', () => {
    const result = getPaymentConditionalAmountsViewModel({
      definition: baseDefinition,
      state: {
        conditionalAmounts: [{ id: 'a1', amount: 1, condition: 'c1' }],
        conditionalAmountEditRow: {
          expanded: true,
          id: 'a-deleted',
          amount: '',
          condition: ''
        }
      }
    })
    expect(result.editRowIndex).toBe(2)
  })
})
