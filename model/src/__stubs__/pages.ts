import { buildFileUploadComponent } from '~/src/__stubs__/components.js'
import { ComponentType } from '~/src/components/enums.js'
import {
  type PageFileUpload,
  type PageQuestion,
  type PageRepeat,
  type PageSummary
} from '~/src/form/form-definition/types.js'
import { ControllerPath, ControllerType } from '~/src/pages/enums.js'

/**
 * Stub builder for a question page
 * @param {Partial<PageQuestion>} [partialPage]
 * @returns {PageQuestion}
 */
export function buildQuestionPage(
  partialPage: Partial<PageQuestion>
): PageQuestion {
  return {
    id: 'ffefd409-f3f4-49fe-882e-6e89f44631b1',
    title: 'Page One',
    path: '/page-one',
    next: [],
    components: [],
    ...partialPage
  }
}

/**
 * Stub builder for a Summary page
 * @param {Partial<PageSummary>} [partialSummaryPage]
 */
export function buildSummaryPage(
  partialSummaryPage: Partial<PageSummary> = {}
): PageSummary {
  return {
    id: '449a45f6-4541-4a46-91bd-8b8931b07b50',
    title: 'Summary page',
    ...partialSummaryPage,
    path: ControllerPath.Summary,
    controller: ControllerType.Summary
  }
}

/**
 *
 * @param {Partial<PageFileUpload>} partialFileUploadPage
 * @returns {PageFileUpload}
 */
export function buildFileUploadPage(
  partialFileUploadPage: Partial<PageFileUpload> = {}
): PageFileUpload {
  return {
    id: '85e5c8da-88f5-4009-a821-7d7de1364318',
    title: '',
    path: '/supporting-evidence',
    components: [
      buildFileUploadComponent({
        type: ComponentType.FileUploadField,
        title: 'Supporting Evidence',
        name: 'yBpZQO',
        shortDescription: 'Supporting evidence',
        hint: '',
        options: {
          required: true,
          accept:
            'application/pdf,application/msword,image/jpeg,application/vnd.ms-excel,text/csv'
        },
        id: '4189b8a1-1a04-4f74-a7a0-dd23012a0ee0'
      })
    ],
    next: [],
    ...partialFileUploadPage,
    controller: ControllerType.FileUpload
  }
}

/**
 *
 * @param {Partial<PageRepeat>} partialRepeaterPage
 * @returns {PageRepeat}
 */
export function buildRepeaterPage(
  partialRepeaterPage: Partial<PageRepeat> = {}
): PageRepeat {
  return {
    title: 'Repeater Page',
    path: '/repeater-page',
    components: [
      {
        type: ComponentType.TextField,
        title: 'Simple text field',
        name: 'IHAIzC',
        shortDescription: 'Your simple text field',
        hint: '',
        options: {},
        schema: {},
        id: 'ee83413e-31b6-4158-98e0-4611479582ce'
      }
    ],
    next: [],
    id: '32888028-61db-40fc-b255-80bc67829d31',
    repeat: {
      options: { name: 'fawfed', title: 'Simple question responses' },
      schema: { min: 1, max: 3 }
    },
    ...partialRepeaterPage,
    controller: ControllerType.Repeat
  }
}
