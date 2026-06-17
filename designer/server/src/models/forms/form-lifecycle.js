import { render } from '~/src/common/nunjucks/index.js'
import { getFormSpecificNavigation } from '~/src/models/forms/library.js'
import { formOverviewPath } from '~/src/models/links.js'

const GOVUK_BUTTON_SECONDARY = 'govuk-button--secondary'

/**
 * Model to represent confirmation page dialog for a given form.
 * @param {FormMetadata} form
 * @param {FormDefinition} formDefinition
 * @param {ErrorDetailsItem[]} errorList - list of errors to display to the user
 */
export function makeDraftLiveConfirmationPageViewModel(
  form,
  formDefinition,
  errorList
) {
  const pageTitle = 'Are you sure you want to make the draft live?'

  const formPath = formOverviewPath(form.slug)
  const navigation = getFormSpecificNavigation(formPath, form, formDefinition)

  const warningText = form.offline
    ? 'It will replace the form that is currently offline.'
    : 'It will replace the form that is currently live.'

  return {
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      caption: form.title
    },

    errorList,

    warning: form.live ? { text: warningText } : undefined,

    bodyText: form.notificationEmail
      ? render.string(
          'Completed forms will be sent to <a href="mailto:{{ notificationEmail | urlencode }}" class="govuk-link">{{ notificationEmail }}</a>.',
          { context: form }
        )
      : undefined,

    buttons: [
      {
        text: 'Make draft live'
      },
      {
        href: formPath,
        text: 'Cancel',
        classes: GOVUK_BUTTON_SECONDARY
      }
    ]
  }
}

/**
 * Model to represent confirmation page dialog for a given form.
 * @param {FormMetadata} form
 * @param {FormDefinition} formDefinition
 * @param {ErrorDetailsItem[]} errorList - list of errors to display to the user
 */
export function deleteDraftConfirmationPageViewModel(
  form,
  formDefinition,
  errorList
) {
  const pageTitle = form.live
    ? 'Are you sure you want to delete this draft?'
    : 'Are you sure you want to delete this form?'

  const formPath = formOverviewPath(form.slug)
  const navigation = getFormSpecificNavigation(formPath, form, formDefinition)

  return {
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      caption: form.title
    },

    errorList,

    warning: {
      text: form.live
        ? 'You cannot recover deleted drafts.'
        : 'You cannot recover deleted forms.'
    },

    buttons: [
      {
        text: form.live ? 'Delete draft' : 'Delete form',
        classes: 'govuk-button--warning'
      },
      {
        href: formPath,
        text: 'Cancel',
        classes: GOVUK_BUTTON_SECONDARY
      }
    ]
  }
}

/**
 * Model to represent confirmation page dialog for taking a form offline.
 * @param {FormMetadata} form
 * @param {FormDefinition} formDefinition
 * @param {ErrorDetailsItem[]} errorList - list of errors to display to the user
 */
export function takeFormOfflineConfirmationPageViewModel(
  form,
  formDefinition,
  errorList
) {
  const formPath = formOverviewPath(form.slug)
  const navigation = getFormSpecificNavigation(formPath, form, formDefinition)

  const pageTitle = 'Are you sure you want to take this form offline?'

  return {
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      caption: form.title
    },

    errorList,

    warning: {
      html: 'Contact details are shown on the service unavailable page, Changes will be visible to users.'
    },

    bodyText: `<p class="govuk-body">This form will be removed from GOV.UK and replaced with a
    <a href="https://design-system.service.gov.uk/patterns/service-unavailable-pages/" target="_blank">service unavailable page (opens in a new tab)</a>.</p>
    <p class="govuk-body">You can make this form live again at any time.</p>`,

    buttons: [
      {
        text: 'Take form offline'
      },
      {
        href: formPath,
        text: 'Cancel',
        classes: GOVUK_BUTTON_SECONDARY
      }
    ]
  }
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 * @import { ErrorDetailsItem } from '~/src/common/helpers/types.js'
 */
