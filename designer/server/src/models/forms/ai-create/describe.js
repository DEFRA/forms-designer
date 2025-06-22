import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { ROUTE_PATH_CREATE_METHOD } from '~/src/routes/forms/ai-create/method.js'

/**
 * @typedef {object} FormMetadata
 * @property {string} [title] - Form title
 * @property {string} [formDescription] - Form description
 */

/**
 * @typedef {object} FormValues
 * @property {string} [formDescription] - Form description value
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
export function describeViewModel(metadata, validation) {
  const pageTitle = 'Describe the form you want to create'
  const { formValues, formErrors } = validation ?? {}

  return {
    backLink: {
      href: ROUTE_PATH_CREATE_METHOD
    },
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    pageDescription: `AI will generate: "${metadata.title}"`,
    errorList: buildErrorList(formErrors, ['formDescription']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'formDescription',
      name: 'formDescription',
      label: {
        text: 'Describe your form requirements'
      },
      hint: {
        text: 'Describe what information you need to collect, any conditional logic, and the purpose of your form. The more detail you provide, the better the AI can build your form.'
      },
      value: formValues?.formDescription ?? metadata.formDescription,
      rows: 8
    },
    examplesContent: {
      title: 'Examples and tips',
      examples: [
        {
          title: 'Dangerous dogs registration',
          text: 'Create a form to register dangerous dogs. Need owner details, dog breed and description, insurance details, and vet information. Include conditional questions about previous incidents only if the owner has had dogs before.'
        },
        {
          title: 'Planning application',
          text: 'Create a planning application form. Need property address, applicant details, project description, and file uploads for plans. Include yes/no questions about listed buildings and conservation areas.'
        },
        {
          title: 'Business license application',
          text: 'I need a form for business license applications. Collect business details, owner information, business type, and premises details. Show additional health and safety questions only for food businesses.'
        }
      ],
      tips: [
        'Mention any conditional logic (show X if Y is selected)',
        'Specify required vs optional fields',
        'Include validation requirements (email format, number ranges, etc.)',
        'Mention any lists of options (dropdowns, radio buttons)',
        'Describe the purpose and who will use the form',
        'Include any specific formatting or layout preferences'
      ]
    },
    buttonText: 'Generate my form',
    alternativeAction: {
      text: 'Build manually instead',
      href: '/create/organisation?method=manual'
    }
  }
}
