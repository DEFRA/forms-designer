import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors, isCheckboxSelected } from '~/src/lib/utils.js'
import {
  GOVUK_LABEL__M,
  SAVE_AND_CONTINUE,
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {Partial<FormEditor>} [_editor]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function questionsViewModel(
  metadata,
  definition,
  pageId,
  _editor,
  validation
) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formValues, formErrors } = validation ?? {}

  const pageIdx = definition.pages.findIndex((x) => x.id === pageId)
  const page = definition.pages[pageIdx]
  const components = 'components' in page ? page.components : []

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    cardTitle: `Page ${pageIdx + 1} overview`,
    cardCaption: `Page ${pageIdx + 1}`,
    navigation,
    errorList: buildErrorList(formErrors, ['questions']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    questionRows: components.map((comp, idx) => {
      return {
        key: {
          text: `Question ${idx + 1}`
        },
        value: {
          text: comp.title
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
    fields: {
      pageHeadingAndGuidance: {
        name: 'pageHeadingAndGuidance',
        id: 'pageHeadingAndGuidance',
        items: [
          {
            value: 'true',
            text: 'Add a page heading, guidance or both',
            checked: isCheckboxSelected(formValues?.pageHeadingAndGuidance)
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
        value: formValues?.pageHeading,
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
        value: formValues?.guidanceText,
        ...insertValidationErrors(validation?.formErrors.guidanceText)
      }
    },
    buttonText: SAVE_AND_CONTINUE
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
