import {
  ComponentType,
  SummaryPageController,
  hasComponentsEvenIfNoNext
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  getPageFromDefinition,
  insertValidationErrors,
  stringHasValue
} from '~/src/lib/utils.js'
import {
  GOVUK_LABEL__M,
  SAVE_AND_CONTINUE,
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import {
  PagePreviewElementsSSR,
  SummaryPreviewSSR
} from '~/src/models/forms/editor-v2/preview/page-preview.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * @param {string | undefined} needDeclarationVal
 * @param {string | undefined} declarationTextVal
 * @param {ValidationFailure<FormEditor>} [validation]
 */
function settingsFields(needDeclarationVal, declarationTextVal, validation) {
  return {
    needDeclaration: {
      name: 'needDeclaration',
      id: 'needDeclaration',
      hint: {
        text: 'Use a declaration if you need users to declare or agree to something before they submit the form'
      },
      items: [
        {
          value: 'false',
          text: 'No'
        },
        {
          value: 'true',
          text: 'Yes'
        }
      ],
      value: needDeclarationVal,
      ...insertValidationErrors(validation?.formErrors.needDeclaration)
    },
    declarationText: {
      name: 'declarationText',
      id: 'declarationText',
      label: {
        text: 'Declaration text',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Use a declaration if you need users to declare or agree to something before they submit the form'
      },
      rows: 3,
      value: declarationTextVal,
      ...insertValidationErrors(validation?.formErrors.declarationText)
    }
  }
}

export const dummyRenderer = {
  /**
   * @param {string} _a
   * @param {PagePreviewPanelMacro} _b
   * @returns {never}
   */
  render(_a, _b) {
    // Server Side Render shouldn't use render
    throw new Error('Not implemented')
  }
}

/**
 * @param { Page | undefined } page
 * @param {FormDefinition} definition
 * @param {string} previewPageUrl
 * @param {string} [declaration]
 * @returns {PagePreviewPanelMacro & {
 *    previewPageUrl: string;
 *    questionType?: ComponentType,
 *    previewTitle?: string,
 *    componentRows: { rows: { key: { text: string }, value: { text: string } }[] }
 * }}
 */
export function getPreviewModel(page, definition, previewPageUrl, fields) {
  const declarationText = fields.declarationText.value
  const needDeclaration = fields.needDeclaration.value
  const elements = new SummaryPreviewSSR(page, declarationText, needDeclaration)
  console.log('~~~~~~ Chris Debug ~~~~~~ ', 'Elements', elements)
  console.log(
    '~~~~~~ Chris Debug ~~~~~~ ',
    'Elements.declaration',
    elements.declaration
  )
  console.log(
    '~~~~~~ Chris Debug ~~~~~~ ',
    'Elements.guidance',
    elements.guidance
  )
  const previewPageController = new SummaryPageController(
    elements,
    definition,
    dummyRenderer
  )
  console.log('~~~~~~ Chris Debug ~~~~~~ ', 'PreviewPageController', {
    ...previewPageController
  })
  console.log(
    '~~~~~~ Chris Debug ~~~~~~ ',
    'PreviewPageController.buttonText',
    previewPageController.buttonText
  )
  console.log(
    '~~~~~~ Chris Debug ~~~~~~ ',
    'PreviewPageController.guidance',
    previewPageController.guidance
  )
  console.log(
    '~~~~~~ Chris Debug ~~~~~~ ',
    'PreviewPageController.declaration',
    previewPageController.declaration
  )
  console.log(
    '~~~~~~ Chris Debug ~~~~~~ ',
    'PreviewPageController.d',
    previewPageController.declarationText
  )

  return {
    previewTitle: 'Preview of Check answers page',
    pageTitle: previewPageController.pageTitle,
    components: previewPageController.components,
    guidance: previewPageController.guidance,
    sectionTitle: previewPageController.sectionTitle,
    buttonText: previewPageController.buttonText,
    previewPageUrl,
    questionType: ComponentType.TextField, // components[0]?.type
    componentRows: previewPageController.componentRows
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {ValidationFailure<FormEditor>} [validation]
 * @param {string[]} [notification]
 */
export function checkAnswersSettingsViewModel(
  metadata,
  definition,
  pageId,
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

  const page = getPageFromDefinition(definition, pageId)
  const components = hasComponentsEvenIfNoNext(page) ? page.components : []

  const guidanceComponent = /** @type { MarkdownComponent | undefined } */ (
    components.find((comp, idx) => {
      return comp.type === ComponentType.Markdown && idx === 0
    })
  )

  const declarationTextVal =
    formValues?.declarationText ?? guidanceComponent?.content
  const needDeclarationVal =
    formValues?.needDeclaration ?? `${stringHasValue(declarationTextVal)}`
  const fields = settingsFields(
    needDeclarationVal,
    declarationTextVal,
    validation
  )
  const pageHeading = 'Page settings'
  // prettier-ignore
  const previewModel = getPreviewModel(
    page, definition, 'previewPageUrl', fields
  )

  return {
    ...baseModelFields(
      metadata.slug,
      `${pageHeading} - ${formTitle}`,
      formTitle
    ),
    fields,
    cardTitle: pageHeading,
    cardCaption: 'Check answers',
    cardHeading: pageHeading,
    navigation,
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    previewModel,
    preview: {
      page: JSON.stringify(page),
      definition: JSON.stringify(definition),
      pageTemplate: 'summary-controller.njk'
    },
    buttonText: SAVE_AND_CONTINUE,
    notification
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor, MarkdownComponent, Page, PagePreviewPanelMacro } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
