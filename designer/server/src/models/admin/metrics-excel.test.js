import { FormMetricType } from '@defra/forms-model'

import { excelSnapshot } from '~/src/models/admin/metrics-excel-snapshot.js'
import { getMetricsAsExcel } from '~/src/models/admin/metrics-excel.js'

describe('metrics-excel', () => {
  describe('getMetricsAsExcel', () => {
    it('should create XLSX file with correct content', async () => {
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
      // @ts-expect-error - partial mock of data
      const res = await getMetricsAsExcel(metrics)
      expect(res.toString('hex')).toEqual(excelSnapshot)
    })
  })
})
