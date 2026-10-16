import { FormMetricType } from '@defra/forms-model'

import { excelSnapshot } from '~/src/models/admin/metrics-excel-snapshot.js'
import {
  formatYearMonthInWords,
  getMetricsAsExcel,
  getSubmissionSheetData
} from '~/src/models/admin/metrics-excel.js'

describe('metrics-excel', () => {
  describe('getMetricsAsExcel', () => {
    it('should create XLSX file with correct content', () => {
      const metrics = {
        overview: [
          {
            featureMetrics: {
              questionTypes: {
                YesNoField: 1,
                Markdown: 9,
                TextField: 7,
                RadiosField: 3,
                EmailAddressField: 2,
                TelephoneNumberField: 2,
                NumberField: 7,
                MultilineTextField: 7,
                FileUploadField: 2,
                DeclarationInCYA: 1
              },
              features: {
                'File upload': 1,
                'Email confirmation': 1,
                'Declaration in CYA': 1,
                'Conditional logic': 1
              },
              formStructure: {
                pages: 14,
                questions: 41,
                sections: 0,
                conditions: 2,
                questionTypes: 10
              }
            },
            summaryMetrics: {
              name: 'Exporter test ofrm',
              slug: 'exporter-test-form',
              organisation: 'Environment Agency',
              status: 'draft',
              pages: 14,
              questionTypes: 9,
              conditions: 2,
              sections: 0,
              features: [
                'File upload',
                'Email confirmation',
                'Declaration in CYA'
              ]
            },
            formId: '6a0c7073789bf5cdcc66eaf9',
            formStatus: 'draft',
            submissionsCount: 5
          }
        ],
        totals: {
          last7Days: {
            NewFormsCreated: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-05-18T12:48:08.241Z'
                }
              ]
            },
            Submissions: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-05-19T09:54:46.000Z'
                }
              ]
            },
            FormsFirstPublished: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-05-19T14:15:22.630Z'
                }
              ]
            },
            TimeToPublish: {
              count: 0
            },
            FormsInDraft: {
              count: 10
            }
          },
          prev7Days: {},
          last30Days: {
            Submissions: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-04-27T09:54:46.000Z'
                }
              ]
            },
            NewFormsCreated: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-05-14T13:54:31.270Z'
                }
              ]
            },
            FormsFirstPublished: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-05-14T13:57:20.155Z'
                }
              ]
            },
            TimeToPublish: {
              count: 15
            },
            FormsInDraft: {
              count: 388
            }
          },
          prev30Days: {},
          lastYear: {
            Submissions: {
              count: 2,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 2,
                  createdAt: '2026-03-11T10:54:46.000Z'
                }
              ]
            },
            NewFormsCreated: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-02-24T08:50:24.866Z'
                }
              ]
            },
            FormsFirstPublished: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-03-03T16:19:33.878Z'
                }
              ]
            },
            TimeToPublish: {
              count: 2.1818181818181817
            },
            FormsRePublished: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-03-06T15:03:17.594Z'
                }
              ]
            },
            FormsInDraft: {
              count: 15
            }
          },
          prevYear: {},
          allTime: {
            Submissions: {
              count: 2,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 2,
                  createdAt: '2026-03-11T10:54:46.000Z'
                }
              ]
            },
            NewFormsCreated: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-02-24T08:50:24.866Z'
                }
              ]
            },
            FormsFirstPublished: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-03-03T16:19:33.878Z'
                }
              ]
            },
            TimeToPublish: {
              count: 2.1818181818181817
            },
            FormsRePublished: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-03-06T15:03:17.594Z'
                }
              ]
            },
            FormsInDraft: {
              count: 388
            }
          },
          liveSubmissions: {
            '6a0c7073789bf5cdcc66eaf9': 2
          },
          draftSubmissions: {
            '6a0c7073789bf5cdcc66eaf9': 1
          },
          daysToPublish: {
            '6a0c7073789bf5cdcc66eaf9': 15
          },
          republished: {
            '6a0c7073789bf5cdcc66eaf9': 1
          },
          earliestDate: '2026-02-24T10:54:46.000Z',
          updatedAt: '2026-05-25T08:54:54.297Z',
          type: FormMetricType.TotalsMetric
        }
      }

      const metricsWelsh = {
        overview: [
          {
            featureMetrics: {
              questionTypes: {
                YesNoField: 1,
                Markdown: 9,
                TextField: 7,
                RadiosField: 3,
                EmailAddressField: 2,
                TelephoneNumberField: 2,
                NumberField: 7,
                MultilineTextField: 7,
                FileUploadField: 2,
                DeclarationInCYA: 1
              },
              features: {
                'File upload': 1,
                'Email confirmation': 1,
                'Declaration in CYA': 1,
                'Conditional logic': 1,
                'Welsh translation': 1
              },
              formStructure: {
                pages: 14,
                questions: 41,
                sections: 0,
                conditions: 2,
                questionTypes: 10
              }
            },
            summaryMetrics: {
              name: 'Exporter test ofrm',
              slug: 'exporter-test-form',
              organisation: 'Environment Agency',
              status: 'draft',
              pages: 14,
              questionTypes: 9,
              conditions: 2,
              sections: 0,
              features: [
                'File upload',
                'Email confirmation',
                'Declaration in CYA',
                'Welsh translation'
              ]
            },
            formId: '6a0c7073789bf5cdcc66eaf9',
            formStatus: 'draft',
            submissionsCount: 1
          }
        ],
        totals: {
          last7Days: {
            NewFormsCreated: {
              count: 0,
              details: []
            },
            Submissions: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-05-19T09:54:46.000Z'
                }
              ]
            },
            FormsFirstPublished: {
              count: 0,
              details: []
            },
            TimeToPublish: {
              count: 0
            },
            FormsInDraft: {
              count: 1
            }
          },
          prev7Days: {},
          last30Days: {
            Submissions: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-04-27T09:54:46.000Z'
                }
              ]
            },
            NewFormsCreated: {
              count: 0,
              details: []
            },
            FormsFirstPublished: {
              count: 0,
              details: []
            },
            TimeToPublish: {
              count: 1
            },
            FormsInDraft: {
              count: 1
            }
          },
          prev30Days: {},
          lastYear: {
            Submissions: {
              count: 0,
              details: []
            },
            NewFormsCreated: {
              count: 0,
              details: []
            },
            FormsFirstPublished: {
              count: 0,
              details: []
            },
            TimeToPublish: {
              count: 0
            },
            FormsRePublished: {
              count: 0,
              details: []
            },
            FormsInDraft: {
              count: 1
            }
          },
          prevYear: {},
          allTime: {
            Submissions: {
              count: 2,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 2,
                  createdAt: '2026-03-11T10:54:46.000Z'
                }
              ]
            },
            NewFormsCreated: {
              count: 1,
              details: [
                {
                  formId: '6a0c7073789bf5cdcc66eaf9',
                  metricValue: 1,
                  createdAt: '2026-02-24T08:50:24.866Z'
                }
              ]
            },
            FormsFirstPublished: {
              count: 0,
              details: []
            },
            TimeToPublish: {
              count: 0
            },
            FormsRePublished: {
              count: 0,
              details: []
            },
            FormsInDraft: {
              count: 1
            }
          },
          liveSubmissions: {
            '6a0c7073789bf5cdcc66eaf9': 2
          },
          draftSubmissions: {
            '6a0c7073789bf5cdcc66eaf9': 1
          },
          daysToPublish: {
            '6a0c7073789bf5cdcc66eaf9': 15
          },
          republished: {
            '6a0c7073789bf5cdcc66eaf9': 1
          },
          earliestDate: '2026-02-24T10:54:46.000Z',
          updatedAt: '2026-05-25T08:54:54.297Z',
          type: FormMetricType.TotalsMetric
        }
      }

      const submissionsPerMonth = {
        '2026-02': {
          '6a0c7073789bf5cdcc66eaf9': 15
        }
      }

      // @ts-expect-error - partial mock of data
      const res = getMetricsAsExcel(metrics, metricsWelsh, submissionsPerMonth)
      // Check the generated XLSX file against an example we know is correct
      // The snapshot is stored in hex
      expect(res.toString('hex')).toEqual(excelSnapshot)
    })
  })

  describe('getSubmittedSheetData', () => {
    it('should build up columns and data rows', () => {
      const submissionsPerMonth =
        /** @type {Record<string, Record<string, number>>} */
        ({
          '2026-04': {
            'form-id-2': 5,
            'form-id-1': 3
          },
          '2026-05': {
            'form-id-3': 2,
            'form-id-2': 1
          }
        })
      const metrics = {
        overview: [
          {
            formId: 'form-id-1',
            summaryMetrics: {
              name: 'Form 1'
            }
          },
          {
            formId: 'form-id-2',
            summaryMetrics: {
              name: 'Form 2'
            }
          },
          {
            formId: 'form-id-4',
            summaryMetrics: {
              name: 'Form 4'
            }
          },
          {
            formId: 'form-id-3',
            summaryMetrics: {
              name: 'Form 3'
            }
          }
        ]
      }
      // @ts-expect-error - partial mock of data
      const res = getSubmissionSheetData(submissionsPerMonth, metrics)
      expect(res.columns).toEqual([
        { title: 'Form name', dataKey: 'formName', attributes: { wch: 50 } },
        { title: 'Apr-26', dataKey: '2026-04' },
        { title: 'May-26', dataKey: '2026-05' }
      ])
      expect(res.data).toEqual([
        { '2026-04': 3, '2026-05': 0, formName: 'Form 1' },
        { '2026-04': 5, '2026-05': 1, formName: 'Form 2' },
        { '2026-04': 0, '2026-05': 2, formName: 'Form 3' },
        { '2026-04': 0, '2026-05': 0, formName: 'Form 4' }
      ])
    })
  })

  describe('formatYearMonthInWords', () => {
    it('should convert year-month to correct format', () => {
      expect(formatYearMonthInWords('2025-01')).toBe('Jan-25')
      expect(formatYearMonthInWords('2025-02')).toBe('Feb-25')
      expect(formatYearMonthInWords('2025-03')).toBe('Mar-25')
      expect(formatYearMonthInWords('2025-04')).toBe('Apr-25')
      expect(formatYearMonthInWords('2025-05')).toBe('May-25')
      expect(formatYearMonthInWords('2025-06')).toBe('Jun-25')
      expect(formatYearMonthInWords('2025-07')).toBe('Jul-25')
      expect(formatYearMonthInWords('2025-08')).toBe('Aug-25')
      expect(formatYearMonthInWords('2025-09')).toBe('Sep-25')
      expect(formatYearMonthInWords('2025-10')).toBe('Oct-25')
      expect(formatYearMonthInWords('2025-11')).toBe('Nov-25')
      expect(formatYearMonthInWords('2025-12')).toBe('Dec-25')
      expect(formatYearMonthInWords('2026-01')).toBe('Jan-26')
      expect(formatYearMonthInWords('2026-02')).toBe('Feb-26')
    })
  })
})

/**
 * @import { FormOverviewMetric, FormTotalsMetric } from '@defra/forms-model'
 */
