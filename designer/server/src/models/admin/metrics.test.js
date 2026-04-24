import { FormMetricName, FormMetricType, FormStatus } from '@defra/forms-model'

import {
  metricsComponentUsageViewModel,
  metricsFormActivityViewModel
} from '~/src/models/admin/metrics.js'

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
          submissions: {},
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
            )
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
            )
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
            )
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
            totalUsage: 10,
            formsUsing: 2,
            percentage: '100.0%'
          },
          {
            questionTypeName: 'CheckboxesField',
            totalUsage: 5,
            formsUsing: 2,
            percentage: '100.0%'
          },
          {
            questionTypeName: 'RadiosField',
            totalUsage: 3,
            formsUsing: 2,
            percentage: '100.0%'
          },
          {
            questionTypeName: 'DeclarationField',
            totalUsage: 2,
            formsUsing: 2,
            percentage: '100.0%'
          },
          {
            questionTypeName: 'FileUploadField',
            totalUsage: 2,
            formsUsing: 2,
            percentage: '100.0%'
          },
          {
            questionTypeName: 'PaymentField',
            totalUsage: 1,
            formsUsing: 1,
            percentage: '50.0%'
          }
        ],
        formUsageFeatures: [
          { featureName: 'File upload', formsUsing: 2, percentage: '100.0%' },
          {
            featureName: 'Email confirmation',
            formsUsing: 2,
            percentage: '100.0%'
          },
          {
            featureName: 'Declarations',
            formsUsing: 2,
            percentage: '100.0%'
          },
          { featureName: 'Sections', formsUsing: 2, percentage: '100.0%' },
          { featureName: 'GOV.UK Pay', formsUsing: 1, percentage: '50.0%' }
        ],
        formUsageFormStructures: [
          {
            metricName: 'Conditions per form',
            average: '0.5',
            minimum: 0,
            maximum: 1
          },
          {
            metricName: 'Pages per form',
            average: '5.5',
            minimum: 4,
            maximum: 7
          },
          {
            metricName: 'Question types per form',
            average: '7.0',
            minimum: 6,
            maximum: 8
          },
          {
            metricName: 'Questions per form',
            average: '10.0',
            minimum: 9,
            maximum: 11
          },
          {
            metricName: 'Sections per form',
            average: '1.5',
            minimum: 1,
            maximum: 2
          }
        ]
      })
    })
  })
})
