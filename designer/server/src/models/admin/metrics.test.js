import { FormMetricName, FormMetricType, FormStatus } from '@defra/forms-model'

import config from '~/src/config.js'
import {
  combineModel,
  getLiveMetricsAsCsv,
  metricsComponentUsageViewModel,
  metricsFormActivityViewModel
} from '~/src/models/admin/metrics.js'

jest.mock('~/src/config.ts')

/**
 * @param {string} title
 * @param {string} ariaPeriod
 * @param {string} strapline
 */
function getExpectedTile(title, ariaPeriod, strapline) {
  return {
    ariaLabel: `There has been no change compared to the ${ariaPeriod}`,
    changePercentage: '-',
    changeSymbol: '',
    changeValue: 0,
    count: 0,
    strapline,
    title
  }
}

describe('metrics models', () => {
  describe('metricsFormActivityViewModel', () => {
    it('should populate form activity model', () => {
      const mockMetrics = {
        overview: [
          {
            type: FormMetricType.OverviewMetric,
            formId: 'form-id-2',
            formStatus: FormStatus.Draft,
            summaryMetrics: {
              name: 'form2'
            },
            featureMetrics: {},
            updatedAt: new Date()
          },
          {
            type: FormMetricType.OverviewMetric,
            formId: 'form-id-1',
            formStatus: FormStatus.Draft,
            summaryMetrics: {
              name: 'form1'
            },
            featureMetrics: {},
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
          draftSubmissions: {
            'form-id-1': 5,
            'form-id-2': 2
          },
          liveSubmissions: {
            'form-id-1': 3
          },
          updatedAt: new Date('2026-01-01T00:00:00.000Z')
        }
      }

      // @ts-expect-error - partial data mocked
      const model = metricsFormActivityViewModel(mockMetrics)

      expect(model).toEqual({
        formMetricRows: [
          {
            daysToPublish: '-',
            features: [],
            formName: 'form1',
            name: 'form1',
            submissions: 5,
            republished: '-'
          },
          {
            daysToPublish: '-',
            features: [],
            formName: 'form2',
            name: 'form2',
            submissions: 2,
            republished: '-'
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
              'No difference in forms created than last week'
            ),
            formsPublished: getExpectedTile(
              'Forms published',
              'previous 7 days',
              'No difference in forms published than last week'
            ),
            formSubmissions: getExpectedTile(
              'Form submissions',
              'previous 7 days',
              'No difference in submissions  than last week'
            ),
            formsInDraft: getExpectedTile(
              'Forms in draft',
              'previous 7 days',
              'No difference in forms  than last week'
            ),
            timeToPublish: {
              ...getExpectedTile(
                'Average time to publish',
                'previous 7 days',
                'No difference in days  than last week'
              ),
              units: 'days'
            }
          },
          last30Days: {
            fromDate: '2 December 2025',
            toDate: '1 January 2026',
            title: 'Last 30 days',
            newFormsCreated: getExpectedTile(
              'New forms created',
              'previous 30 days',
              'No difference in forms created than last month'
            ),
            formsPublished: getExpectedTile(
              'Forms published',
              'previous 30 days',
              'No difference in forms published than last month'
            ),
            formSubmissions: getExpectedTile(
              'Form submissions',
              'previous 30 days',
              'No difference in submissions  than last month'
            ),
            formsInDraft: getExpectedTile(
              'Forms in draft',
              'previous 30 days',
              'No difference in forms  than last month'
            ),
            timeToPublish: {
              ...getExpectedTile(
                'Average time to publish',
                'previous 30 days',
                'No difference in days  than last month'
              ),
              units: 'days'
            }
          },
          allTime: {
            fromDate: undefined,
            toDate: undefined,
            title: 'All time',
            newFormsCreated: getExpectedTile(
              'New forms created',
              'previous year',
              'No difference in forms created than last year'
            ),
            formsPublished: getExpectedTile(
              'Forms published',
              'previous year',
              'No difference in forms published than last year'
            ),
            formSubmissions: getExpectedTile(
              'Form submissions',
              'previous year',
              'No difference in submissions  than last year'
            ),
            formsInDraft: getExpectedTile(
              'Forms in draft',
              'previous year',
              'No difference in forms  than last year'
            ),
            timeToPublish: {
              ...getExpectedTile(
                'Average time to publish',
                'previous year',
                'No difference in days  than last year'
              ),
              units: 'days'
            }
          }
        }
      })
    })
  })

  describe('metricsComponentUsageViewModel', () => {
    it('should populate component usage model', () => {
      const mockMetrics = {
        overview: [
          {
            type: FormMetricType.OverviewMetric,
            formId: 'form-id-1',
            formStatus: FormStatus.Draft,
            summaryMetrics: {
              name: 'form1'
            },
            featureMetrics: {
              features: {
                'File upload': 1,
                'Email confirmation': 1,
                'GOV.UK Pay': 1,
                Declarations: 1,
                Sections: 1
              },
              formStructure: {
                conditions: 0,
                pages: 4,
                questionTypes: 6,
                questions: 9,
                sections: 1
              },
              questionTypes: {
                CheckboxesField: 2,
                DeclarationField: 1,
                FileUploadField: 1,
                PaymentField: 1,
                RadiosField: 1,
                TextField: 3
              }
            },
            updatedAt: new Date()
          },
          {
            type: FormMetricType.OverviewMetric,
            formId: 'form-id-2',
            formStatus: FormStatus.Draft,
            summaryMetrics: {
              name: 'form2'
            },
            featureMetrics: {
              features: {
                'File upload': 1,
                'Email confirmation': 1,
                Declarations: 1,
                Sections: 1
              },
              formStructure: {
                conditions: 1,
                pages: 7,
                questionTypes: 8,
                questions: 11,
                sections: 2
              },
              questionTypes: {
                CheckboxesField: 3,
                DeclarationField: 1,
                FileUploadField: 1,
                RadiosField: 2,
                TextField: 7
              }
            },
            updatedAt: new Date()
          }
        ]
      }

      // @ts-expect-error - partial data mocked
      const model = metricsComponentUsageViewModel(mockMetrics)

      expect(model).toEqual({
        formUsageQuestionTypes: [
          {
            questionTypeName: 'TextField',
            draft: {
              questionTypeName: 'TextField',
              totalUsage: 10,
              formsUsing: 2,
              percentage: '100.0%'
            },
            live: {}
          },
          {
            questionTypeName: 'CheckboxesField',
            draft: {
              questionTypeName: 'CheckboxesField',
              totalUsage: 5,
              formsUsing: 2,
              percentage: '100.0%'
            },
            live: {}
          },
          {
            questionTypeName: 'RadiosField',
            draft: {
              questionTypeName: 'RadiosField',
              totalUsage: 3,
              formsUsing: 2,
              percentage: '100.0%'
            },
            live: {}
          },
          {
            questionTypeName: 'DeclarationField',
            draft: {
              questionTypeName: 'DeclarationField',
              totalUsage: 2,
              formsUsing: 2,
              percentage: '100.0%'
            },
            live: {}
          },
          {
            questionTypeName: 'FileUploadField',
            draft: {
              questionTypeName: 'FileUploadField',
              totalUsage: 2,
              formsUsing: 2,
              percentage: '100.0%'
            },
            live: {}
          },
          {
            questionTypeName: 'PaymentField',
            draft: {
              questionTypeName: 'PaymentField',
              totalUsage: 1,
              formsUsing: 1,
              percentage: '50.0%'
            },
            live: {}
          }
        ],
        formUsageFeatures: [
          {
            featureName: 'File upload',
            draft: {
              featureName: 'File upload',
              formsUsing: 2,
              percentage: '100.0%'
            },
            live: {}
          },
          {
            featureName: 'Email confirmation',
            draft: {
              featureName: 'Email confirmation',
              formsUsing: 2,
              percentage: '100.0%'
            },
            live: {}
          },
          {
            featureName: 'Declarations',
            draft: {
              featureName: 'Declarations',
              formsUsing: 2,
              percentage: '100.0%'
            },
            live: {}
          },
          {
            featureName: 'Sections',
            draft: {
              featureName: 'Sections',
              formsUsing: 2,
              percentage: '100.0%'
            },
            live: {}
          },
          {
            featureName: 'GOV.UK Pay',
            draft: {
              featureName: 'GOV.UK Pay',
              formsUsing: 1,
              percentage: '50.0%'
            },
            live: {}
          }
        ],
        formUsageFormStructures: [
          {
            metricName: 'Conditions per form',
            draft: {
              metricName: 'Conditions per form',
              average: '0.5',
              minimum: 0,
              maximum: 1
            },
            live: {}
          },
          {
            metricName: 'Pages per form',
            draft: {
              metricName: 'Pages per form',
              average: '5.5',
              minimum: 4,
              maximum: 7
            },
            live: {}
          },
          {
            metricName: 'Question types per form',
            draft: {
              metricName: 'Question types per form',
              average: '7.0',
              minimum: 6,
              maximum: 8
            },
            live: {}
          },
          {
            metricName: 'Questions per form',
            draft: {
              metricName: 'Questions per form',
              average: '10.0',
              minimum: 9,
              maximum: 11
            },
            live: {}
          },
          {
            metricName: 'Sections per form',
            draft: {
              metricName: 'Sections per form',
              average: '1.5',
              minimum: 1,
              maximum: 2
            },
            live: {}
          }
        ]
      })
    })
  })

  describe('combineModel', () => {
    it('should add live metrics alongside existing draft ones', () => {
      const combinedElement = [
        {
          questionTypeName: 'TextField',
          draft: {
            questionTypeName: 'TextField',
            totalUsage: 10,
            formsUsing: 2,
            percentage: '100.0%'
          },
          live: {}
        }
      ]
      const liveElement = [
        {
          questionTypeName: 'TextField',
          totalUsage: 6,
          formsUsing: 1,
          percentage: '30.0%'
        }
      ]
      combineModel(combinedElement, liveElement, 'questionTypeName')

      expect(combinedElement).toEqual([
        {
          questionTypeName: 'TextField',
          draft: {
            questionTypeName: 'TextField',
            totalUsage: 10,
            formsUsing: 2,
            percentage: '100.0%'
          },
          live: {
            questionTypeName: 'TextField',
            totalUsage: 6,
            formsUsing: 1,
            percentage: '30.0%'
          }
        }
      ])
    })

    it('should add live metrics alongside missing draft ones', () => {
      /** @type {FormTimelineMetric[]} */
      const combinedElement = []
      const liveElement = [
        {
          questionTypeName: 'TextField',
          totalUsage: 6,
          formsUsing: 1,
          percentage: '30.0%'
        }
      ]
      combineModel(combinedElement, liveElement, 'questionTypeName')

      expect(combinedElement).toEqual([
        {
          questionTypeName: 'TextField',
          draft: {},
          live: {
            questionTypeName: 'TextField',
            totalUsage: 6,
            formsUsing: 1,
            percentage: '30.0%'
          }
        }
      ])
    })
  })

  describe('getLiveMetricsAsCsv', () => {
    it('should generate live CSV', () => {
      jest.mocked(config).appBaseUrl = 'http://app-base-url:3000'
      const metrics = {
        totals: {
          liveSubmissions: {
            'form-id-1': 5
          }
        },
        overview: [
          {
            formId: 'form-id-1',
            formStatus: FormStatus.Live,
            summaryMetrics: { name: 'Form 1', slug: 'form-1' }
          },
          {
            formId: 'form-id-2',
            formStatus: FormStatus.Live,
            summaryMetrics: { name: 'Form 2', slug: 'form-2' }
          },
          {
            formId: 'form-id-3',
            formStatus: FormStatus.Draft,
            summaryMetrics: { name: 'Form 3', slug: 'form-3' }
          }
        ]
      }
      // @ts-expect-error - partial mock of data
      const csvOut = getLiveMetricsAsCsv(metrics)
      expect(csvOut).toHaveLength(3)
      expect(csvOut[0]).toBe('"Form name","Form URL","Live submissions"')
      expect(csvOut[1]).toBe(
        '"Form 1","http://app-base-url:3000/library/form-1","5"'
      )
      expect(csvOut[2]).toBe(
        '"Form 2","http://app-base-url:3000/library/form-2","0"'
      )
    })
  })
})

/**
 * @import { FormTimelineMetric } from '@defra/forms-model'
 */
