import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { ROUTE_PATH_CREATE_TITLE } from '~/src/routes/forms/create.js'

/**
 * @typedef {object} FormMetadata
 * @property {string} [title] - Form title
 * @property {string} [creationMethod] - Creation method
 */

/**
 * @typedef {object} FormValues
 * @property {string} [creationMethod] - Creation method value
 */

/**
 * @typedef {Record<string, {text: string}>} FormErrors
 */

/**
 * @typedef {object} FormValidation
 * @property {FormValues} [formValues] - Form values
 * @property {FormErrors} [formErrors] - Form errors
 */

/**
 * @param {FormMetadata} metadata
 * @param {FormValidation} [validation]
 */
export function methodViewModel(metadata, validation) {
  const pageTitle = 'How would you like to create your form?'
  const { formValues, formErrors } = validation ?? {}

  return {
    backLink: {
      href: ROUTE_PATH_CREATE_TITLE
    },
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    pageDescription: `You're creating: "${metadata.title}"`,
    errorList: buildErrorList(formErrors, ['creationMethod']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'creationMethod',
      name: 'creationMethod',
      legend: {
        text: pageTitle
      },
      items: [
        {
          value: 'ai-assisted',
          text: 'Use AI to generate my form',
          hint: {
            text: 'Describe your form requirements and let AI create the initial structure, pages, and questions for you. You can edit everything afterwards.'
          }
        },
        {
          value: 'manual',
          text: 'Build my form manually',
          hint: {
            text: 'Start with a blank form and add pages and questions yourself using the form designer.'
          }
        }
      ],
      value: formValues?.creationMethod ?? metadata.creationMethod
    },
    buttonText: 'Continue'
  }
}
