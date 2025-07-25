import { organisations } from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { formsLibraryBackLink } from '~/src/models/links.js'
import {
  ROUTE_PATH_CREATE_ORGANISATION,
  ROUTE_PATH_CREATE_TITLE
} from '~/src/routes/forms/create.js'

/**
 * @param {Partial<FormMetadataInput>} [metadata]
 * @param {ValidationFailure<FormMetadataInput>} [validation]
 */
export function titleViewModel(metadata, validation) {
  const pageTitle = 'Enter a name for your form'
  const { formValues, formErrors } = validation ?? {}

  return {
    backLink: formsLibraryBackLink,
    pageTitle,
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
 * @param {ValidationFailure<FormMetadataInput>} [validation]
 */
export function organisationViewModel(metadata, validation) {
  const pageTitle = 'Choose a lead organisation for this form'
  const { formValues, formErrors } = validation ?? {}

  return {
    backLink: {
      href: ROUTE_PATH_CREATE_TITLE
    },
    pageTitle,
    errorList: buildErrorList(formErrors, ['organisation']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'organisation',
      name: 'organisation',
      fieldset: {
        legend: {
          text: 'Choose a lead organisation for this form',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
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
 * @param {ValidationFailure<FormMetadataInput>} [validation]
 */
export function teamViewModel(metadata, validation) {
  const pageTitle = 'Team details'
  const { formValues, formErrors } = validation ?? {}

  return {
    backLink: {
      href: ROUTE_PATH_CREATE_ORGANISATION
    },
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
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
        hint: {
          text: 'Used to contact the form subject matter expert (SME) or key stakeholder. Must be a UK email address, like name@example.gov.uk'
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
 * @type {ErrorDetails}
 */
export const titleFormErrors = {
  title: {
    text: 'Form name you entered already exists',
    href: '#title'
  }
}

/**
 * @import { FormMetadataInput } from '@defra/forms-model'
 * @import { ErrorDetails, ValidationFailure } from '~/src/common/helpers/types.js'
 */
