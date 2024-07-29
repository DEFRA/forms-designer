import {
  Condition,
  ConditionField,
  ConditionRef,
  conditionValueFrom,
  getOperatorNames,
  clone,
  Coordinator
} from '@defra/forms-model'
import React, { Component, type ChangeEvent } from 'react'

import {
  InlineConditionsDefinitionValue,
  type FieldDef
} from '~/src/conditions/InlineConditionsDefinitionValue.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'

export class InlineConditionsDefinition extends Component {
  constructor(props) {
    super(props)
    this.state = {
      condition: clone(props.condition) || {}
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.expectsCoordinator !== prevProps.expectsCoordinator ||
      this.props.fields !== prevProps.fields
    ) {
      const { condition } = this.state
      const newCondition = this.props.fields[condition?.field?.name]
        ? this.state.condition
        : {}
      this.setState({
        condition: newCondition
      })
    }
  }

  onChangeCoordinator = (e: ChangeEvent<HTMLSelectElement>) => {
    const input = e.target
    let newCondition = {}

    if (input.value && input.value.trim() !== '') {
      newCondition = clone(this.state.condition ?? {})
      newCondition.coordinator = input.value
    }
    this.setState({
      condition: newCondition
    })
  }

  onClickFinalise = () => {
    const { fields, saveCallback } = this.props
    const { condition } = this.state

    this.setState({
      condition: {}
    })

    const fieldDef = fields[condition.field.name]

    saveCallback(
      isFieldConditionRef(fieldDef)
        ? new ConditionRef(fieldDef.name, fieldDef.label, condition.coordinator)
        : new Condition(
            ConditionField.from(condition.field),
            condition.operator,
            conditionValueFrom(condition.value),
            condition.coordinator
          )
    )
  }

  onChangeField = (e: ChangeEvent<HTMLSelectElement>) => {
    const input = e.target
    const fieldName = input.value

    const { condition } = this.state

    const currentField = condition.field?.name
    const currentOperator = condition.operator

    const fieldDef = this.props.fields[fieldName]

    this._updateCondition(condition, (c) => {
      if (fieldName) {
        if (isFieldConditionRef(fieldDef)) {
          delete c.value
          delete c.operator
        } else {
          if (
            fieldDef &&
            currentField &&
            this.props.fields[currentField]?.values !== fieldDef.values
          ) {
            delete c.value
          }
          if (
            currentOperator &&
            !getOperatorNames(fieldName).includes(currentOperator)
          ) {
            delete c.operator
          }
        }
        c.field = {
          name: fieldName,
          display: fieldDef?.label,
          type: fieldDef?.type
        }
      } else {
        delete c.field
        delete c.operator
        delete c.value
      }
    })
  }

  _updateCondition(condition, updates) {
    const copy = clone(condition)
    updates(copy)
    this.setState({
      condition: copy
    })
  }

  onChangeOperator = (e: ChangeEvent<HTMLSelectElement>) => {
    const input = e.target
    const { condition } = this.state

    this._updateCondition(condition, (c) => {
      c.operator = input.value
    })
  }

  updateValue = (newValue) => {
    const { condition } = this.state
    this._updateCondition(condition, (c) => {
      c.value = newValue
    })
  }

  setState(state, callback) {
    if (state.conditions || state.selectedCondition !== undefined) {
      this.props.conditionsChange(state.conditions, state.selectedCondition)
    }
    super.setState(state, callback)
  }

  render() {
    const { expectsCoordinator, fields } = this.props
    const { condition } = this.state
    const fieldDef = fields[condition.field?.name]

    return (
      <div id="condition-definition-group" className="govuk-!-margin-bottom-6">
        {expectsCoordinator && (
          <div className="govuk-form-group govuk-!-margin-bottom-3">
            <label className="govuk-label" htmlFor="cond-coordinator">
              {i18n('conditions.conditionCoordinator')}
            </label>
            <select
              className="govuk-select"
              id="cond-coordinator"
              name="cond-coordinator"
              value={condition?.coordinator ?? ''}
              onChange={this.onChangeCoordinator}
            >
              <option value="" />
              <option key="and" value={Coordinator.AND}>
                And
              </option>
              <option key="or" value={Coordinator.OR}>
                Or
              </option>
            </select>
          </div>
        )}
        {(condition.coordinator || !expectsCoordinator) && (
          <>
            <div className="govuk-form-group govuk-!-margin-bottom-3">
              <label className="govuk-label" htmlFor="cond-field">
                {i18n('conditions.conditionField')}
              </label>
              <select
                className="govuk-select"
                id="cond-field"
                name="cond-field"
                value={condition?.field?.name ?? ''}
                onChange={this.onChangeField}
              >
                <option value="" />
                {Object.values(this.props.fields).map((field, index) => (
                  <option key={`${field.name}-${index}`} value={field.name}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>

            {fieldDef && !isFieldConditionRef(fieldDef) && (
              <div className="govuk-form-group govuk-!-margin-bottom-3">
                <label className="govuk-label" htmlFor="cond-operator">
                  {i18n('conditions.conditionOperator')}
                </label>
                <select
                  className="govuk-select"
                  id="cond-operator"
                  name="cond-operator"
                  value={condition.operator ?? ''}
                  onChange={this.onChangeOperator}
                >
                  <option value="" />
                  {getOperatorNames(fieldDef.type).map((conditional) => {
                    return (
                      <option
                        key={`${condition.field}-${conditional}`}
                        value={conditional}
                      >
                        {conditional}
                      </option>
                    )
                  })}
                </select>
              </div>
            )}

            {fieldDef && condition.operator && (
              <div className="govuk-form-group govuk-!-margin-bottom-3">
                <InlineConditionsDefinitionValue
                  fieldDef={fieldDef}
                  value={condition.value}
                  operator={condition.operator}
                  updateValue={this.updateValue}
                />
              </div>
            )}

            {(condition.value || isFieldConditionRef(fieldDef)) && (
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

export function isFieldConditionRef(
  fieldDef?: FieldDef
): fieldDef is Extract<FieldDef, { type: 'Condition' }> {
  return fieldDef?.type === 'Condition'
}

export function isFieldConditionList(
  fieldDef?: FieldDef
): fieldDef is Extract<FieldDef, { values: Item[] }> {
  return !!fieldDef && 'values' in fieldDef
}
