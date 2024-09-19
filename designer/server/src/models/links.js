export const backToFormOverviewLinkText = 'Back to form overview'
export const backToFormsLibraryLinkText = 'Back to forms library'
export const formsLibraryPath = '/library'

/**
 * Path to the form overview page
 * @param {string} slug - the form slug
 */
export function formOverviewPath(slug) {
  return `${formsLibraryPath}/${slug}`
}

/**
 * Back link to the form overview page
 * @param {string} slug - the form slug
 */
export function formOverviewBackLink(slug) {
  return {
    text: backToFormOverviewLinkText,
    href: formOverviewPath(slug)
  }
}

/**
 * Back link to the forms library page
 */
export const formsLibraryBackLink = {
  text: backToFormsLibraryLinkText,
  href: formsLibraryPath
}
