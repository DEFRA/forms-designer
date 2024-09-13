import {
  ComponentType,
  ConditionType,
  ConditionValue,
  DateUnits,
  OperatorName,
  absoluteDateOperatorNames,
  relativeDateOperatorNames,
  type Item
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import upperFirst from 'lodash/upperFirst.js'
import React from 'react'

import { InlineConditionsDefinitionValue } from '~/src/conditions/InlineConditionsDefinitionValue.jsx'
import { type FieldDef } from '~/src/data/component/fields.js'

describe('InlineConditionsDefinitionValue', () => {
  afterEach(cleanup)

  it('should display a text input for fields without custom mappings or options', async () => {
    const fieldDef: FieldDef = {
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
    const fieldDef: FieldDef = {
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

    const $input = await waitFor(() => screen.getByLabelText('Value'))

    await act(() => userEvent.clear($input))
    await act(() => userEvent.type($input, 'new-value'))

    expect(updateValueCallback).toHaveBeenLastCalledWith({
      display: 'new-value',
      type: ConditionType.Value,
      value: 'new-value'
    })
  })

  it('inputting a blank text value should call update value with empty strings', async () => {
    const fieldDef: FieldDef = {
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

    expect(updateValueCallback).toHaveBeenLastCalledWith({
      display: '',
      type: ConditionType.Value,
      value: ''
    })
  })

  it('should display a select input for fields without custom mappings and with options', async () => {
    const values: Item[] = [
      { value: 'value1', text: 'Value 1' },
      { value: 'value2', text: 'Value 2' }
    ]

    const fieldDef: FieldDef = {
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

    const $select = await waitFor(() =>
      screen.findByRole<HTMLSelectElement>('combobox', {
        name: 'Value'
      })
    )

    expect($select).toBeInTheDocument()
    expect($select).toHaveValue('')
    expect($select.options[1]).toMatchObject(values[0])
    expect($select.options[2]).toMatchObject(values[1])
  })

  it('selecting a value from the select list should call update value', async () => {
    const values: Item[] = [
      { value: 'value1', text: 'Value 1' },
      { value: 'value2', text: 'Value 2' }
    ]

    const fieldDef: FieldDef = {
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

    const $select = screen.getByRole('combobox', { name: 'Value' })
    await act(() => userEvent.selectOptions($select, 'value1'))

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

    const fieldDef: FieldDef = {
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

    const $select = screen.getByRole('combobox', { name: 'Value' })
    await act(() => userEvent.selectOptions($select, 'true'))

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

    const fieldDef: FieldDef = {
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

    const $select = screen.getByRole('combobox', { name: 'Value' })
    await act(() => userEvent.selectOptions($select, '42'))

    expect(updateValueCallback).toHaveBeenLastCalledWith({
      display: 'Value 1',
      type: ConditionType.Value,
      value: '42'
    })
  })

  it('selecting a blank value from the select list should call update value with empty strings', async () => {
    const values: Item[] = [
      { value: 42, text: 'Value 1' },
      { value: 43, text: 'Value 2' }
    ]

    const fieldDef: FieldDef = {
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

    const $select = screen.getByRole('combobox', { name: 'Value' })
    await act(() => userEvent.selectOptions($select, ''))

    expect(updateValueCallback).toHaveBeenLastCalledWith({
      display: '',
      type: ConditionType.Value,
      value: ''
    })
  })

  it.each(relativeDateOperatorNames)(
    `should display relative date component fields for '%s' operator`,
    async (operator) => {
      const fieldDef: FieldDef = {
        label: 'Something',
        name: 'field1',
        type: ComponentType.DatePartsField
      }

      const updateValueCallback = jest.fn()

      render(
        <InlineConditionsDefinitionValue
          updateValue={updateValueCallback}
          fieldDef={fieldDef}
          operator={operator}
        />
      )

      const $period = await waitFor(() =>
        screen.findByRole('textbox', {
          name: 'Period'
        })
      )

      const $units = await waitFor(() =>
        screen.findByRole('group', {
          name: 'Units'
        })
      )

      const $direction = await waitFor(() =>
        screen.findByRole('group', {
          name: 'Direction'
        })
      )

      expect($period).toBeInTheDocument()
      expect($units).toBeInTheDocument()
      expect($direction).toBeInTheDocument()

      for (const unit of Object.values(DateUnits)) {
        const $unit = await waitFor(() =>
          screen.findByRole('radio', {
            name: upperFirst(unit)
          })
        )

        expect($unit).toBeInTheDocument()
      }
    }
  )

  it.each(absoluteDateOperatorNames)(
    `should display absolute date component fields for '%s' operator`,
    async (operator) => {
      const fieldDef: FieldDef = {
        label: 'Something',
        name: 'field1',
        type: ComponentType.DatePartsField
      }

      const updateValueCallback = jest.fn()

      render(
        <InlineConditionsDefinitionValue
          updateValue={updateValueCallback}
          fieldDef={fieldDef}
          operator={operator}
        />
      )

      const $day = await waitFor(() =>
        screen.findByRole('spinbutton', {
          name: 'Day'
        })
      )

      const $month = await waitFor(() =>
        screen.findByRole('spinbutton', {
          name: 'Month'
        })
      )

      const $year = await waitFor(() =>
        screen.findByRole('spinbutton', {
          name: 'Year'
        })
      )

      expect($day).toBeInTheDocument()
      expect($month).toBeInTheDocument()
      expect($year).toBeInTheDocument()
    }
  )
})
