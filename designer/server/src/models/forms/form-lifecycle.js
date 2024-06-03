import { getFormSpecificNavigation } from './library.js'

import { render } from '~/src/common/nunjucks/index.js'

/**
 * Model to represent confirmation page dialog for a given form.
 * @param {import("./library.js").FormMetadata} form
 */
export function confirmationPageViewModel(form) {
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
    warningText: form.live
      ? `It will replace the form that is currently live.`
      : '',

    bodyText: render.string(
      'Completed forms will be sent to <a href="mailto:{{ teamEmail | urlencode }}" class="govuk-link">{{ teamEmail }}</a>.',
      { context: form }
    ),
    cancelLink: `/library/${form.slug}`
  }
}
