/**
 * @param {Partial<FormMetadataInput>} [metadata]
 * @param {ValidationFailure} [validation]
 */
export function titleViewModel(metadata, validation) {
  return {
    backLink: '/library',
    pageTitle: 'Enter a name for your form',
    formErrors: validation?.formErrors,
    field: {
      id: 'title',
      name: 'title',
      label: {
        text: 'Enter a name for your form'
      },
      value: metadata?.title,
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
    field: {
      id: 'organisation',
      name: 'organisation',
      legend: {
        text: 'Choose a lead organisation for this form'
      },
      items: [
        {
          text: 'Animal and Plant Health Agency – APHA',
          value: 'Animal and Plant Health Agency – APHA'
        },
        {
          text: 'Centre for Environment, Fisheries and Aquaculture Science – Cefas',
          value:
            'Centre for Environment, Fisheries and Aquaculture Science – Cefas'
        },
        {
          text: 'Defra',
          value: 'Defra'
        },
        {
          text: 'Environment Agency',
          value: 'Environment Agency'
        },
        {
          text: 'Forestry Commission',
          value: 'Forestry Commission'
        },
        {
          text: 'Marine Management Organisation – MMO',
          value: 'Marine Management Organisation – MMO'
        },
        {
          text: 'Natural England',
          value: 'Natural England'
        },
        {
          text: 'Rural Payments Agency – RPA',
          value: 'Rural Payments Agency – RPA'
        },
        {
          text: 'Veterinary Medicines Directorate – VMD',
          value: 'Veterinary Medicines Directorate – VMD'
        }
      ],
      value: metadata?.organisation
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
        value: metadata?.teamName,
        autocapitalize: true,
        spellcheck: true
      },
      {
        id: 'teamEmail',
        name: 'teamEmail',
        label: {
          text: 'Shared team email address'
        },
        value: metadata?.teamEmail,
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
