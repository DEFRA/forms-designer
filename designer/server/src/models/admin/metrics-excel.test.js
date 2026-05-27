import { getMetricsAsExcel } from "~/src/models/admin/metrics-excel.js"

describe('metrics-excel', () => {
  describe('', () => {
    it('should create XLSX file with correct content', async () => {
      const metrics = /** @type {{overview: FormOverviewMetric[], totals: FormTotalsMetric}} */ ({
        overview: [],
        totals: {
          type: FormMetricType.TotalsMetric,
          last7Days?: {},
          prev7Days?: {},
          last30Days?: {},
          prev30Days?: {},
          lastYear?: {},
          prevYear?: {},
          allTime?: {},
          liveSubmissions?: {},
          draftSubmissions?: {},
          daysToPublish?: {},
          republished?: {},
          updatedAt: new Date('2026-03-01')
          earliestDate: Date
        }
      })
      const res = await getMetricsAsExcel(metrics)
    })
  })
})

/**
 * @import { FormOverviewMetric, FormTotalsMetric } from '@defra/forms-model'
 */
