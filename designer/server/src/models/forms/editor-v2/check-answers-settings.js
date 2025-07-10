import {
  ComponentType,
  PreviewPageController,
  hasComponents,
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
import { PagePreviewElementsSSR } from '~/src/models/forms/editor-v2/preview/page-preview.js'
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
 * @param {Page} page
 * @param {FormDefinition} definition
 * @param {string} previewPageUrl
 * @param {string} previewErrorsUrl
 * @param {string} [guidance]
 * @returns {PagePreviewPanelMacro & {
 *    previewPageUrl: string;
 *    previewErrorsUrl: string;
 *    errorTemplates?: {
 *      baseErrors: {type: string, template: any}[],
 *      advancedSettingsErrors: any[]
 *    };
 *    questionType?: ComponentType,
 *    previewTitle?: string,
 *    componentRows: { rows: { key: { text: string }, value: { text: string } }[] }
 * }}
 */
export function getPreviewModel(
  page,
  definition,
  previewPageUrl,
  previewErrorsUrl,
  guidance = ''
) {
  const components = definition.pages.flatMap((p) =>
    hasComponents(p) ? p.components : []
  )
  const componentRows = {
    rows: components.map((comp) => ({
      key: {
        text: comp.title
      },
      value: {
        text: 'example value'
      }
    }))
  }

  const elements = new PagePreviewElementsSSR(page, guidance)

  const previewPageController = new PreviewPageController(
    components,
    elements,
    definition,
    dummyRenderer,
    'summary-controller.njk'
  )

  return {
    previewTitle: 'Preview of Check answers page',
    pageTitle: previewPageController.pageTitle,
    components: previewPageController.components,
    guidance: previewPageController.guidance,
    repeaterButton: previewPageController.repeaterButton,
    sectionTitle: previewPageController.sectionTitle,
    previewPageUrl,
    previewErrorsUrl,
    errorTemplates: undefined,
    questionType: ComponentType.TextField, // components[0]?.type
    componentRows
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

  const pageHeading = 'Page settings'

  return {
    ...baseModelFields(
      metadata.slug,
      `${pageHeading} - ${formTitle}`,
      formTitle
    ),
    fields: {
      ...settingsFields(needDeclarationVal, declarationTextVal, validation)
    },
    cardTitle: pageHeading,
    cardCaption: 'Check answers',
    cardHeading: pageHeading,
    navigation,
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    previewModel: getPreviewModel(
      /** @type {Page} */ (page),
      definition,
      'previewPageUrl',
      'previewErrorsUrl',
      'fields.guidanceText.value'
    ),
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
