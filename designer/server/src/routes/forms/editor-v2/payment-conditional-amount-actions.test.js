import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import {
  buildInlineConditionalAmountError,
  handleAddConditionalAmount,
  handleCancelConditionalAmount,
  handleEditConditionalAmount,
  handleRemoveConditionalAmount,
  handleSaveConditionalAmount,
  persistInlineConditionalAmountDraft
} from '~/src/routes/forms/editor-v2/payment-conditional-amount-actions.js'

const STATE_ID = 's1'
const SESSION_KEY = `${sessionNames.questionSessionState}-${STATE_ID}`
const PAYMENT_ANCHOR = '#payment-conditional-amounts'

/** @param {Record<string, any>} initialState */
const buildYar = (initialState = {}) => {
  /** @type {Record<string, any>} */
  const store = { [SESSION_KEY]: initialState }
  const mock = {
    /** @param {string} key */
    get: (key) => store[key],
    /**
     * @param {string} key
     * @param {any} value
     */
    set: (key, value) => {
      store[key] = value
    },
    flash: jest.fn(),
    __store: store
  }
  return /** @type {import('@hapi/yar').Yar & { flash: jest.Mock, __store: Record<string, any> }} */ (
    /** @type {unknown} */ (mock)
  )
}

/** @param {ReturnType<typeof buildYar>} yar */
const sessionState = (yar) => yar.__store[SESSION_KEY]

describe('handleAddConditionalAmount', () => {
  it('opens an expanded empty editRow', () => {
    const yar = buildYar({
      questionType: 'PaymentField',
      conditionalAmounts: []
    })
    const anchor = handleAddConditionalAmount(yar, STATE_ID)
    expect(anchor).toBe(PAYMENT_ANCHOR)
    expect(sessionState(yar).conditionalAmountEditRow).toEqual({
      expanded: true,
      id: '',
      amount: '',
      condition: ''
    })
    expect(sessionState(yar).conditionalAmounts).toEqual([])
  })
})

describe('handleSaveConditionalAmount', () => {
  /** @param {Record<string, any>} initial */
  const setup = (initial) => {
    const yar = buildYar(initial)
    return {
      yar,
      request: {
        yar,
        payload: {}
      }
    }
  }

  it('appends a new item with a generated id when editRow has no id', () => {
    const { yar, request } = setup({
      questionType: 'PaymentField',
      conditionalAmounts: [],
      conditionalAmountEditRow: {
        expanded: true,
        id: '',
        amount: '',
        condition: ''
      }
    })
    request.payload = {
      conditionalAmount: '300',
      conditionalAmountCondition: 'c1'
    }

    const anchor = handleSaveConditionalAmount(
      /** @type {any} */ (request),
      STATE_ID
    )

    expect(anchor).toBe(PAYMENT_ANCHOR)
    const state = sessionState(yar)
    expect(state.conditionalAmounts).toHaveLength(1)
    expect(state.conditionalAmounts[0]).toMatchObject({
      amount: 300,
      condition: 'c1'
    })
    expect(state.conditionalAmounts[0].id).toEqual(expect.any(String))
    expect(state.conditionalAmounts[0].id.length).toBeGreaterThan(0)
    expect(state.conditionalAmountEditRow.expanded).toBe(false)
  })

  it('updates an existing item in place when editRow has an id', () => {
    const existing = { id: 'a1', amount: 100, condition: 'c1' }
    const { yar, request } = setup({
      questionType: 'PaymentField',
      conditionalAmounts: [existing],
      conditionalAmountEditRow: {
        expanded: true,
        id: 'a1',
        amount: 100,
        condition: 'c1'
      }
    })
    request.payload = {
      conditionalAmount: '500',
      conditionalAmountCondition: 'c2'
    }

    handleSaveConditionalAmount(/** @type {any} */ (request), STATE_ID)
    expect(sessionState(yar).conditionalAmounts).toEqual([
      { id: 'a1', amount: 500, condition: 'c2' }
    ])
  })

  it('keeps editRow open and flashes errors when amount is below £0.30', () => {
    const { yar, request } = setup({
      questionType: 'PaymentField',
      conditionalAmounts: [],
      conditionalAmountEditRow: {
        expanded: true,
        id: '',
        amount: '',
        condition: ''
      }
    })
    request.payload = {
      conditionalAmount: '0.10',
      conditionalAmountCondition: 'c1'
    }

    handleSaveConditionalAmount(/** @type {any} */ (request), STATE_ID)
    expect(sessionState(yar).conditionalAmounts).toEqual([])
    expect(sessionState(yar).conditionalAmountEditRow.expanded).toBe(true)
    expect(yar.flash).toHaveBeenCalledTimes(1)
  })

  it('flashes errors with conditionalAmount label so they land on the right input', () => {
    const { yar, request } = setup({
      questionType: 'PaymentField',
      conditionalAmounts: [],
      conditionalAmountEditRow: {
        expanded: true,
        id: '',
        amount: '',
        condition: ''
      }
    })
    request.payload = {
      conditionalAmount: '',
      conditionalAmountCondition: ''
    }

    handleSaveConditionalAmount(/** @type {any} */ (request), STATE_ID)
    expect(yar.flash).toHaveBeenCalledTimes(1)
    const flashedValue = yar.flash.mock.calls[0][1]
    const labels = flashedValue.formErrors
    expect(Object.keys(labels)).toEqual(
      expect.arrayContaining([
        'conditionalAmount',
        'conditionalAmountCondition'
      ])
    )
    expect(labels.conditionalAmount.text).toContain('Enter payment amount 1')
    expect(labels.conditionalAmountCondition.text).toBe(
      'Select an existing condition'
    )
  })

  it('treats an edit with a stale (no-longer-present) id as a new insert', () => {
    const { yar, request } = setup({
      questionType: 'PaymentField',
      conditionalAmounts: [{ id: 'a-current', amount: 1, condition: 'c1' }],
      conditionalAmountEditRow: {
        expanded: true,
        id: 'a-deleted-elsewhere',
        amount: '5',
        condition: 'c2'
      }
    })
    request.payload = {
      conditionalAmount: '5',
      conditionalAmountCondition: 'c2'
    }

    handleSaveConditionalAmount(/** @type {any} */ (request), STATE_ID)
    const stored = sessionState(yar).conditionalAmounts
    expect(stored).toHaveLength(2)
    expect(stored[1]).toMatchObject({ amount: 5, condition: 'c2' })
    expect(stored[1].id).not.toBe('a-deleted-elsewhere')
  })

  it('uses the editRow position for the dynamic label when editing the second tile', () => {
    const { yar, request } = setup({
      questionType: 'PaymentField',
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
    })
    request.payload = {
      conditionalAmount: '',
      conditionalAmountCondition: ''
    }

    handleSaveConditionalAmount(/** @type {any} */ (request), STATE_ID)
    const labels = yar.flash.mock.calls[0][1].formErrors
    expect(labels.conditionalAmount.text).toContain('Enter payment amount 2')
  })
})

