import { type FormStatus } from '~/src/common/enums.js'

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
  status: FormStatus
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
