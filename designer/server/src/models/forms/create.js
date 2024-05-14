import { organisations } from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'

/**
 * @param {Partial<FormMetadataInput>} [metadata]
 * @param {ValidationFailure} [validation]
 */
export function titleViewModel(metadata, validation) {
  const { formValues, formErrors } = validation ?? {}

  return {
    backLink: {
      text: 'Back to form library',
      href: '/library'
    },
    pageTitle: 'Enter a name for your form',
    errorList: buildErrorList(formErrors, ['title']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'title',
      name: 'title',
      label: {
        text: 'Enter a name for your form'
      },
      value: formValues?.title ?? metadata?.title,
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
  const { formValues, formErrors } = validation ?? {}

  return {
    backLink: {
      href: '/create/title'
    },
    pageTitle: 'Choose a lead organisation for this form',
    errorList: buildErrorList(formErrors, ['organisation']),
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
      value: formValues?.organisation ?? metadata?.organisation
    },
    buttonText: 'Continue'
  }
}

/**
 * @param {Partial<FormMetadataInput>} [metadata]
 * @param {ValidationFailure} [validation]
 */
export function teamViewModel(metadata, validation) {
  const { formValues, formErrors } = validation ?? {}

  return {
    backLink: {
      href: '/create/organisation'
    },
    pageTitle: 'Team details',
    errorList: buildErrorList(formErrors, ['teamName', 'teamEmail']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    fields: [
      {
        type: 'hidden',
        name: 'title',
        value: metadata?.title
      },
      {
        type: 'hidden',
        name: 'organisation',
        value: metadata?.organisation
      },
      {
        id: 'teamName',
        name: 'teamName',
        label: {
          text: 'Name of team'
        },
        hint: {
          text: 'Enter the name of the policy team or business area responsible for this form'
        },
        value: formValues?.teamName ?? metadata?.teamName,
        autocapitalize: true,
        spellcheck: true
      },
      {
        id: 'teamEmail',
        name: 'teamEmail',
        label: {
          text: 'Shared team email address'
        },
        value: formValues?.teamEmail ?? metadata?.teamEmail,
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
