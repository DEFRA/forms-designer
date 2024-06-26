import { isValid } from 'date-fns'
import React, { useState } from 'react'

import {
  AbsoluteDateValues,
  type YearMonthDay
} from '~/src/conditions/AbsoluteDateValues.jsx'
import {
  AbsoluteTimeValues,
  type HourMinute
} from '~/src/conditions/AbsoluteTimeValues.jsx'
import { isInt } from '~/src/conditions/inline-condition-helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'

interface Props {
  value?: Date
  updateValue: (date: Date) => void
}

export const AbsoluteDateTimeValues = ({ value, updateValue }: Props) => {
  const [dateTimeParts, setDateTimeParts] = useState(() => {
    return {
      year: value?.getUTCFullYear(),
      month: value && value.getUTCMonth() + 1,
      day: value?.getUTCDate(),
      hour: value?.getUTCHours(),
      minute: value?.getUTCMinutes()
    }
  })

  const dateTimeChanged = (updated: YearMonthDay | HourMinute) => {
    const updatedDateTime = {
      ...dateTimeParts,
      ...updated
    }
    setDateTimeParts(updatedDateTime)
    const { year, month, day, hour, minute } = updatedDateTime
    if (year && month && day && isInt(hour) && isInt(minute)) {
      const utcMilliseconds = Date.UTC(year, month - 1, day, hour, minute)
      const date = new Date(utcMilliseconds)
      if (isValid(date)) {
        updateValue(date)
      }
    }
  }

  const { year, month, day, hour, minute } = dateTimeParts
  return (
    <div className="govuk-form-group">
      <p className="govuk-body">{i18n('enterDateTimeAsGmt')}</p>

      <AbsoluteDateValues
        value={{ year, month, day }}
        updateValue={dateTimeChanged}
      />
      <AbsoluteTimeValues
        value={{ hour, minute }}
        updateValue={dateTimeChanged}
      />
    </div>
  )
}
