import { DateDirections, RelativeTimeValue } from '@defra/forms-model'
import upperFirst from 'lodash/upperFirst.js'
import React, { Component } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'

export class RelativeTimeValues extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timePeriod: props.value?.timePeriod,
      timeUnit: props.value?.timeUnit,
      direction: props.value?.direction
    }
  }

  updateState(state) {
    this.setState(state, () => {
      this.passValueToParentComponentIfComplete()
    })
  }

  passValueToParentComponentIfComplete() {
    const { timeOnly, updateValue } = this.props
    const { timePeriod, timeUnit, direction } = this.state

    if (timePeriod && timeUnit && direction) {
      updateValue(
        new RelativeTimeValue(
          timePeriod,
          timeUnit,
          direction,
          timeOnly ?? false
        )
      )
    }
  }

  render() {
    const { units } = this.props
    const { timePeriod, timeUnit, direction } = this.state

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
            defaultValue={timePeriod}
            required
            onChange={(e) =>
              this.updateState({
                timePeriod: e.currentTarget.value
              })
            }
            data-testid="cond-value-period"
          />
        </div>

        <div className="govuk-form-group">
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend">
              {i18n('conditions.conditionDateUnits')}
            </legend>
            <div className="govuk-radios" data-module="govuk-radios">
              {Object.values(units).map((unit) => {
                const name = 'cond-value-units'
                const id = `${name}-${unit.value}`

                return (
                  <div className="govuk-radios__item" key={unit.value}>
                    <input
                      className="govuk-radios__input"
                      id={id}
                      name={name}
                      type="radio"
                      defaultValue={unit.value}
                      defaultChecked={timeUnit === unit.value}
                      onClick={(e) => {
                        const { value: unit } = e.currentTarget

                        this.updateState({
                          timeUnit: unit
                        })
                      }}
                    />
                    <label
                      className="govuk-label govuk-radios__label"
                      htmlFor={id}
                    >
                      {upperFirst(unit.value)}
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
