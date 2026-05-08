import { FormMetricType, FormStatus } from '@defra/forms-model'

import {
  buildAriaLabel,
  buildChangePhrase,
  calcChangePercentage,
  mapOverviewMetrics
} from '~/src/models/admin/metrics-helper.js'

describe('metrics model', () => {
  describe('buildAriaLabel', () => {
    it('should build label when no change from previous period', () => {
      const label = buildAriaLabel('', 0, '0.0', 'last 7 days')
      expect(label).toBe('There has been no change compared to the last 7 days')
    })

    it('should build label when positive change from previous period', () => {
      const label = buildAriaLabel('+', 10, '5.1', 'last 7 days')
      expect(label).toBe(
        'There has been an increase of 10 (+5.1%) compared to the last 7 days'
      )
    })

    it('should build label when negative change from previous period', () => {
      const label = buildAriaLabel('-', 7, '-3.1', 'last 7 days')
      expect(label).toBe(
        'There has been a decrease of 7 (-3.1%) compared to the last 7 days'
      )
    })
  })

  describe('buildChangePhrase', () => {
    it('should build label when no change from previous period', () => {
      const phrase = buildChangePhrase({ changeSymbol: '', changeValue: 0 })
      expect(phrase).toBe('No difference in')
    })

    it('should build label when positive change from previous period', () => {
      const phrase = buildChangePhrase({ changeSymbol: '+', changeValue: 12 })
      expect(phrase).toBe('12 more')
    })

    it('should build label when negative change from previous period', () => {
      const phrase = buildChangePhrase({ changeSymbol: '-', changeValue: 3 })
      expect(phrase).toBe('3 fewer')
    })
  })

  describe('calcChangePercentage', () => {
    it('should handle zero for current and previous', () => {
      expect(calcChangePercentage(0, 0)).toBe('-')
    })
    it('should handle zero for previous', () => {
      expect(calcChangePercentage(1, 0)).toBe('100')
    })
    it('should handle normal percentage', () => {
      expect(calcChangePercentage(1, 2)).toBe('-50.0')
    })
  })

  describe('mapOverviewMetrics', () => {
    it('should map all metric types when maps empty and draft', () => {
      const metrics = /** @type {FormOverviewMetric[]} */ ([
        {
          type: FormMetricType.OverviewMetric,
          formStatus: FormStatus.Draft,
          formId: 'form-id',
          summaryMetrics: {
            name: 'form-name',
            features: []
          },
          featureMetrics: {},
          submissionsCount: 0,
          updatedAt: new Date('2026-01-01')
        }
      ])
      const submissionCountsDraft = new Map()
      const submissionCountsLive = new Map()
      const formDaysToPublish = new Map()
      const formRepublished = new Map()
      expect(
        mapOverviewMetrics(
          metrics,
          submissionCountsDraft,
          submissionCountsLive,
          formDaysToPublish,
          formRepublished
        )
      ).toEqual([
        {
          daysToPublish: '-',
          features: '',
          name: 'form-name',
          formName: 'form-name',
          republished: '-',
          submissions: 0
        }
      ])
    })

    it('should map all metric types when live', () => {
      const metrics = /** @type {FormOverviewMetric[]} */ ([
        {
          type: FormMetricType.OverviewMetric,
          formStatus: FormStatus.Live,
          formId: 'form-id',
          summaryMetrics: {
            name: 'form-name',
            features: ['Email', 'File upload']
          },
          featureMetrics: {},
          submissionsCount: 0,
          updatedAt: new Date('2026-01-01')
        }
      ])
      const submissionCountsDraft = new Map([['form-id', 3]])
      const submissionCountsLive = new Map([['form-id', 7]])
      const formDaysToPublish = new Map([['form-id', 17]])
      const formRepublished = new Map([['form-id', 2]])
      expect(
        mapOverviewMetrics(
          metrics,
          submissionCountsDraft,
          submissionCountsLive,
          formDaysToPublish,
          formRepublished
        )
      ).toEqual([
        {
          features: 'Email, File upload',
          name: 'form-name',
          formName: 'form-name',
          submissions: 7,
          daysToPublish: 17,
          republished: 2
        }
      ])
    })
  })
})

/**
 * @import { FormOverviewMetric } from '@defra/forms-model'
 */
