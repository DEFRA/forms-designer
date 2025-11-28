// Tab titles for check answers pages
export const PAGE_SETTINGS_TITLE = 'Page settings'
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

/**
 * Check answers page tab identifiers
 */
export const CHECK_ANSWERS_TAB_PAGE_SETTINGS = 'check-answers-overview'
export const CHECK_ANSWERS_TAB_DECLARATION = 'check-answers-settings'
export const CHECK_ANSWERS_TAB_CONFIRMATION_EMAILS = 'confirmation-email-settings'
export const CHECK_ANSWERS_TAB_SECTIONS = 'check-answers-settings/sections'

/**
 * Get the tab configuration for check answers pages
 * @param {string} activeTab - The currently active tab link
 * @returns {TabConfig[]}
 */
export function getCheckAnswersTabConfig(activeTab) {
  /** @type {TabConfig[]} */
  const tabs = [
    { title: PAGE_SETTINGS_TITLE, link: CHECK_ANSWERS_TAB_PAGE_SETTINGS },
    { title: TAB_TITLE_DECLARATION, link: CHECK_ANSWERS_TAB_DECLARATION },
    {
      title: TAB_TITLE_CONFIRMATION_EMAIL,
      link: CHECK_ANSWERS_TAB_CONFIRMATION_EMAILS
    },
    { title: TAB_TITLE_SECTIONS, link: CHECK_ANSWERS_TAB_SECTIONS }
  ]
  return tabs.map((tab) => ({
    ...tab,
    isActive: tab.link === activeTab
  }))
}
