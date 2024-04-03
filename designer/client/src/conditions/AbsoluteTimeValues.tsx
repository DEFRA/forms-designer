import React from 'react'

import { isInt } from '~/src/conditions/inline-condition-helpers.js'

export interface HourMinute {
  hour: number
  minute: number
}

export interface HourMinuteOptional {
  hour?: number
  minute?: number
}

interface Props {
  value: HourMinuteOptional
  updateValue: ({ hour, minute }: HourMinute) => void
}

export const AbsoluteTimeValues = ({ value = {}, updateValue }: Props) => {
  const [hour, setHour] = React.useState(() =>
    isInt(value.hour) ? value.hour.toString() : ''
  )
  const [minute, setMinute] = React.useState(() =>
    isInt(value.minute) ? value.minute.toString() : ''
  )

  React.useEffect(() => {
    const parsedHour = parseInt(hour, 10)
    const parsedMinute = parseInt(minute, 10)
    if (
      isInt(hour) &&
      isInt(minute) &&
      (parsedHour !== value.hour || parsedMinute !== value.minute)
    ) {
      updateValue({
        hour: parsedHour,
        minute: parsedMinute
      })
    }
  }, [hour, minute])

  const hoursChanged = (e) => setHour(e.target.value)
  const minutesChanged = (e) => setMinute(e.target.value)

  return (
    <div className="govuk-date-input">
      <div className="govuk-date-input__item">
        <div className="govuk-form-group">
          <label
            htmlFor="cond-value-hours"
            className="govuk-label govuk-label--s"
          >
            HH
          </label>
          <input
            className="govuk-input govuk-input--width-2"
            id="cond-value-hours"
            name="cond-value-hours"
            type="number"
            maxLength={2}
            min={0}
            max={23}
            value={hour}
            required
            onChange={hoursChanged}
          />
        </div>
      </div>

      <div className="govuk-date-input__item">
        <div className="govuk-form-group">
          <label
            htmlFor="cond-value-minutes"
            className="govuk-label govuk-label--s"
          >
            mm
          </label>
          <input
            className="govuk-input govuk-input--width-2"
            id="cond-value-minutes"
            name="cond-value-minutes"
            type="number"
            maxLength={2}
            min={0}
            max={59}
            value={minute}
            required
            onChange={minutesChanged}
          />
        </div>
      </div>
    </div>
  )
}
