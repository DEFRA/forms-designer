import { FormMetricName, FormMetricType, FormStatus } from '@defra/forms-model'

import {
  MetricsTileConfig,
  buildAriaLabel,
  buildChangePhrase,
  calcChangePercentage,
  componentUsageFormStructures,
  mapOverviewMetrics,
  oneDecimalPlace
} from '~/src/models/admin/metrics-helper.js'

describe('metrics model', () => {
  describe('buildAriaLabel', () => {
    it('should build label when no change from previous period', () => {
      const label = buildAriaLabel('', 0, 0, 'last 7 days')
      expect(label).toBe('There has been no change compared to the last 7 days')
    })

    it('should build label when positive change from previous period', () => {
      const label = buildAriaLabel('+', 10, 5.1, 'last 7 days')
      expect(label).toBe(
        'There has been an increase of 10 (+5.1%) compared to the last 7 days'
      )
    })

    it('should build label when negative change from previous period', () => {
      const label = buildAriaLabel('-', 7, -3.1, 'last 7 days')
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
      expect(calcChangePercentage(0, 0)).toBe(0)
    })
    it('should handle zero for previous', () => {
      expect(calcChangePercentage(1, 0)).toBe(100)
    })
    it('should handle normal percentage', () => {
      expect(calcChangePercentage(1, 2)).toBe(-50)
    })
    it('should truncate to one decimal place', () => {
      expect(calcChangePercentage(1, 3)).toBe(-66.7)
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
      expect(mapOverviewMetrics(metrics)).toEqual([
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
            features: ['Email', 'File upload'],
            republished: 2,
            daysToPublish: 17
          },
          featureMetrics: {},
          submissionsCount: 4,

          updatedAt: new Date('2026-01-01')
        }
      ])
      expect(mapOverviewMetrics(metrics)).toEqual([
        {
          features: 'Email, File upload',
          name: 'form-name',
          formName: 'form-name',
          submissions: 4,
          daysToPublish: 17,
          republished: 2
        }
      ])
    })
  })

  describe('oneDecimalPlace', () => {
    it('should handle zero', () => {
      expect(oneDecimalPlace(0)).toBe(0)
    })
    it('should handle 1 decimal place', () => {
      expect(oneDecimalPlace(5.2)).toBe(5.2)
    })
    it('should handle 2 decimal places', () => {
      expect(oneDecimalPlace(5.26)).toBe(5.3)
    })
    it('should handle many decimal places', () => {
      expect(oneDecimalPlace(5.2169034)).toBe(5.2)
    })
    it('should handle Infinity', () => {
      expect(oneDecimalPlace(10 / 0)).toBe(Infinity)
    })
  })

  describe('componentUsageFormStructures', () => {
    it('should handle no metrics', () => {
      const metrics =
        /** @type {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} */ ({
          overview: [],
          totals: {
            type: FormMetricType.TotalsMetric,
            updatedAt: new Date(),
            earliestDate: new Date('2025-03-01')
          }
        })
      expect(componentUsageFormStructures(metrics, FormStatus.Draft)).toEqual(
        []
      )
    })

    it('should calculate min/max/avg', () => {
      const metrics = {
        overview: [
          {
            type: FormMetricType.OverviewMetric,
            formId: 'form-id-1',
            formStatus: FormStatus.Draft,
            summaryMetrics: {},
            featureMetrics: {
              formStructure: /** @type {Record<string, number>} */ ({
                pages: 5,
                sections: 3,
                conditions: 2,
                questionTypes: 10
              })
            },
            submissionsCount: 0,
            updatedAt: new Date()
          },
          {
            type: FormMetricType.OverviewMetric,
            formId: 'form-id-2',
            formStatus: FormStatus.Draft,
            summaryMetrics: {},
            featureMetrics: {
              formStructure: /** @type {Record<string, number>} */ ({
                pages: 17,
                sections: 7,
                conditions: 4,
                questionTypes: 11
              })
            },
            submissionsCount: 0,
            updatedAt: new Date()
          }
        ],
        totals: {
          type: FormMetricType.TotalsMetric,
          updatedAt: new Date()
        }
      }
      // @ts-expect-error - partial mock of data
      expect(componentUsageFormStructures(metrics, FormStatus.Draft)).toEqual([
        {
          metricName: 'Pages per form',
          minimum: 5,
          maximum: 17,
          average: '11.0'
        },
        {
          metricName: 'Sections per form',
          minimum: 3,
          maximum: 7,
          average: '5.0'
        },
        {
          metricName: 'Conditions per form',
          minimum: 2,
          maximum: 4,
          average: '3.0'
        },
        {
          metricName: 'Question types per form',
          minimum: 10,
          maximum: 11,
          average: '10.5'
        }
      ])
    })
  })

  describe('MetricsTileConfig formatting functions', () => {
    it('should format date for NewFormsCreated', () => {
      const config = MetricsTileConfig[FormMetricName.NewFormsCreated]
      const res = config.drillDown.valueFunc
        ? config.drillDown.valueFunc(
            // @ts-expect-error - partial mock of data
            {
              createdAt: new Date('2026-02-03T13:25:00.000Z')
            }
          )
        : undefined
      expect(res).toEqual({
        attributes: {
          'data-sort-value': '2026-02-03 13:25:00'
        },
        text: '03 Feb 2026 1:25 pm'
      })
    })

    it('should format date for FormsFirstPublished', () => {
      const config = MetricsTileConfig[FormMetricName.FormsFirstPublished]
      const res = config.drillDown.valueFunc
        ? config.drillDown.valueFunc(
            // @ts-expect-error - partial mock of data
            {
              createdAt: new Date('2026-02-03T13:25:00.000Z')
            }
          )
        : undefined
      expect(res).toEqual({
        attributes: {
          'data-sort-value': '2026-02-03 13:25:00'
        },
        text: '03 Feb 2026 1:25 pm'
      })
    })

    it('should format date for FormsRePublished', () => {
      const config = MetricsTileConfig[FormMetricName.FormsRePublished]
      const res = config.drillDown.valueFunc
        ? config.drillDown.valueFunc(
            // @ts-expect-error - partial mock of data
            {
              metricValue: 1500
            }
          )
        : undefined
      expect(res).toEqual({
        attributes: {
          'data-sort-value': 1500
        },
        text: '1,500'
      })
    })

    it('should format date for Submissions', () => {
      const config = MetricsTileConfig[FormMetricName.Submissions]
      const res = config.drillDown.valueFunc
        ? config.drillDown.valueFunc(
            // @ts-expect-error - partial mock of data
            {
              metricValue: 1500
            }
          )
        : undefined
      expect(res).toEqual({
        attributes: {
          'data-sort-value': 1500
        },
        text: '1,500'
      })
    })
  })
})

/**
 * @import { FormOverviewMetric, FormTotalsMetric } from '@defra/forms-model'
 */
