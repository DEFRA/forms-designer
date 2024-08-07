export function unauthorisedViewModel() {
  const pageTitle = 'You are unauthorised'

  return {
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    }
  }
}
