import { type FormStatus } from '~/src/common/enums.js'
import {
  type FormMetricName,
  type FormMetricType
} from '~/src/form/form-metrics/enums.js'

export interface FormTotalMetric {
  count?: number
}

export interface FormTotalsMetric {
  type: FormMetricType.TotalsMetric
  last7Days?: Record<FormMetricName, FormTotalMetric>
  prev7Days?: Record<FormMetricName, FormTotalMetric>
  last30Days?: Record<FormMetricName, FormTotalMetric>
  prev30Days?: Record<FormMetricName, FormTotalMetric>
  lastYear?: Record<FormMetricName, FormTotalMetric>
  prevYear?: Record<FormMetricName, FormTotalMetric>
  allTime?: Record<FormMetricName, FormTotalMetric>
  submissions?: Record<string, number>
  updatedAt: Date
}

export interface FormOverviewMetric {
  type: FormMetricType.OverviewMetric
  formId: string
  formStatus: FormStatus
  summaryMetrics: Record<string, number | string | string[]>
  featureMetrics: Record<string, Map<string, number>>
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
  | FormTotalsMetric
  | FormOverviewMetric
  | FormTimelineMetric
