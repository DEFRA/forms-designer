import {
  ComponentType,
  ControllerType,
  hasComponents,
  isFormType
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
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * @param {{ pageHeadingVal: string | undefined, guidanceTextVal: string | undefined }} [pageHeadingSettings]
 * @param {{ minItems: number | undefined, maxItems: number | undefined, questionSetName: string | undefined }} [repeaterSettings]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
function questionsFields(pageHeadingSettings, repeaterSettings, validation) {
  const { pageHeadingVal, guidanceTextVal } = pageHeadingSettings ?? {}
  const { minItems, maxItems, questionSetName } = repeaterSettings ?? {}
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
    },
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
  const formTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formValues, formErrors } = validation ?? {}

  const pageIdx = definition.pages.findIndex((x) => x.id === pageId)
  const page = definition.pages[pageIdx]
  const components = hasComponents(page) ? page.components : []

  const pageHeadingVal = formValues?.pageHeading ?? page.title

  const guidanceComponent = /** @type { MarkdownComponent | undefined } */ (
    components.find((comp, idx) => {
      return comp.type === ComponentType.Markdown && idx === 0
    })
  )

  const guidanceTextFallback = guidanceComponent?.content ?? ''
  const guidanceTextVal = formValues?.guidanceText ?? guidanceTextFallback

  const baseUrl = editorv2Path(metadata.slug, `page/${pageId}`)
  const pageHeading = `Page ${pageIdx + 1}`

  const repeater = page.controller === ControllerType.Repeat
  const repeatOptions = repeater ? page.repeat.options : undefined
  const repeatSchema = repeater ? page.repeat.schema : undefined
  const minItems = formValues?.minItems ?? repeatSchema?.min
  const maxItems = formValues?.maxItems ?? repeatSchema?.max
  const questionSetName = formValues?.questionSetName ?? repeatOptions?.title

  const pageHeadingSettings = { pageHeadingVal, guidanceTextVal }
  const repeaterSettings = { minItems, maxItems, questionSetName }

  return {
    ...baseModelFields(
      metadata.slug,
      `${pageHeading} - ${formTitle}`,
      formTitle
    ),
    fields: {
      ...questionsFields(pageHeadingSettings, repeaterSettings, validation)
    },
    cardTitle: `Page ${pageIdx + 1} overview`,
    cardCaption: pageHeading,
    navigation,
    baseUrl,
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    questionRows: mapQuestionRows(components, baseUrl),
    buttonText: SAVE_AND_CONTINUE,
    preventAddQuestion: components.some(
      (comp) => comp.type === ComponentType.FileUploadField
    ),
    notification,
    previewPageUrl: `${buildPreviewUrl(metadata.slug)}${page.path}?force`
  }
}

/**
 * @import { ComponentDef, FormMetadata, FormDefinition, FormEditor, MarkdownComponent } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
