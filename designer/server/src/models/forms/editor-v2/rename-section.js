import { buildErrorList } from '~/src/common/helpers/build-error-details.js'

/**
 * @param {FormDefinition} definition
 * @param {string} sectionId
 * @param {string} returnUrl
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function renameSectionViewModel(
  definition,
  sectionId,
  returnUrl,
  validation
) {
  const pageTitle = 'Rename section'
  const { formValues, formErrors } = validation ?? {}

  const section = definition.sections.find((sect) => sect.id === sectionId)
  if (!section) {
    throw new Error(`Section not found with id ${sectionId}`)
  }

  return {
    backLink: {
      text: 'Back to sections',
      href: returnUrl
    },
    pageTitle,
    errorList: buildErrorList(formErrors, ['sectionTitle']),
    formErrors,
    formValues,
    field: {
      id: 'sectionTitle',
      name: 'sectionTitle',
      label: {
        text: 'Enter a new name for your section'
      },
      value: formValues?.sectionTitle ?? section.title
    },
    buttonText: 'Save changes'
  }
}

/**
 * @import { FormDefinition, FormEditor } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
