import {
  ConditionValue,
  dateTimeUnits,
  dateUnits,
  relativeDateOrTimeOperatorNames,
  timeUnits
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { InlineConditionsDefinitionValue } from '~/src/conditions/InlineConditionsDefinitionValue.jsx'

describe.skip('InlineConditionsDefinitionValue', () => {
  afterEach(cleanup)

  const { findByDisplayValue, findByTestId, findByText } = screen

  it('should display a text input for fields without custom mappings or options', async () => {
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      type: 'TextField'
    }
    render(
      <InlineConditionsDefinitionValue
        updateValue={jest.fn()}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator="is"
      />
    )

    const $input = await waitFor(() => findByDisplayValue('my-value'))
    expect($input).toBeInTheDocument()
    expect($input).toHaveAttribute('type', 'text')
  })

  it('inputting a text value should call update value', async () => {
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      type: 'TextField'
    }
    const updateValueCallback = jest.fn()
    render(
      <InlineConditionsDefinitionValue
        updateValue={updateValueCallback}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator="is"
      />
    )

    const $input = await waitFor(() => findByDisplayValue('my-value'))
    await act(() => userEvent.clear($input))
    await act(() => userEvent.type($input, 'new-value'))
    expect(updateValueCallback).toHaveBeenLastCalledWith({
      display: 'new-value',
      type: 'Value',
      value: 'new-value'
    })
  })

  it('inputting a blank text value should call update value with undefined', async () => {
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      type: 'TextField'
    }
    const updateValueCallback = jest.fn()
    render(
      <InlineConditionsDefinitionValue
        updateValue={updateValueCallback}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator="is"
      />
    )

    const $input = await waitFor(() => findByDisplayValue('my-value'))
    await act(() => userEvent.clear($input))
    await act(() => userEvent.type($input, ''))
    expect(updateValueCallback).toHaveBeenLastCalledWith(undefined)
  })

  it('should display a select input for fields without custom mappings and with options', async () => {
    const values = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' }
    ]
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      values,
      type: 'SelectField'
    }
    render(
      <InlineConditionsDefinitionValue
        updateValue={jest.fn()}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator="is"
      />
    )
    await waitFor(() =>
      expect(findByTestId('cond-value')).resolves.toBeInTheDocument()
    )
    await waitFor(() =>
      expect(findByText('Value 1')).resolves.toBeInTheDocument()
    )
    await waitFor(() =>
      expect(findByText('Value 2')).resolves.toBeInTheDocument()
    )
  })

  it('selecting a value from the select list should call update value', async () => {
    const values = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' }
    ]
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      values,
      type: 'SelectField'
    }
    const updateValueCallback = jest.fn()
    render(
      <InlineConditionsDefinitionValue
        updateValue={updateValueCallback}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator="is"
      />
    )

    const select = await waitFor(() => findByTestId('cond-value'))
    await act(() => userEvent.selectOptions(select, 'value1'))

    expect(updateValueCallback).toHaveBeenLastCalledWith({
      display: 'Value 1',
      type: 'Value',
      value: 'value1'
    })
  })

  it('should correctly compare boolean string to boolean value', async () => {
    const values = [
      { value: true, label: 'Value 1' },
      { value: false, label: 'Value 2' }
    ]
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      values,
      type: 'SelectField'
    }
    const updateValueCallback = jest.fn()
    render(
      <InlineConditionsDefinitionValue
        updateValue={updateValueCallback}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator="is"
      />
    )

    const select = await waitFor(() => findByTestId('cond-value'))
    await act(() => userEvent.selectOptions(select, 'true'))

    expect(updateValueCallback).toHaveBeenLastCalledWith({
      display: 'Value 1',
      type: 'Value',
      value: 'true'
    })
  })

  it('should correctly compare number string to number value', async () => {
    const values = [
      { value: 42, label: 'Value 1' },
      { value: 43, label: 'Value 2' }
    ]
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      values,
      type: 'SelectField'
    }
    const updateValueCallback = jest.fn()
    render(
      <InlineConditionsDefinitionValue
        updateValue={updateValueCallback}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator="is"
      />
    )

    const select = await waitFor(() => findByTestId('cond-value'))
    await act(() => userEvent.selectOptions(select, '42'))

    expect(updateValueCallback).toHaveBeenLastCalledWith({
      display: 'Value 1',
      type: 'Value',
      value: '42'
    })
  })

  it('selecting a blank value from the select list should call update value with undefined', async () => {
    const values = [
      { value: 42, label: 'Value 1' },
      { value: 43, label: 'Value 2' }
    ]
    const fieldDef = {
      label: 'Something',
      name: 'field1',
      values,
      type: 'SelectField'
    }
    const updateValueCallback = jest.fn()
    render(
      <InlineConditionsDefinitionValue
        updateValue={updateValueCallback}
        value={new ConditionValue('my-value')}
        fieldDef={fieldDef}
        operator="is"
      />
    )

    const select = await waitFor(() => findByTestId('cond-value'))
    await act(() => userEvent.selectOptions(select, ''))

    expect(updateValueCallback).toHaveBeenLastCalledWith(undefined)
  })

  const dateAndTimeMappings = [
    { type: 'DateField', units: dateUnits },
    { type: 'DatePartsField', units: dateUnits },
    { type: 'TimeField', units: timeUnits, timeOnly: true },
    { type: 'DateTimeField', units: dateTimeUnits },
    { type: 'DateTimePartsField', units: dateTimeUnits }
  ]

  dateAndTimeMappings.forEach((mapping) => {
    relativeDateOrTimeOperatorNames.forEach((operator) => {
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
          expect(findByTestId('cond-value-period')).resolves.toBeInTheDocument()
        )
        const units = await waitFor(() => findByTestId('cond-value-units'))
        expect(units).toBeInTheDocument()
        waitFor(() =>
          Promise.all(
            Object.values(mapping.units).map(async (unit) =>
              waitFor(() =>
                expect(
                  findByDisplayValue(unit.display)
                ).resolves.toBeInTheDocument()
              )
            )
          )
        )
        await waitFor(() =>
          expect(
            findByTestId('cond-value-direction')
          ).resolves.toBeInTheDocument()
        )
      })
    })
  })
})
