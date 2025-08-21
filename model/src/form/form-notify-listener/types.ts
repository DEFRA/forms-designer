import { type FormStatus } from '~/src/common/enums.js'

// TODO: pull in from engine
type RichFormValue =
  | string
  | number
  | boolean
  | undefined
  | { day: number; month: number; year: number }
  | { month: number; year: number }
  | {
      addressLine1: string
      addressLine2: string
      town: string
      county: string
      postcode: string
    }

export interface FormAdapterSubmissionMessagePayload {
  meta: FormAdapterSubmissionMessageMeta
  data: FormAdapterSubmissionMessageData
}

export interface FormAdapterSubmissionMessageMeta {
  schemaVersion: FormAdapterSubmissionSchemaVersion
  timestamp: Date
  referenceNumber: string
  formName: string
  formId: string
  formSlug: string
  status: FormStatus
  isPreview: boolean
  notificationEmail: string
}

export interface FormAdapterSubmissionMessageData {
  main: Record<string, RichFormValue>
  repeaters: Record<string, Record<string, RichFormValue>[]>
  files: Record<string, Record<string, string>[]>
}

export enum FormAdapterSubmissionSchemaVersion {
  V1 = 1,
  V2 = 2
}
