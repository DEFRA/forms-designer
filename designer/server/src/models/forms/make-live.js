/**
 * Model to represent confirmation page dialog for a given form.
 * @param {string} formTitle - the form title
 */
export function confirmationPageViewModel(formTitle) {
  const pageTitle = 'Are you sure you want to make this form live?'

  return {
    pageTitle,
    pageHeading: {
      text: pageTitle,
      caption: formTitle
    },
    bodyText: 'Completed forms will be sent to PolicyTeam@defra.gov.uk'
  }
}
