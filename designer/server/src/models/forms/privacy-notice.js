import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors } from '~/src/lib/utils.js'
import { formOverviewBackLink } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<Pick<FormMetadataInput, 'privacyNoticeType' | 'privacyNoticeText' | 'privacyNoticeUrl' >>} [validation]
 */
export function privacyNoticyViewModel(metadata, validation) {
  const pageTitle = 'Privacy notice for this form'
  const { formValues, formErrors } = validation ?? {}

  // Legacy compatibility - originally only privacty notice url needed to be supplied
  if (!validation && !metadata.privacyNoticeType && metadata.privacyNoticeUrl) {
    metadata.privacyNoticeType = 'link'
  }

  return {
    form: metadata,
    backLink: formOverviewBackLink(metadata.slug),
    pageTitle,
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    fields: {
      privacyNoticeType: {
        id: 'privacyNoticeType',
        name: 'privacyNoticeType',
        fieldset: {
          legend: {
            text: 'How do you want to add a privacy notice?',
            classes: 'govuk-fieldset__legend--m',
            isPageHeading: false
          }
        },
        items: [
          {
            value: 'text',
            text: 'Directly to the form',
            checked:
              (formValues?.privacyNoticeType ?? metadata.privacyNoticeType) ===
              'text'
          },
          {
            value: 'link',
            text: 'Link to a privacy notice on GOV.UK',
            checked:
              (formValues?.privacyNoticeType ?? metadata.privacyNoticeType) ===
              'link'
          }
        ],
        ...insertValidationErrors(validation?.formErrors.privacyNoticeType)
      },
      privacyNoticeText: {
        id: 'privacyNoticeText',
        name: 'privacyNoticeText',
        label: {
          text: 'Enter text'
        },
        value: formValues?.privacyNoticeText ?? metadata.privacyNoticeText,
        ...insertValidationErrors(validation?.formErrors.privacyNoticeText)
      },
      privacyNoticeUrl: {
        id: 'privacyNoticeUrl',
        name: 'privacyNoticeUrl',
        label: {
          text: 'Enter link'
        },
        value: formValues?.privacyNoticeUrl ?? metadata.privacyNoticeUrl,
        ...insertValidationErrors(validation?.formErrors.privacyNoticeUrl)
      }
    },
    buttonText: 'Save and continue'
  }
}

/**
 * @import { FormMetadata, FormMetadataInput } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
