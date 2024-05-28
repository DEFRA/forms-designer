/**
 * Model to represent confirmation page dialog for a given form.
 * @param {import("./library.js").FormMetadata} form
 */
export function confirmationPageViewModel(form) {
  const pageTitle = 'Are you sure you want to make this form live?'

  return {
    pageTitle,
    pageHeading: {
      text: pageTitle,
      caption: form.title
    },
    bodyText: `Completed forms will be sent to ${form.teamEmail}`,
    cancelLink: `/library/${form.slug}`
  }
}
