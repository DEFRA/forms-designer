import { isValid } from 'date-fns'
import React, { useEffect, useState, type ChangeEvent } from 'react'

import { tryParseInt } from '~/src/conditions/inline-condition-helpers.js'

export interface YearMonthDay {
  year: number
  month: number
  day: number
}

interface Props {
  value?: Partial<YearMonthDay>
  updateValue: (value?: YearMonthDay) => void
}

function isValidateDate(
  props: Readonly<Partial<YearMonthDay>>
): props is YearMonthDay {
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

export const AbsoluteDateValues = (props: Readonly<Props>) => {
  const { value, updateValue } = props

  const [year, setYear] = useState(value?.year)
  const [month, setMonth] = useState(value?.month)
  const [day, setDay] = useState(value?.day)

  useEffect(() => {
    const parsedDay = tryParseInt(day)
    const parsedMonth = tryParseInt(month)
    const parsedYear = tryParseInt(year)

    if (
      parsedDay === value?.day &&
      parsedMonth === value?.month &&
      parsedYear === value?.year
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
    const { valueAsNumber: day } = e.target

    if (isValidDay(day)) {
      setDay(day)
    }
  }

  function monthChanged(e: ChangeEvent<HTMLInputElement>) {
    const { valueAsNumber: month } = e.target

    if (isValidMonth(month)) {
      setMonth(month)
    }
  }

  function yearChanged(e: ChangeEvent<HTMLInputElement>) {
    const { valueAsNumber: year } = e.target

    if (isValidYear(year)) {
      setYear(year)
    }
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
            defaultValue={day}
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
            defaultValue={month}
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
            defaultValue={year}
            required
            onChange={yearChanged}
          />
        </div>
      </div>
    </div>
  )
}
