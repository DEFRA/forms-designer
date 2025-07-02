import {
  ComponentType,
  ControllerType,
  FormStatus,
  PreviewPageController,
  hasComponents,
  isFormType,
  showRepeaterSettings
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  insertValidationErrors,
  isCheckboxSelected,
  numberHasValue,
  stringHasValue
} from '~/src/lib/utils.js'
import {
  GOVUK_INPUT_WIDTH_2,
  GOVUK_LABEL__M,
  SAVE_AND_CONTINUE,
  baseModelFields,
  buildPreviewUrl,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { getPageConditionDetails } from '~/src/models/forms/editor-v2/page-conditions.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * @param {Page} page
 * @param {{ pageHeadingVal: string | undefined, guidanceTextVal: string | undefined }} [pageHeadingSettings]
 * @param {{ minItems: number | undefined, maxItems: number | undefined, questionSetName: string | undefined }} [repeaterSettings]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
function questionsFields(
  page,
  pageHeadingSettings,
  repeaterSettings,
  validation
) {
  const repeaterFields = showRepeaterSettings(page)
    ? {
        ...questionsRepeaterFields(repeaterSettings, validation)
      }
    : {}
  return {
    repeater: undefined,
    ...questionsHeadingFields(pageHeadingSettings, validation),
    ...repeaterFields
  }
}

/**
 * @param {{ pageHeadingVal: string | undefined, guidanceTextVal: string | undefined }} [pageHeadingSettings]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
function questionsHeadingFields(pageHeadingSettings, validation) {
  const { pageHeadingVal, guidanceTextVal } = pageHeadingSettings ?? {}
  const { formValues } = validation ?? {}

  return {
    pageHeadingAndGuidance: {
      name: 'pageHeadingAndGuidance',
      id: 'pageHeadingAndGuidance',
      items: [
        {
          value: 'true',
          text: 'Add a page heading, guidance or both',
          checked:
            isCheckboxSelected(formValues?.pageHeadingAndGuidance) ||
            hasUnderlyingHeadingData(pageHeadingVal, guidanceTextVal)
        }
      ]
    },
    pageHeading: {
      name: 'pageHeading',
      id: 'pageHeading',
      label: {
        text: 'Page heading',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: "Page headings should be a statement and not a question. For example, 'Passport information'"
      },
      value: pageHeadingVal,
      ...insertValidationErrors(validation?.formErrors.pageHeading)
    },
    guidanceText: {
      name: 'guidanceText',
      id: 'guidanceText',
      label: {
        text: 'Guidance text (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Use Markdown to format the content or add hyperlinks'
      },
      rows: 3,
      value: guidanceTextVal,
      ...insertValidationErrors(validation?.formErrors.guidanceText)
    }
  }
}

/**
 * @param {{ minItems: number | undefined, maxItems: number | undefined, questionSetName: string | undefined }} [repeaterSettings]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
function questionsRepeaterFields(repeaterSettings, validation) {
  const { minItems, maxItems, questionSetName } = repeaterSettings ?? {}
  const { formValues } = validation ?? {}

  return {
    repeater: {
      name: 'repeater',
      id: 'repeater',
      items: [
        {
          value: 'true',
          text: 'Allow multiple responses to questions on this page',
          checked:
            isCheckboxSelected(formValues?.repeater) ||
            hasUnderlyingRepeaterData(minItems, maxItems, questionSetName)
        }
      ]
    },
    repeaterRange: {
      fieldset: {
        legend: {
          text: 'Set the minimum and maximum number of responses you will accept',
          isPageHeading: false
        },
        classes: 'govuk-!-margin-bottom-6'
      },
      hint: {
        text: 'The range must be between 1 and 25'
      },
      minItems: {
        label: {
          text: 'Min',
          classes: GOVUK_LABEL__M
        },
        id: 'minItems',
        name: 'minItems',
        inputmode: 'numeric',
        classes: GOVUK_INPUT_WIDTH_2,
        value: minItems,
        ...insertValidationErrors(validation?.formErrors.minItems)
      },
      maxItems: {
        label: {
          text: 'Max',
          classes: GOVUK_LABEL__M
        },
        id: 'maxItems',
        name: 'maxItems',
        inputmode: 'numeric',
        classes: GOVUK_INPUT_WIDTH_2,
        value: maxItems,
        ...insertValidationErrors(validation?.formErrors.maxItems)
      }
    },
    questionSetName: {
      label: {
        text: 'Give the responses an identifiable name or label',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Use a word to describe what these questions are asking about. For example, ‘Cow’, ‘Pet’. This will be used to categorise the answers, for example ‘Cow 1’, ‘Cow 2’.'
      },
      id: 'questionSetName',
      name: 'questionSetName',
      value: questionSetName,
      ...insertValidationErrors(validation?.formErrors.questionSetName)
    }
  }
}

/**
 *
 * @param {string | undefined} pageHeadingVal
 * @param {string | undefined} guidanceTextVal
 */
export function hasUnderlyingHeadingData(pageHeadingVal, guidanceTextVal) {
  return stringHasValue(pageHeadingVal) || stringHasValue(guidanceTextVal)
}

/**
 *
 * @param {number | undefined} min
 * @param {number | undefined} max
 * @param {string | undefined} questionSetName
 */
export function hasUnderlyingRepeaterData(min, max, questionSetName) {
  return (
    numberHasValue(min) ||
    numberHasValue(max) ||
    stringHasValue(questionSetName)
  )
}

/**
 * @param {ComponentDef[]} components
 * @param {string} baseUrl
 */
function mapQuestionRows(components, baseUrl) {
  return components
    .filter((c) => isFormType(c.type))
    .map((comp2, idx2) => {
      return {
        key: {
          text: `Question ${idx2 + 1}`,
          classes: 'govuk-!-width-one-quarter'
        },
        value: {
          text:
            comp2.options?.required === false
              ? `${comp2.title} (optional)`
              : comp2.title,
          classes: 'govuk-!-width-one-half'
        },
        actions: {
          items: [
            {
              href: `${baseUrl}/question/${comp2.id}/details`,
              text: 'Change',
              visuallyHiddenText: 'name',
              classes: 'govuk-link--no-visited-state govuk-!-width-one-quarter'
            }
          ]
        }
      }
    })
}

/**
 * Extract page data from definition
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @returns {{ pageIdx: number, page: Page, components: ComponentDef[] }}
 */
function extractPageData(definition, pageId) {
  const pageIdx = definition.pages.findIndex((x) => x.id === pageId)
  const page = definition.pages[pageIdx]
  const components = hasComponents(page) ? page.components : []

  return { pageIdx, page, components }
}

/**
 * Extract heading and guidance values
 * @param {Page} page
 * @param {ComponentDef[]} components
 * @param {FormEditor} [formValues]
 * @returns {{ pageHeadingVal: string, guidanceTextVal: string }}
 */
function extractHeadingAndGuidance(page, components, formValues) {
  const pageHeadingVal = formValues?.pageHeading ?? page.title

  const guidanceComponent = /** @type { MarkdownComponent | undefined } */ (
    components.find((comp, idx) => {
      return comp.type === ComponentType.Markdown && idx === 0
    })
  )

  const guidanceTextFallback = guidanceComponent?.content ?? ''
  const guidanceTextVal = formValues?.guidanceText ?? guidanceTextFallback

  return { pageHeadingVal, guidanceTextVal }
}

/**
 * Extract repeater settings from page
 * @param {Page} page
 * @param {FormEditor} [formValues]
 * @returns {{ minItems: number | undefined, maxItems: number | undefined, questionSetName: string | undefined }}
 */
function extractRepeaterSettings(page, formValues) {
  const repeater = page.controller === ControllerType.Repeat
  const repeatOptions = repeater ? page.repeat.options : undefined
  const repeatSchema = repeater ? page.repeat.schema : undefined
  const minItems = formValues?.minItems ?? repeatSchema?.min
  const maxItems = formValues?.maxItems ?? repeatSchema?.max
  const questionSetName = formValues?.questionSetName ?? repeatOptions?.title

  return { minItems, maxItems, questionSetName }
}

/**
 * Build basic view model data
 * @param {FormMetadata} metadata
 * @param {number} pageIdx
 * @param {string} pageId
 * @returns {{ baseUrl: string, pageHeading: string, cardTitle: string, formTitle: string, formPath: string }}
 */
function buildViewModelData(metadata, pageIdx, pageId) {
  const formTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const baseUrl = editorv2Path(metadata.slug, `page/${pageId}`)
  const pageHeading = `Page ${pageIdx + 1}`
  const cardTitle = `Page ${pageIdx + 1} overview`

  return { baseUrl, pageHeading, cardTitle, formTitle, formPath }
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
 * @param {string} [guidance]
 * @returns {PagePreviewPanelMacro}
 */
export function getPreviewModel(page, definition, guidance = '') {
  const components = hasComponents(page) ? page.components : []
  const elements = {
    heading: page.title,
    guidance,
    addHeading: page.title.length > 0
  }

  const previewPageController = new PreviewPageController(
    components,
    elements,
    definition,
    dummyRenderer
  )

  return {
    pageTitle: previewPageController.pageTitle,
    components: previewPageController.components,
    guidance: previewPageController.guidance
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {ValidationFailure<FormEditor>} [validation]
 * @param {string[]} [notification]
 */
export function questionsViewModel(
  metadata,
  definition,
  pageId,
  validation,
  notification
) {
  const { formValues, formErrors } = validation ?? {}

  const { pageIdx, page, components } = extractPageData(definition, pageId)

  const { pageHeadingVal, guidanceTextVal } = extractHeadingAndGuidance(
    page,
    components,
    formValues
  )

  const { minItems, maxItems, questionSetName } = extractRepeaterSettings(
    page,
    formValues
  )

  const { baseUrl, pageHeading, cardTitle, formTitle, formPath } =
    buildViewModelData(metadata, pageIdx, pageId)

  const pageHeadingSettings = { pageHeadingVal, guidanceTextVal }
  const repeaterSettings = { minItems, maxItems, questionSetName }

  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )
  const conditionDetails = getPageConditionDetails(definition, pageId)
  const fields = questionsFields(
    page,
    pageHeadingSettings,
    repeaterSettings,
    validation
  )
  const previewPageUrl = `${buildPreviewUrl(metadata.slug, FormStatus.Draft)}${page.path}?force`

  return {
    ...baseModelFields(metadata.slug, `${cardTitle} - ${formTitle}`, formTitle),
    fields,
    previewModel: {
      ...getPreviewModel(page, definition, fields.guidanceText.value),
      previewPageUrl
    },
    preview: {
      page: JSON.stringify(page),
      definition: JSON.stringify(definition)
    },
    cardTitle,
    cardCaption: pageHeading,
    navigation,
    baseUrl,
    currentTab: 'overview',
    pageTitle: pageHeading,
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    questionRows: mapQuestionRows(components, baseUrl),
    buttonText: SAVE_AND_CONTINUE,
    preventAddQuestion: components.some(
      (comp) => comp.type === ComponentType.FileUploadField
    ),
    notification,
    previewPageUrl,
    conditionDetails,
    hasPageCondition: Boolean(
      conditionDetails.pageCondition && conditionDetails.pageConditionDetails
    )
  }
}

/**
 * @import { ComponentDef, FormMetadata, FormDefinition, FormEditor, MarkdownComponent, Page, PagePreviewPanelMacro } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
