import {
  formatHistoryDate,
  formatShortDate,
  formatTime,
  isSameDay
} from '~/src/models/forms/history-date-utils.js'

describe('history-date-utils', () => {
  describe('formatHistoryDate', () => {
    it('formats a Date object correctly in UK timezone', () => {
      // 14:01 UTC is 15:01 BST in June
      const date = new Date('2019-06-14T14:01:00.000Z')
      const result = formatHistoryDate(date)
      expect(result).toBe('14 June 2019 at 3:01pm')
    })

    it('formats a date string correctly', () => {
      const result = formatHistoryDate('2019-06-14T14:01:00.000Z')
      expect(result).toBe('14 June 2019 at 3:01pm')
    })

    it('handles winter time (GMT) correctly', () => {
      // In January, UK is on GMT so 14:01 UTC is 14:01 GMT
      const result = formatHistoryDate('2019-01-14T14:01:00.000Z')
      expect(result).toBe('14 January 2019 at 2:01pm')
    })
  })

  describe('formatTime', () => {
    it('formats a time correctly in UK timezone', () => {
      // 15:30 UTC is 16:30 BST in June
      const date = new Date('2019-06-14T15:30:00.000Z')
      const result = formatTime(date)
      expect(result).toBe('4:30pm')
    })

    it('handles string input', () => {
      const result = formatTime('2019-06-14T15:30:00.000Z')
      expect(result).toBe('4:30pm')
    })

    it('formats morning time correctly', () => {
      // 09:00 UTC is 10:00 BST in June
      const result = formatTime('2019-06-14T09:00:00.000Z')
      expect(result).toBe('10:00am')
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
    it('returns true for dates on the same day in UK timezone', () => {
      // Both times are on June 14 in UK (BST: UTC+1)
      const date1 = new Date('2019-06-14T10:00:00.000Z') // 11:00 BST
      const date2 = new Date('2019-06-14T20:00:00.000Z') // 21:00 BST
      expect(isSameDay(date1, date2)).toBe(true)
    })

    it('returns false for dates on different days in UK timezone', () => {
      // 23:00 UTC on June 14 is 00:00 BST on June 15
      const date1 = new Date('2019-06-14T10:00:00.000Z') // 11:00 BST June 14
      const date2 = new Date('2019-06-14T23:30:00.000Z') // 00:30 BST June 15
      expect(isSameDay(date1, date2)).toBe(false)
    })

    it('handles string inputs', () => {
      expect(
        isSameDay('2019-06-14T10:00:00.000Z', '2019-06-14T20:00:00.000Z')
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

    it('handles winter time (GMT) correctly', () => {
      // In January, UK is on GMT (UTC+0), so 23:30 UTC is still Jan 14
      const date1 = new Date('2019-01-14T10:00:00.000Z') // 10:00 GMT
      const date2 = new Date('2019-01-14T23:30:00.000Z') // 23:30 GMT
      expect(isSameDay(date1, date2)).toBe(true)
    })
  })
})
