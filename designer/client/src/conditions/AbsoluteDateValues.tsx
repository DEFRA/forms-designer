import { isValid } from 'date-fns'
import React, { useEffect, useState, type ChangeEvent } from 'react'

import {
  isInt,
  tryParseInt
} from '~/src/conditions/inline-condition-helpers.js'

export interface YearMonthDay {
  year: number
  month: number
  day: number
}

export interface Props {
  value?: Partial<YearMonthDay>
  updateValue: ({ year, month, day }: YearMonthDay) => void
}

function isValidateDate(props: Partial<YearMonthDay>): props is YearMonthDay {
  const year = `${props.year}`
  const month = `${props.month}`.padStart(2, '0')
  const day = `${props.day}`.padStart(2, '0')

  return !isNaN(Date.parse(`${year}-${month}-${day}`))
}

function isValidDay(day?: number): day is number {
  const date = { day, month: 12, year: 2020 }
  return isValidateDate(date)
}

function isValidMonth(month?: number): month is number {
  const date = { day: 1, month, year: 2020 }
  return isValidateDate(date)
}

function isValidYear(year?: number): year is number {
  const date = { day: 1, month: 12, year }
  return isValidateDate(date) && date.year >= 1000
}

export const AbsoluteDateValues = ({ value = {}, updateValue }: Props) => {
  const [year, setYear] = useState(() =>
    isInt(value.year) ? `${value.year}` : undefined
  )

  const [month, setMonth] = useState(() =>
    isInt(value.month) ? `${value.month}`.padStart(2, '0') : undefined
  )

  const [day, setDay] = useState(() =>
    isInt(value.day) ? `${value.day}`.padStart(2, '0') : undefined
  )

  useEffect(() => {
    const parsedDay = tryParseInt(day)
    const parsedMonth = tryParseInt(month)
    const parsedYear = tryParseInt(year)

    if (
      parsedDay === value.day &&
      parsedMonth === value.month &&
      parsedYear === value.year
    ) {
      return
    }

    if (
      !isValidDay(parsedDay) ||
      !isValidMonth(parsedMonth) ||
      !isValidYear(parsedYear)
    ) {
      return
    }

    if (isValid(new Date(parsedYear, parsedMonth - 1, parsedDay))) {
      updateValue({ year: parsedYear, month: parsedMonth, day: parsedDay })
    }
  }, [year, month, day])

  function dayChanged(e: ChangeEvent<HTMLInputElement>) {
    const day = e.target.value
    if (Number(day) <= 31) {
      setDay(day)
    }
  }

  function monthChanged(e: ChangeEvent<HTMLInputElement>) {
    const month = e.target.value
    if (Number(month) <= 12) {
      setMonth(month)
    }
  }

  function yearChanged(e: ChangeEvent<HTMLInputElement>) {
    const year = e.target.value
    setYear(year)
  }

  return (
    <div className="govuk-date-input">
      <div className="govuk-date-input__item">
        <div className="govuk-form-group">
          <label htmlFor="cond-value-day" className="govuk-label">
            Day
          </label>
          <input
            className="govuk-input govuk-input--width-2"
            id="cond-value-day"
            name="cond-value-day"
            type="number"
            maxLength={2}
            minLength={2}
            min={1}
            max={31}
            value={day}
            required
            onChange={dayChanged}
          />
        </div>
      </div>
      <div className="govuk-date-input__item">
        <div className="govuk-form-group">
          <label htmlFor="cond-value-month" className="govuk-label">
            Month
          </label>
          <input
            className="govuk-input govuk-input--width-2"
            id="cond-value-month"
            name="cond-value-month"
            type="number"
            maxLength={2}
            minLength={2}
            min={1}
            max={12}
            value={month}
            required
            onChange={monthChanged}
          />
        </div>
      </div>
      <div className="govuk-date-input__item">
        <div className="govuk-form-group">
          <label htmlFor="cond-value-year" className="govuk-label">
            Year
          </label>
          <input
            className="govuk-input govuk-input--width-4"
            id="cond-value-year"
            name="cond-value-year"
            type="number"
            maxLength={4}
            minLength={4}
            value={year}
            required
            onChange={yearChanged}
          />
        </div>
      </div>
    </div>
  )
}
