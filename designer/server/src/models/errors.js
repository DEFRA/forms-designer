/**
 * @param {string} pageTitle
 */
export function errorViewModel(pageTitle) {
  return {
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    }
  }
}
