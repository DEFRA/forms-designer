import { type FormStatus } from '~/src/common/enums.js'
import { type FormMetricType } from '~/src/form/form-metrics/enums.js'

export interface FormHeadlineDetail {
  count: number
  countSevenDaysAgo: number
  countThirtyDaysAgo: number
  countOneYearAgo: number
}

export interface FormHeadlineMetric {
  type: FormMetricType.HeadlineMetric
  headlineCounts: Record<string, FormHeadlineDetail>
  updatedAt: Date
}

export interface FormOverviewMetric {
  type: FormMetricType.OverviewMetric
  formId: string
  formStatus: FormStatus
  summaryMetrics: Record<string, number | string | string[]>
  featureCounts: Record<string, number>
  submissionsCount: number
  updatedAt: Date
}

export interface FormTimelineMetric {
  type: FormMetricType.TimelineMetric
  formId: string
  formStatus: FormStatus
  metricName: string
  metricValue: number
  createdAt: Date
}

export type FormMetric =
  | FormHeadlineMetric
  | FormOverviewMetric
  | FormTimelineMetric
