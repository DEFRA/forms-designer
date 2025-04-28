import { ComponentType, hasComponents, isFormType } from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  insertValidationErrors,
  isCheckboxSelected,
  stringHasValue
} from '~/src/lib/utils.js'
import {
  GOVUK_LABEL__M,
  SAVE_AND_CONTINUE,
  baseModelFields,
  buildPreviewUrl,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * @param {string | undefined} pageHeadingVal
 * @param {string | undefined} guidanceTextVal
 * @param {ValidationFailure<FormEditor>} [validation]
 */
function questionsFields(pageHeadingVal, guidanceTextVal, validation) {
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
            hasUnderlyingData(pageHeadingVal, guidanceTextVal)
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
 *
 * @param {string | undefined} pageHeadingVal
 * @param {string | undefined} guidanceTextVal
 */
export function hasUnderlyingData(pageHeadingVal, guidanceTextVal) {
  return stringHasValue(pageHeadingVal) || stringHasValue(guidanceTextVal)
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
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formValues, formErrors } = validation ?? {}

  const pageIdx = definition.pages.findIndex((x) => x.id === pageId)
  const page = definition.pages[pageIdx]
  const components = hasComponents(page) ? page.components : []

  const pageHeadingVal = stringHasValue(formValues?.pageHeading)
    ? formValues?.pageHeading
    : page.title

  const guidanceComponent = /** @type { MarkdownComponent | undefined } */ (
    components.find((comp, idx) => {
      return comp.type === ComponentType.Markdown && idx === 0
    })
  )

  const guidanceTextFallback = stringHasValue(guidanceComponent?.content)
    ? guidanceComponent?.content
    : ''
  const guidanceTextVal = stringHasValue(formValues?.guidanceText)
    ? formValues?.guidanceText
    : guidanceTextFallback

  const baseUrl = editorv2Path(metadata.slug, `page/${pageId}`)

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    fields: { ...questionsFields(pageHeadingVal, guidanceTextVal, validation) },
    cardTitle: `Page ${pageIdx + 1} overview`,
    cardCaption: `Page ${pageIdx + 1}`,
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
