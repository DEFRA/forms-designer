import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  SAVE_AND_CONTINUE,
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {Partial<FormEditor>} [editor]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function pageViewModel(metadata, editor, validation) {
  const formTitle = metadata.title
  const pageHeading = 'What kind of page do you need?'
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formValues, formErrors } = validation ?? {}

  return {
    ...baseModelFields(
      metadata.slug,
      `${pageHeading} - ${formTitle}`,
      pageHeading
    ),
    navigation,
    pageCaption: {
      text: formTitle
    },
    pageClasses:
      'govuk-grid-column-full govuk-grid-column-one-half-from-desktop',
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'pageType',
      name: 'pageType',
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
      ]
    },
    buttonText: SAVE_AND_CONTINUE
  }
}

/**
 * @import { FormMetadata, FormEditor } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
