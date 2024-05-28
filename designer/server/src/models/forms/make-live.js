/**
 * Model to represent confirmation page dialog for a given form.
 * @param {string} formTitle - the form title
 * @param {string} formSlug - the form slug
 */
export function confirmationPageViewModel(formTitle, formSlug) {
  const pageTitle = 'Are you sure you want to make this form live?'

  return {
    pageTitle,
    pageHeading: {
      text: pageTitle,
      caption: formTitle
    },
    bodyText: 'Completed forms will be sent to PolicyTeam@defra.gov.uk',
    cancelLink: `/library/${formSlug}`
  }
}
