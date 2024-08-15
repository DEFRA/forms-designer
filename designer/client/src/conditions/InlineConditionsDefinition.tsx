import {
  ComponentType,
  Condition,
  ConditionField,
  ConditionRef,
  ConditionType,
  conditionValueFrom,
  Coordinator,
  DateDirections,
  DateUnits,
  getOperatorNames,
  hasConditionField,
  relativeDateOperatorNames,
  type ConditionData,
  type ConditionGroup,
  type ConditionRefData,
  type ConditionValue,
  type Item,
  type OperatorName,
  type RelativeDateValue
} from '@defra/forms-model'
import upperFirst from 'lodash/upperFirst.js'
import React, { Component, type ChangeEvent } from 'react'

import {
  InlineConditionsDefinitionValue,
  type FieldDef
} from '~/src/conditions/InlineConditionsDefinitionValue.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'

interface Props {
  condition?: ConditionData
  expectsCoordinator: boolean
  fields: Partial<Record<string, FieldDef>>
  saveCallback: (condition: Condition | ConditionRef | ConditionGroup) => void
}

interface State {
  condition?: ConditionData | ConditionRefData
  selectedCoordinator?: Coordinator | ''
  selectedOperator?: OperatorName | ''
}

export class InlineConditionsDefinition extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { condition } = props

    this.state = {
      condition,
      selectedCoordinator: condition?.coordinator,
      selectedOperator: condition?.operator
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { condition, expectsCoordinator, fields } = this.props

    if (
      fields !== prevProps.fields ||
      expectsCoordinator !== prevProps.expectsCoordinator
    ) {
      this.setState({
        condition,
        selectedCoordinator: condition?.coordinator,
        selectedOperator: condition?.operator
      })
    }
  }

  onChangeCoordinator = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: coordinator } = e.currentTarget
    const { condition } = this.state

    const newCoordinator = coordinator
      ? (coordinator as Coordinator)
      : undefined

    this._updateCondition(condition, (newCondition) => {
      if (!newCondition) {
        return
      }

      newCondition.coordinator = newCoordinator
      return newCondition
    })

    this.setState({
      selectedCoordinator: newCoordinator ?? ''
    })
  }

  onClickFinalise = () => {
    const { saveCallback } = this.props
    const { condition } = this.state

    // Check for condition
    if (!condition) {
      return
    }

    // Check for condition value
    if (
      hasConditionField(condition) &&
      !(condition.value.type === ConditionType.RelativeDate
        ? !!condition.value.period
        : !!condition.value.value)
    ) {
      return
    }

    this.setState({
      condition: undefined,
      selectedCoordinator: undefined,
      selectedOperator: undefined
    })

    saveCallback(
      hasConditionField(condition)
        ? Condition.from(condition)
        : ConditionRef.from(condition)
    )
  }

  onChangeField = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: fieldName } = e.currentTarget

    const { fields } = this.props
    const { condition, selectedCoordinator: coordinator } = this.state

    this._updateCondition(condition, () => {
      let field: ConditionField | undefined
      let value: ConditionValue | RelativeDateValue | undefined

      const fieldDef = fields[fieldName]
      if (!fieldDef || coordinator === '') {
        return
      }

      // Default operator
      const operator = isFieldComponent(fieldDef)
        ? getOperatorNames(fieldDef.type)[0]
        : undefined

      // Default field and empty condition value
      if (isFieldComponent(fieldDef)) {
        field = ConditionField.from({
          name: fieldDef.name,
          type: fieldDef.type,
          display: fieldDef.label
        })

        value = conditionValueFrom(
          operator &&
            fieldDef.type === ComponentType.DatePartsField &&
            relativeDateOperatorNames.includes(operator)
            ? {
                type: ConditionType.RelativeDate,
                direction: DateDirections.FUTURE,
                unit: DateUnits.DAYS,
                period: ''
              }
            : {
                type: ConditionType.Value,
                display: '',
                value: ''
              }
        )
      }

      return isFieldCondition(fieldDef)
        ? new ConditionRef(fieldDef.name, fieldDef.label, coordinator).toJSON()
        : new Condition(field, operator, value, coordinator).toJSON()
    })

    // Reset selected operator on field change
    this.setState({
      selectedOperator: undefined
    })
  }

  _updateCondition(
    condition: State['condition'],
    updates: (newCondition?: ConditionData) => State['condition']
  ) {
    const newCondition = hasConditionField(condition)
      ? structuredClone(condition)
      : undefined

    this.setState({
      condition: updates(newCondition)
    })

    return condition
  }

  onChangeOperator = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: operator } = e.currentTarget
    const { condition } = this.state

    const newOperator = operator ? (operator as OperatorName) : undefined

    this._updateCondition(condition, (newCondition) => {
      if (!newCondition || !newOperator) {
        return newCondition
      }

      newCondition.operator = newOperator
      return newCondition
    })

    this.setState({
      selectedOperator: newOperator ?? ''
    })
  }

  updateValue = (newValue: Condition['value']) => {
    const { condition } = this.state

    this._updateCondition(condition, (newCondition) => {
      if (!newCondition) {
        return
      }

      newCondition.value = newValue.toJSON()
      return newCondition
    })
  }

  render() {
    const { expectsCoordinator, fields } = this.props
    const { condition, selectedCoordinator, selectedOperator } = this.state

    const fieldDef = hasConditionField(condition)
      ? fields[condition.field.name]
      : undefined

    const fieldInputs = Object.values(fields)
      .filter(isFieldComponent)
      .sort(({ label: labelA }, { label: labelB }) =>
        labelA.localeCompare(labelB)
      )

    return (
      <div className="govuk-!-margin-bottom-6">
        {(expectsCoordinator || !!selectedCoordinator) && (
          <div className="govuk-form-group govuk-!-margin-bottom-3">
            <label className="govuk-label" htmlFor="cond-coordinator">
              {i18n('conditions.conditionCoordinator')}
            </label>
            <select
              className="govuk-select"
              id="cond-coordinator"
              name="cond-coordinator"
              value={selectedCoordinator ?? condition?.coordinator ?? ''}
              onChange={this.onChangeCoordinator}
            >
              <option value="" />
              {Object.values(Coordinator).map((coordinator) => (
                <option key={coordinator} value={coordinator}>
                  {upperFirst(coordinator)}
                </option>
              ))}
            </select>
          </div>
        )}
        {(!expectsCoordinator || !!selectedCoordinator) && (
          <>
            <div className="govuk-form-group govuk-!-margin-bottom-3">
              <label className="govuk-label" htmlFor="cond-field">
                {i18n('conditions.conditionField')}
              </label>
              <select
                className="govuk-select"
                id="cond-field"
                name="cond-field"
                value={hasConditionField(condition) ? condition.field.name : ''}
                onChange={this.onChangeField}
              >
                <option value="" />
                {fieldInputs.map((input, index) => (
                  <option key={`${input.name}-${index}`} value={input.name}>
                    {input.label}
                  </option>
                ))}
              </select>
            </div>

            {hasConditionField(condition) && isFieldComponent(fieldDef) && (
              <>
                <div className="govuk-form-group govuk-!-margin-bottom-3">
                  <label className="govuk-label" htmlFor="cond-operator">
                    {i18n('conditions.conditionOperator')}
                  </label>
                  <select
                    className="govuk-select"
                    id="cond-operator"
                    name="cond-operator"
                    value={selectedOperator ?? condition.operator}
                    onChange={this.onChangeOperator}
                  >
                    <option value="" />
                    {getOperatorNames(fieldDef.type)
                      .sort()
                      .map((operator) => (
                        <option key={operator} value={operator}>
                          {upperFirst(operator)}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="govuk-form-group govuk-!-margin-bottom-3">
                  <InlineConditionsDefinitionValue
                    fieldDef={fieldDef}
                    value={condition.value}
                    operator={condition.operator}
                    updateValue={this.updateValue}
                  />
                </div>
              </>
            )}

            {condition && (
              <div className="govuk-button-group">
                <button
                  id="save-condition"
                  className="govuk-button govuk-button--secondary"
                  type="button"
                  onClick={this.onClickFinalise}
                >
                  {i18n('add')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    )
  }
}

export function isFieldComponent(
  fieldDef?: FieldDef
): fieldDef is Extract<FieldDef, { type: ComponentType }> {
  return !!fieldDef && !isFieldCondition(fieldDef)
}

export function isFieldCondition(
  fieldDef?: FieldDef
): fieldDef is Extract<FieldDef, { type: 'Condition' }> {
  return fieldDef?.type === 'Condition'
}

export function isFieldConditionList(
  fieldDef?: FieldDef
): fieldDef is Extract<FieldDef, { values?: Item[] }> {
  return !!fieldDef && 'values' in fieldDef
}
