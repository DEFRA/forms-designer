import { render } from '~/src/common/nunjucks/index.js'
import { getFormSpecificNavigation } from '~/src/models/forms/library.js'
import { formOverviewPath } from '~/src/models/links.js'

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

  return {
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      caption: form.title
    },

    errorList,

    warning: form.live
      ? { text: `It will replace the form that is currently live.` }
      : undefined,

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
        classes: 'govuk-button--secondary'
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
  const pageTitle = 'Are you sure you want to delete this form?'

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

    warning: { text: 'You cannot recover deleted forms.' },

    buttons: [
      {
        text: 'Delete form',
        classes: 'govuk-button--warning'
      },
      {
        href: formPath,
        text: 'Cancel',
        classes: 'govuk-button--secondary'
      }
    ]
  }
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 * @import { ErrorDetailsItem } from '~/src/common/helpers/types.js'
 */
