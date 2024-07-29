import {
  ComponentType,
  ConditionType,
  ConditionValue,
  OperatorName,
  relativeDateOperatorNames,
  type Item
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { InlineConditionsDefinitionValue } from '~/src/conditions/InlineConditionsDefinitionValue.jsx'

describe('InlineConditionsDefinitionValue', () => {
  afterEach(cleanup)

  it('should display a text input for fields without custom mappings or options', async () => {
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      type: ComponentType.TextField
    }
    render(
      <InlineConditionsDefinitionValue
        updateValue={jest.fn()}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator={OperatorName.Is}
      />
    )

    const $input = await waitFor(() => screen.findByDisplayValue('my-value'))
    expect($input).toBeInTheDocument()
    expect($input).toHaveAttribute('type', 'text')
  })

  it('inputting a text value should call update value', async () => {
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      type: ComponentType.TextField
    }
    const updateValueCallback = jest.fn()
    render(
      <InlineConditionsDefinitionValue
        updateValue={updateValueCallback}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator={OperatorName.Is}
      />
    )

    const $input = await waitFor(() => screen.findByDisplayValue('my-value'))
    await act(() => userEvent.clear($input))
    await act(() => userEvent.type($input, 'new-value'))
    expect(updateValueCallback).toHaveBeenLastCalledWith({
      display: 'new-value',
      type: ConditionType.Value,
      value: 'new-value'
    })
  })

  it('inputting a blank text value should call update value with undefined', async () => {
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      type: ComponentType.TextField
    }
    const updateValueCallback = jest.fn()
    render(
      <InlineConditionsDefinitionValue
        updateValue={updateValueCallback}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator={OperatorName.Is}
      />
    )

    const $input = await waitFor(() => screen.findByDisplayValue('my-value'))
    await act(() => userEvent.clear($input))
    await act(() => userEvent.type($input, ''))
    expect(updateValueCallback).toHaveBeenLastCalledWith(undefined)
  })

  it('should display a select input for fields without custom mappings and with options', async () => {
    const values: Item[] = [
      { value: 'value1', text: 'Value 1' },
      { value: 'value2', text: 'Value 2' }
    ]
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      values,
      type: ComponentType.SelectField
    }
    render(
      <InlineConditionsDefinitionValue
        updateValue={jest.fn()}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator={OperatorName.Is}
      />
    )
    await waitFor(() =>
      expect(screen.findByTestId('cond-value')).resolves.toBeInTheDocument()
    )
    await waitFor(() =>
      expect(screen.findByText('Value 1')).resolves.toBeInTheDocument()
    )
    await waitFor(() =>
      expect(screen.findByText('Value 2')).resolves.toBeInTheDocument()
    )
  })

  it('selecting a value from the select list should call update value', async () => {
    const values: Item[] = [
      { value: 'value1', text: 'Value 1' },
      { value: 'value2', text: 'Value 2' }
    ]
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      values,
      type: ComponentType.SelectField
    }
    const updateValueCallback = jest.fn()
    render(
      <InlineConditionsDefinitionValue
        updateValue={updateValueCallback}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator={OperatorName.Is}
      />
    )

    const select = await waitFor(() => screen.findByTestId('cond-value'))
    await act(() => userEvent.selectOptions(select, 'value1'))

    expect(updateValueCallback).toHaveBeenLastCalledWith({
      display: 'Value 1',
      type: ConditionType.Value,
      value: 'value1'
    })
  })

  it('should correctly compare boolean string to boolean value', async () => {
    const values: Item[] = [
      { value: true, text: 'Value 1' },
      { value: false, text: 'Value 2' }
    ]
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      values,
      type: ComponentType.SelectField
    }
    const updateValueCallback = jest.fn()
    render(
      <InlineConditionsDefinitionValue
        updateValue={updateValueCallback}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator={OperatorName.Is}
      />
    )

    const select = await waitFor(() => screen.findByTestId('cond-value'))
    await act(() => userEvent.selectOptions(select, 'true'))

    expect(updateValueCallback).toHaveBeenLastCalledWith({
      display: 'Value 1',
      type: ConditionType.Value,
      value: 'true'
    })
  })

  it('should correctly compare number string to number value', async () => {
    const values: Item[] = [
      { value: 42, text: 'Value 1' },
      { value: 43, text: 'Value 2' }
    ]
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      values,
      type: ComponentType.SelectField
    }
    const updateValueCallback = jest.fn()
    render(
      <InlineConditionsDefinitionValue
        updateValue={updateValueCallback}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator={OperatorName.Is}
      />
    )

    const select = await waitFor(() => screen.findByTestId('cond-value'))
    await act(() => userEvent.selectOptions(select, '42'))

    expect(updateValueCallback).toHaveBeenLastCalledWith({
      display: 'Value 1',
      type: ConditionType.Value,
      value: '42'
    })
  })

  it('selecting a blank value from the select list should call update value with undefined', async () => {
    const values: Item[] = [
      { value: 42, text: 'Value 1' },
      { value: 43, text: 'Value 2' }
    ]
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      values,
      type: ComponentType.SelectField
    }
    const updateValueCallback = jest.fn()
    render(
      <InlineConditionsDefinitionValue
        updateValue={updateValueCallback}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator={OperatorName.Is}
      />
    )

    const select = await waitFor(() => screen.findByTestId('cond-value'))
    await act(() => userEvent.selectOptions(select, ''))

    expect(updateValueCallback).toHaveBeenLastCalledWith(undefined)
  })

  const dateMappings = [
    {
      type: ComponentType.DatePartsField,
      units: [
        { display: 'Years', value: 'years' },
        { display: 'Months', value: 'months' },
        { display: 'Day', value: 'days' }
      ]
    }
  ]

  dateMappings.forEach((mapping) => {
    relativeDateOperatorNames.forEach((operator) => {
      it(`should display custom component for ${mapping.type} component type and '${operator}' operator`, async () => {
        const fieldDef = {
          label: 'Something',
          name: 'field1',
          type: mapping.type
        }
        const updateValueCallback = jest.fn()
        render(
          <InlineConditionsDefinitionValue
            updateValue={updateValueCallback}
            fieldDef={fieldDef}
            operator={operator}
          />
        )
        await waitFor(() =>
          expect(
            screen.findByTestId('cond-value-period')
          ).resolves.toBeInTheDocument()
        )
        const units = await waitFor(() =>
          screen.findByTestId('cond-value-units')
        )
        expect(units).toBeInTheDocument()
        waitFor(() =>
          Promise.all(
            Object.values(mapping.units).map(async (unit) =>
              waitFor(() =>
                expect(
                  screen.findByDisplayValue(unit.display)
                ).resolves.toBeInTheDocument()
              )
            )
          )
        )
        await waitFor(() =>
          expect(
            screen.findByTestId('cond-value-direction')
          ).resolves.toBeInTheDocument()
        )
      })
    })
  })
})
