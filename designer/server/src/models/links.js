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
 * Path to the editor-v2 pages
 * @param {string} slug - the form slug
 * @param {string | null} page - the form page
 */
export function editorv2Path(slug, page = '') {
  return `${formsLibraryPath}/${slug}/editor-v2/${page}`
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