describe('handleEditConditionalAmount', () => {
  it('populates editRow from the matching item', () => {
    const yar = buildYar({
      questionType: 'PaymentField',
      conditionalAmounts: [{ id: 'a1', amount: 100, condition: 'c1' }],
      conditionalAmountEditRow: { expanded: false }
    })
    const anchor = handleEditConditionalAmount(yar, STATE_ID, 'a1')
    expect(anchor).toBe(PAYMENT_ANCHOR)
    expect(sessionState(yar).conditionalAmountEditRow).toEqual({
      expanded: true,
      id: 'a1',
      amount: 100,
      condition: 'c1'
    })
  })

  it('is a no-op when the id does not match', () => {
    const yar = buildYar({
      questionType: 'PaymentField',
      conditionalAmounts: [{ id: 'a1', amount: 1, condition: 'c1' }],
      conditionalAmountEditRow: { expanded: false }
    })
    handleEditConditionalAmount(yar, STATE_ID, 'missing')
    expect(sessionState(yar).conditionalAmountEditRow).toEqual({
      expanded: false
    })
  })
})

describe('handleCancelConditionalAmount', () => {
  it('collapses editRow without touching conditionalAmounts', () => {
    const yar = buildYar({
      questionType: 'PaymentField',
      conditionalAmounts: [{ id: 'a1', amount: 1, condition: 'c1' }],
      conditionalAmountEditRow: {
        expanded: true,
        id: 'a1',
        amount: 99,
        condition: 'c1'
      }
    })
    const anchor = handleCancelConditionalAmount(yar, STATE_ID)
    expect(anchor).toBe(PAYMENT_ANCHOR)
    expect(sessionState(yar).conditionalAmounts).toEqual([
      { id: 'a1', amount: 1, condition: 'c1' }
    ])
    expect(sessionState(yar).conditionalAmountEditRow.expanded).toBe(false)
  })
})

describe('handleRemoveConditionalAmount', () => {
  it('removes the matching item, preserving order', () => {
    const yar = buildYar({
      questionType: 'PaymentField',
      conditionalAmounts: [
        { id: 'a1', amount: 1, condition: 'c1' },
        { id: 'a2', amount: 2, condition: 'c2' },
        { id: 'a3', amount: 3, condition: 'c3' }
      ]
    })
    const anchor = handleRemoveConditionalAmount(yar, STATE_ID, 'a2')
    expect(anchor).toBe(PAYMENT_ANCHOR)
    expect(sessionState(yar).conditionalAmounts).toEqual([
      { id: 'a1', amount: 1, condition: 'c1' },
      { id: 'a3', amount: 3, condition: 'c3' }
    ])
  })

  it('is a no-op when id is undefined', () => {
    const initial = [{ id: 'a1', amount: 1, condition: 'c1' }]
    const yar = buildYar({
      questionType: 'PaymentField',
      conditionalAmounts: initial
    })
    handleRemoveConditionalAmount(yar, STATE_ID, undefined)
    expect(sessionState(yar).conditionalAmounts).toEqual(initial)
  })

  it('is a no-op when id does not match any tile', () => {
    const initial = [{ id: 'a1', amount: 1, condition: 'c1' }]
    const yar = buildYar({
      questionType: 'PaymentField',
      conditionalAmounts: initial
    })
    handleRemoveConditionalAmount(yar, STATE_ID, 'missing')
    expect(sessionState(yar).conditionalAmounts).toEqual(initial)
  })
})

