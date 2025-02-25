import { ComponentType } from '@defra/forms-model'

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
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { formOverviewPath } from '~/src/models/links.js'

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
function hasUnderlyingData(pageHeadingVal, guidanceTextVal) {
  return stringHasValue(pageHeadingVal) || stringHasValue(guidanceTextVal)
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {Partial<FormEditor>} [_editor]
 * @param {ValidationFailure<FormEditor>} [validation]
 * @param {string[]} [notification]
 */
export function questionsViewModel(
  metadata,
  definition,
  pageId,
  _editor,
  validation,
  notification
) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formValues, formErrors } = validation ?? {}

  const pageIdx = definition.pages.findIndex((x) => x.id === pageId)
  const page = definition.pages[pageIdx]
  const components = 'components' in page ? page.components : []

  const firstQuestion = components.find(
    (comp) => comp.type !== ComponentType.Html
  )

  const pageHeadingFallback =
    page.title !== firstQuestion?.title ? page.title : ''
  const pageHeadingVal = stringHasValue(formValues?.pageHeading)
    ? formValues?.pageHeading
    : pageHeadingFallback

  const guidanceComponent = /** @type {HtmlComponent | undefined} */ (
    components.find(
      (comp, idx) => comp.type === ComponentType.Html && idx === 0
    )
  )

  const guidanceTextFallback = stringHasValue(guidanceComponent?.content)
    ? guidanceComponent?.content
    : ''
  const guidanceTextVal = stringHasValue(formValues?.guidanceText)
    ? formValues?.guidanceText
    : guidanceTextFallback

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    fields: { ...questionsFields(pageHeadingVal, guidanceTextVal, validation) },
    cardTitle: `Page ${pageIdx + 1} overview`,
    cardCaption: `Page ${pageIdx + 1}`,
    navigation,
    errorList: buildErrorList(formErrors, ['questions']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    questionRows: components
      .filter(
        (comp, idx) =>
          (comp.type !== ComponentType.Html && idx === 0) || idx > 0
      )
      .map((comp2, idx2) => {
        return {
          key: {
            text: `Question ${idx2 + 1}`
          },
          value: {
            text: comp2.title
          },
          actions: {
            items: [
              {
                href: '#',
                text: 'Change',
                visuallyHiddenText: 'name'
              }
            ]
          }
        }
      }),
    buttonText: SAVE_AND_CONTINUE,
    notification
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor, HtmlComponent } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
