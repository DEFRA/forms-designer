import { FormMetricName, FormMetricType, FormStatus } from '@defra/forms-model'

import {
  buildAriaLabel,
  buildChangePhrase,
  metricsViewModel
} from '~/src/models/admin/metrics.js'

/**
 * @param {string} title
 * @param {string} ariaPeriod
 * @param {string} straplinePeriod
 */
function getExpectedTile(title, ariaPeriod, straplinePeriod) {
  return {
    ariaLabel: `There has been no change compared to the ${ariaPeriod}`,
    changePercentage: 'NaN',
    changeSymbol: '',
    changeValue: 0,
    count: 0,
    strapline: `No difference in forms created than ${straplinePeriod}`,
    title
  }
}

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

  describe('metricsViewModel', () => {
    it('should populate model', () => {
      const mockMetrics = {
        overview: [
          {
            type: FormMetricType.OverviewMetric,
            formId: 'form-id-1',
            formStatus: FormStatus.Draft,
            summaryMetrics: {
              name: 'form1'
            },
            featureCounts: {},
            updatedAt: new Date()
          }
        ],
        totals: {
          last7Days: {
            [FormMetricName.Submissions]: 10
          },
          prev7Days: {
            [FormMetricName.Submissions]: 5
          },
          last30Days: {},
          prev30Days: {},
          lastYear: {},
          prevYear: {},
          allTime: {},
          submissions: {},
          updatedAt: new Date('2026-01-01T00:00:00.000Z')
        }
      }

      // @ts-expect-error - partial data mocked
      const model = metricsViewModel(mockMetrics)

      expect(model).toEqual({
        formMetricRows: [
          {
            daysToPublish: '-',
            features: [],
            formName: 'form1',
            name: 'form1',
            submissions: 0
          }
        ],
        overviewMetrics: {
          last7Days: {
            fromDate: '25 December 2025',
            toDate: '1 January 2026',
            title: 'Last 7 days',
            newFormsCreated: getExpectedTile(
              'New forms created',
              'previous 7 days',
              'last week'
            ),
            formsPublished: getExpectedTile(
              'Forms published',
              'previous 7 days',
              'last week'
            ),
            formSubmissions: getExpectedTile(
              'Form submissions',
              'previous 7 days',
              'last week'
            )
          },
          last30Days: {
            fromDate: '2 December 2025',
            toDate: '1 January 2026',
            title: 'Last 30 days',
            newFormsCreated: getExpectedTile(
              'New forms created',
              'previous 30 days',
              'last month'
            ),
            formsPublished: getExpectedTile(
              'Forms published',
              'previous 30 days',
              'last month'
            ),
            formSubmissions: getExpectedTile(
              'Form submissions',
              'previous 30 days',
              'last month'
            )
          },
          allTime: {
            fromDate: undefined,
            toDate: undefined,
            title: 'All time',
            newFormsCreated: getExpectedTile(
              'New forms created',
              'previous year',
              'last year'
            ),
            formsPublished: getExpectedTile(
              'Forms published',
              'previous year',
              'last year'
            ),
            formSubmissions: getExpectedTile(
              'Form submissions',
              'previous year',
              'last year'
            )
          }
        }
      })
    })
  })
})

/**
 * @import { FormOverviewMetric, FormTotalsMetric } from '@defra/forms-model'
 */
