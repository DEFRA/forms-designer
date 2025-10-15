export const backToFormOverviewLinkText = 'Back to form overview'
export const backToFormsLibraryLinkText = 'Back to forms library'
export const formsServices = '/services'
export const formsLibraryPath = '/library'
export const formsAboutPath = '/about'
export const formsGetStartedPath = '/get-started'
export const formsFeaturesPath = '/features'
export const formsResourcesPath = '/resources'
export const formsSupportPath = '/support'

export const formsWebsitePaths = [
  formsServices,
  formsAboutPath,
  formsGetStartedPath,
  formsFeaturesPath,
  formsResourcesPath,
  formsSupportPath
]

/**
 * Path to the form overview page
 * @param {string} slug - the form slug
 */
export function formOverviewPath(slug) {
  return `${formsLibraryPath}/${slug}`
}

/**
 * Editor form path
 * @param {string} slug - the form slug
 * @param {string} path - the path
 */
export function editorFormPath(slug, path) {
  return `${formsLibraryPath}/${slug}/editor-v2/${path}`
}

/**
 * Path to the editor-v2 pages
 * @param {string} slug - the form slug
 * @param {string} page - the form page
 */
export function editorv2Path(slug, page = '') {
  return editorFormPath(slug, page)
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