describe('buildInlineConditionalAmountError', () => {
  /**
   * @param {Record<string, any>} state
   * @param {Record<string, any>} payload
   */
  const setup = (state, payload) => {
    const yar = buildYar(state)
    return /** @type {any} */ ({ yar, payload })
  }

  it('returns null when the inline edit row is not expanded', () => {
    const request = setup(
      {
        questionType: 'PaymentField',
        conditionalAmounts: [],
        conditionalAmountEditRow: { expanded: false }
      },
      { conditionalAmount: '5', conditionalAmountCondition: 'c1' }
    )
    expect(buildInlineConditionalAmountError(request, STATE_ID)).toBeNull()
  })

  it('returns null when state.conditionalAmountEditRow is undefined', () => {
    const request = setup(
      {
        questionType: 'PaymentField',
        conditionalAmounts: []
      },
      { conditionalAmount: '5', conditionalAmountCondition: 'c1' }
    )
    expect(buildInlineConditionalAmountError(request, STATE_ID)).toBeNull()
  })

  it('returns null when expanded and the payload validates', () => {
    const request = setup(
      {
        questionType: 'PaymentField',
        conditionalAmounts: [],
        conditionalAmountEditRow: { expanded: true, id: '' }
      },
      { conditionalAmount: '5', conditionalAmountCondition: 'c1' }
    )
    expect(buildInlineConditionalAmountError(request, STATE_ID)).toBeNull()
  })

  it('returns a remapped Joi error when amount is below £0.30', () => {
    const request = setup(
      {
        questionType: 'PaymentField',
        conditionalAmounts: [],
        conditionalAmountEditRow: { expanded: true, id: '' }
      },
      { conditionalAmount: '0.10', conditionalAmountCondition: 'c1' }
    )
    const err = buildInlineConditionalAmountError(request, STATE_ID)
    expect(err).toBeInstanceOf(Joi.ValidationError)
    expect(
      err?.details.find((d) => d.path[0] === 'conditionalAmount')
    ).toBeDefined()
  })

  it('uses items.length+1 for the dynamic label when editRow.id is stale', () => {
    const request = setup(
      {
        questionType: 'PaymentField',
        conditionalAmounts: [{ id: 'a-current', amount: 1, condition: 'c1' }],
        conditionalAmountEditRow: { expanded: true, id: 'a-deleted-elsewhere' }
      },
      { conditionalAmount: '', conditionalAmountCondition: '' }
    )
    const err = buildInlineConditionalAmountError(request, STATE_ID)
    expect(
      err?.details.find((d) => d.path[0] === 'conditionalAmount')?.message
    ).toContain('Enter payment amount 2')
  })
})

describe('persistInlineConditionalAmountDraft', () => {
  it('writes payload values to editRow when the row is expanded', () => {
    const yar = buildYar({
      questionType: 'PaymentField',
      conditionalAmounts: [],
      conditionalAmountEditRow: {
        expanded: true,
        id: '',
        amount: '',
        condition: ''
      }
    })
    const request = /** @type {any} */ ({
      yar,
      payload: { conditionalAmount: '12.50', conditionalAmountCondition: 'c1' }
    })
    persistInlineConditionalAmountDraft(request, STATE_ID)
    expect(sessionState(yar).conditionalAmountEditRow).toEqual({
      expanded: true,
      id: '',
      amount: '12.50',
      condition: 'c1'
    })
  })

  it('is a no-op when the row is not expanded', () => {
    const yar = buildYar({
      questionType: 'PaymentField',
      conditionalAmountEditRow: {
        expanded: false,
        id: '',
        amount: '',
        condition: ''
      }
    })
    const request = /** @type {any} */ ({
      yar,
      payload: { conditionalAmount: '99', conditionalAmountCondition: 'cX' }
    })
    persistInlineConditionalAmountDraft(request, STATE_ID)
    expect(sessionState(yar).conditionalAmountEditRow).toEqual({
      expanded: false,
      id: '',
      amount: '',
      condition: ''
    })
  })

  it('is a no-op when state has no editRow at all', () => {
    const yar = buildYar({
      questionType: 'PaymentField',
      conditionalAmounts: []
    })
    const request = /** @type {any} */ ({
      yar,
      payload: { conditionalAmount: '99', conditionalAmountCondition: 'cX' }
    })
    persistInlineConditionalAmountDraft(request, STATE_ID)
    expect(sessionState(yar).conditionalAmountEditRow).toBeUndefined()
  })
})
