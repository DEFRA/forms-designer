import { editorv2Path } from '~/src/models/links.js'

export const PAGE_OVERVIEW_TITLE = 'Page overview'
export const TAB_TITLE_DECLARATION = 'Declaration'
export const TAB_TITLE_CONFIRMATION_EMAIL = 'Confirmation email'
export const TAB_TITLE_SECTIONS = 'Sections'
export const CHECK_ANSWERS_CAPTION = 'Check answers'

/**
 * @typedef {object} TabConfig
 * @property {string} title - The display title of the tab
 * @property {string} link - The link path for the tab
 * @property {boolean} [isActive] - Whether this tab is currently active
 */

export const CHECK_ANSWERS_TAB_PAGE_OVERVIEW = 'check-answers-settings'
export const CHECK_ANSWERS_TAB_DECLARATION =
  'check-answers-settings/declaration'
export const CHECK_ANSWERS_TAB_CONFIRMATION_EMAILS =
  'check-answers-settings/confirmation-email'
export const CHECK_ANSWERS_TAB_SECTIONS = 'check-answers-settings/sections'

/**
 * Get the tab configuration for check answers pages with full absolute paths
 * @param {string} slug - The form slug
 * @param {string} pageId - The page ID
 * @param {string} activeTab - The currently active tab link
 * @returns {TabConfig[]}
 */
export function getCheckAnswersTabConfig(slug, pageId, activeTab) {
  /** @type {TabConfig[]} */
  const tabs = [
    { title: PAGE_OVERVIEW_TITLE, link: CHECK_ANSWERS_TAB_PAGE_OVERVIEW },
    { title: TAB_TITLE_DECLARATION, link: CHECK_ANSWERS_TAB_DECLARATION },
    {
      title: TAB_TITLE_CONFIRMATION_EMAIL,
      link: CHECK_ANSWERS_TAB_CONFIRMATION_EMAILS
    },
    { title: TAB_TITLE_SECTIONS, link: CHECK_ANSWERS_TAB_SECTIONS }
  ]
  return tabs.map((tab) => ({
    title: tab.title,
    link: editorv2Path(slug, `page/${pageId}/${tab.link}`),
    isActive: tab.link === activeTab
  }))
}
