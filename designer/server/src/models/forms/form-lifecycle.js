import { render } from '~/src/common/nunjucks/index.js'
import { getFormSpecificNavigation } from '~/src/models/forms/library.js'

/**
 * Model to represent confirmation page dialog for a given form.
 * @param {FormMetadata} form
 * @param {ErrorDetailsItem[]} errorList - list of errors to display to the user
 */
export function confirmationPageViewModel(form, errorList) {
  const pageTitle = 'Are you sure you want to make the draft live?'

  const formPath = `/library/${form.slug}`
  const navigation = getFormSpecificNavigation(formPath)

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

    bodyText: render.string(
      'Completed forms will be sent to <a href="mailto:{{ teamEmail | urlencode }}" class="govuk-link">{{ teamEmail }}</a>.',
      { context: form }
    ),

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
 * @import { FormMetadata } from '@defra/forms-model'
 * @import { ErrorDetailsItem } from '~/src/common/helpers/types.js'
 */
