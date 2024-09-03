import {
  DateDirections,
  DateUnits,
  RelativeDateValue,
  type RelativeDateValueData
} from '@defra/forms-model'
import upperFirst from 'lodash/upperFirst.js'
import React, { Component } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'

interface Props {
  value?: RelativeDateValueData
  updateValue: (value: RelativeDateValue) => void
}

interface State {
  period?: string
  unit?: DateUnits
  direction?: DateDirections
}

export class RelativeDateValues extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props)

    const { value } = props

    this.state = {
      period: value?.period,
      unit: value?.unit,
      direction: value?.direction
    }
  }

  updateState(state: State) {
    this.setState(state, () => {
      this.passValueToParentComponentIfComplete()
    })
  }

  passValueToParentComponentIfComplete() {
    const { updateValue } = this.props
    const { period, unit, direction } = this.state

    if (!period || !unit || !direction) {
      return
    }

    updateValue(new RelativeDateValue(period, unit, direction))
  }

  render() {
    const { period, unit, direction } = this.state

    return (
      <>
        <div className="govuk-form-group govuk-!-margin-bottom-3">
          <label className="govuk-label" htmlFor="cond-value-period">
            {i18n('conditions.conditionDatePeriod')}
          </label>
          <input
            className="govuk-input govuk-input--width-5"
            id="cond-value-period"
            name="cond-value-period"
            type="text"
            defaultValue={period}
            required
            onChange={(e) =>
              this.updateState({
                period: e.currentTarget.value
              })
            }
          />
        </div>

        <div className="govuk-form-group">
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend">
              {i18n('conditions.conditionDateUnits')}
            </legend>
            <div className="govuk-radios" data-module="govuk-radios">
              {Object.values(DateUnits).map((unitValue) => {
                const name = 'cond-value-units'
                const id = `${name}-${unitValue}`

                return (
                  <div className="govuk-radios__item" key={unitValue}>
                    <input
                      className="govuk-radios__input"
                      id={id}
                      name={name}
                      type="radio"
                      defaultValue={unitValue}
                      defaultChecked={unit === unitValue}
                      onClick={(e) => {
                        const { value: unit } = e.currentTarget

                        this.updateState({
                          unit: unit as DateUnits
                        })
                      }}
                    />
                    <label
                      className="govuk-label govuk-radios__label"
                      htmlFor={id}
                    >
                      {upperFirst(unitValue)}
                    </label>
                  </div>
                )
              })}
            </div>
          </fieldset>
        </div>

        <div className="govuk-form-group">
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend">
              {i18n('conditions.conditionDateDirection')}
            </legend>
            <div className="govuk-radios" data-module="govuk-radios">
              {Object.values(DateDirections).map((directionValue) => {
                const name = 'cond-value-direction'
                const id = `${name}-${directionValue}`

                return (
                  <div className="govuk-radios__item" key={directionValue}>
                    <input
                      className="govuk-radios__input"
                      id={id}
                      name={name}
                      type="radio"
                      defaultValue={directionValue}
                      defaultChecked={direction === directionValue}
                      onClick={(e) => {
                        const { value: direction } = e.currentTarget

                        this.updateState({
                          direction: direction as DateDirections
                        })
                      }}
                    />
                    <label
                      className="govuk-label govuk-radios__label"
                      htmlFor={id}
                    >
                      {upperFirst(directionValue)}
                    </label>
                  </div>
                )
              })}
            </div>
          </fieldset>
        </div>
      </>
    )
  }
}
