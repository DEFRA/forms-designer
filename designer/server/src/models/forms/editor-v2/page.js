import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  SAVE_AND_CONTINUE,
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} formDefinition
 * @param {Partial<FormEditor>} [editor]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function pageViewModel(metadata, formDefinition, editor, validation) {
  const formTitle = metadata.title
  const pageHeading = 'What kind of page do you need?'
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    formDefinition,
    'Editor'
  )
  const { formValues, formErrors } = validation ?? {}

  const fieldName = 'pageType'

  return {
    ...baseModelFields(
      metadata.slug,
      `${pageHeading} - ${formTitle}`,
      formTitle
    ),
    navigation,
    pageClasses:
      'govuk-grid-column-full govuk-grid-column-one-half-from-desktop',
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: fieldName,
      name: fieldName,
      idPrefix: fieldName,
      fieldset: {
        legend: {
          text: pageHeading,
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      value: formValues?.pageType ?? editor?.pageType,
      items: [
        {
          value: 'question',
          text: 'Question page',
          hint: {
            text: 'A page to hold one or more related questions'
          }
        },
        {
          value: 'guidance',
          text: 'Guidance page',
          hint: {
            text: 'If you need to add guidance without asking a question'
          }
        }
      ],
      errorMessage: formErrors?.pageType
        ? {
            text: formErrors.pageType.text
          }
        : undefined
    },
    buttonText: SAVE_AND_CONTINUE
  }
}

/**
 * @import { FormMetadata, FormEditor, FormDefinition } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
