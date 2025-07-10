import {
  ComponentType,
  ControllerType,
  FormStatus,
  GuidancePageController,
  hasComponents
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  getPageFromDefinition,
  insertValidationErrors
} from '~/src/lib/utils.js'
import {
  GOVUK_LABEL__M,
  SAVE,
  baseModelFields,
  buildPreviewUrl,
  getFormSpecificNavigation,
  getPageConditionDetails,
  getPageNum
} from '~/src/models/forms/editor-v2/common.js'
import { PagePreviewElementsSSR } from '~/src/models/forms/editor-v2/preview/page-preview.js'
import { dummyRenderer } from '~/src/models/forms/editor-v2/questions.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * @param {string | undefined} pageHeadingVal
 * @param {string | undefined} guidanceTextVal
 * @param {boolean} exitPageVal
 * @param {ValidationFailure<FormEditor>} [validation]
 */
function guidanceFields(
  pageHeadingVal,
  guidanceTextVal,
  exitPageVal,
  validation
) {
  return {
    pageHeading: {
      name: 'pageHeading',
      id: 'pageHeading',
      label: {
        text: 'Page heading',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: "This should be a statement, not a question. For example, 'Passport information'"
      },
      value: pageHeadingVal,
      ...insertValidationErrors(validation?.formErrors.pageHeading)
    },
    guidanceText: {
      name: 'guidanceText',
      id: 'guidanceText',
      label: {
        text: 'Guidance text',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'You can use Markdown if you want to format the content or add links'
      },
      rows: 3,
      value: guidanceTextVal,
      ...insertValidationErrors(validation?.formErrors.guidanceText)
    },
    exitPage: {
      name: 'exitPage',
      id: 'exitPage',
      classes: 'govuk-checkboxes--small',
      items: [
        {
          text: 'Mark as Exit Page',
          value: 'true',
          hint: {
            text: 'Users who reach this page will be unable to continue filling out the form'
          },
          checked: exitPageVal
        }
      ]
    }
  }
}

/**
 * @param {Page|undefined} page
 * @param {FormDefinition} definition
 * @param {string} previewPageUrl
 * @param {string} [guidance]
 * @returns {PagePreviewPanelMacro & {
 *    previewPageUrl: string;
 *    questionType?: ComponentType
 * }}
 */
export function getGuidancePreviewModel(
  page,
  definition,
  previewPageUrl,
  guidance = ''
) {
  const components = hasComponents(page) ? page.components : []
  const elements = new PagePreviewElementsSSR(page, guidance)
  const previewPageController = new GuidancePageController(
    elements,
    dummyRenderer
  )
  const previewController = /** @type {PagePreviewPanelMacro} */ ({
    pageTitle: previewPageController.pageTitle,
    components: previewPageController.components,
    guidance: previewPageController.guidance
  })

  return {
    ...previewController,
    previewPageUrl,
    questionType: components[0]?.type
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {ValidationFailure<FormEditor>} [validation]
 * @param {string[]} [notification]
 */
export function guidanceViewModel(
  metadata,
  definition,
  pageId,
  questionId,
  validation,
  notification
) {
  const formTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )
  const { formValues, formErrors } = validation ?? {}

  const pageNum = getPageNum(definition, pageId)
  const page = getPageFromDefinition(definition, pageId)
  const components = hasComponents(page) ? page.components : []
  const previewPageUrl = `${buildPreviewUrl(metadata.slug, FormStatus.Draft)}${page?.path}?force`
  const pageHeadingVal = formValues?.pageHeading ?? page?.title

  const guidanceComponent = /** @type { MarkdownComponent | undefined } */ (
    components.find((comp, idx) => {
      return comp.type === ComponentType.Markdown && idx === 0
    })
  )

  const guidanceTextVal = formValues?.guidanceText ?? guidanceComponent?.content
  const cardHeading = 'Edit guidance page'
  const pageTitle = `${cardHeading} - ${formTitle}`
  const exitPageVal = page?.controller === ControllerType.Terminal

  const conditionDetails = getPageConditionDetails(definition, pageId)
  // prettier-ignore
  const previewModel = getGuidancePreviewModel(page, definition, previewPageUrl, guidanceTextVal)
  return {
    ...baseModelFields(metadata.slug, pageTitle, formTitle),
    fields: {
      ...guidanceFields(
        pageHeadingVal,
        guidanceTextVal,
        exitPageVal,
        validation
      )
    },
    previewModel,
    cardTitle: `Page settings`,
    cardCaption: `Page ${pageNum}`,
    cardHeading,
    navigation,
    previewPageUrl,
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    baseUrl: editorv2Path(metadata.slug, `page/${pageId}`),
    questionId,
    buttonText: SAVE,
    notification,
    conditionDetails,
    hasPageCondition: Boolean(
      conditionDetails.pageCondition && conditionDetails.pageConditionDetails
    )
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor, MarkdownComponent, Page, PagePreviewPanelMacro } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
