export function unauthorisedViewModel() {
  const pageTitle = 'You do not have access to this service'

  return {
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    }
  }
}
