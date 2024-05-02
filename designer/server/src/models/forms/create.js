import { organisations } from '@defra/forms-model'

/**
 * @param {Partial<FormMetadataInput>} [metadata]
 * @param {ValidationFailure} [validation]
 */
export function titleViewModel(metadata, validation) {
  return {
    backLink: '/library',
    pageTitle: 'Enter a name for your form',
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'title',
      name: 'title',
      label: {
        text: 'Enter a name for your form'
      },
      value: validation?.formValues.title ?? metadata?.title,
      autocapitalize: true,
      spellcheck: true
    },
    buttonText: 'Continue'
  }
}

/**
 * @param {Partial<FormMetadataInput>} [metadata]
 * @param {ValidationFailure} [validation]
 */
export function organisationViewModel(metadata, validation) {
  return {
    backLink: '/create/title',
    pageTitle: 'Choose a lead organisation for this form',
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'organisation',
      name: 'organisation',
      legend: {
        text: 'Choose a lead organisation for this form'
      },
      items: organisations.map((organisation) => ({
        text: organisation,
        value: organisation
      })),
      value: validation?.formValues.organisation ?? metadata?.organisation
    },
    buttonText: 'Continue'
  }
}

/**
 * @param {Partial<FormMetadataInput>} [metadata]
 * @param {ValidationFailure} [validation]
 */
export function teamViewModel(metadata, validation) {
  return {
    backLink: '/create/organisation',
    pageTitle: 'Team details',
    pageHeading: 'Team details',
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    fields: [
      {
        id: 'teamName',
        name: 'teamName',
        label: {
          text: 'Name of team'
        },
        hint: {
          text: 'Enter the name of the policy team or business area responsible for this form'
        },
        value: validation?.formValues.teamName ?? metadata?.teamName,
        autocapitalize: true,
        spellcheck: true
      },
      {
        id: 'teamEmail',
        name: 'teamEmail',
        label: {
          text: 'Shared team email address'
        },
        value: validation?.formValues.teamEmail ?? metadata?.teamEmail,
        autocomplete: 'email',
        spellcheck: false
      }
    ],
    buttonText: 'Save and continue'
  }
}

/**
 * @typedef {import('@defra/forms-model').FormMetadataInput} FormMetadataInput
 * @typedef {import("~/src/common/helpers/build-error-details.js").ValidationFailure<FormMetadataInput>} ValidationFailure
 */
