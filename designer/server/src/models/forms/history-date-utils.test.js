import {
  formatHistoryDate,
  formatShortDate,
  formatTime,
  isSameDay
} from '~/src/models/forms/history-date-utils.js'

describe('history-date-utils', () => {
  describe('formatHistoryDate', () => {
    it('formats a Date object correctly', () => {
      const date = new Date('2019-06-14T14:01:00.000Z')
      const result = formatHistoryDate(date)
      expect(result).toMatch(/14 June 2019 at/)
    })

    it('formats a date string correctly', () => {
      const result = formatHistoryDate('2019-06-14T14:01:00.000Z')
      expect(result).toMatch(/14 June 2019 at/)
    })
  })

  describe('formatTime', () => {
    it('formats a time correctly', () => {
      const date = new Date('2019-06-14T15:30:00.000Z')
      const result = formatTime(date)
      expect(result).toMatch(/\d{1,2}:\d{2}\s*(am|pm)/i)
    })

    it('handles string input', () => {
      const result = formatTime('2019-06-14T15:30:00.000Z')
      expect(result).toMatch(/\d{1,2}:\d{2}\s*(am|pm)/i)
    })
  })

  describe('formatShortDate', () => {
    it('formats a short date correctly', () => {
      const date = new Date('2019-06-14T14:01:00.000Z')
      const result = formatShortDate(date)
      expect(result).toBe('14 June')
    })

    it('handles string input', () => {
      const result = formatShortDate('2019-06-14T14:01:00.000Z')
      expect(result).toBe('14 June')
    })
  })

  describe('isSameDay', () => {
    it('returns true for dates on the same day', () => {
      const date1 = new Date('2019-06-14T10:00:00.000Z')
      const date2 = new Date('2019-06-14T23:00:00.000Z')
      expect(isSameDay(date1, date2)).toBe(true)
    })

    it('returns false for dates on different days', () => {
      const date1 = new Date('2019-06-14T10:00:00.000Z')
      const date2 = new Date('2019-06-15T10:00:00.000Z')
      expect(isSameDay(date1, date2)).toBe(false)
    })

    it('handles string inputs', () => {
      expect(
        isSameDay('2019-06-14T10:00:00.000Z', '2019-06-14T23:00:00.000Z')
      ).toBe(true)
    })

    it('returns false for different months', () => {
      const date1 = new Date('2019-06-14T10:00:00.000Z')
      const date2 = new Date('2019-07-14T10:00:00.000Z')
      expect(isSameDay(date1, date2)).toBe(false)
    })

    it('returns false for different years', () => {
      const date1 = new Date('2019-06-14T10:00:00.000Z')
      const date2 = new Date('2020-06-14T10:00:00.000Z')
      expect(isSameDay(date1, date2)).toBe(false)
    })
  })
})
