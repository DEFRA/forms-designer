import {
  CHECK_ANSWERS_CAPTION,
  CHECK_ANSWERS_TAB_CONFIRMATION_EMAILS,
  CHECK_ANSWERS_TAB_DECLARATION,
  CHECK_ANSWERS_TAB_PAGE_SETTINGS,
  CHECK_ANSWERS_TAB_SECTIONS,
  PAGE_SETTINGS_TITLE,
  TAB_TITLE_CONFIRMATION_EMAIL,
  TAB_TITLE_DECLARATION,
  TAB_TITLE_SECTIONS,
  getCheckAnswersTabConfig
} from '~/src/models/forms/editor-v2/tab-config.js'

describe('tab-config', () => {
  describe('constants', () => {
    it('should export PAGE_SETTINGS_TITLE', () => {
      expect(PAGE_SETTINGS_TITLE).toBe('Page settings')
    })

    it('should export TAB_TITLE_DECLARATION', () => {
      expect(TAB_TITLE_DECLARATION).toBe('Declaration')
    })

    it('should export TAB_TITLE_CONFIRMATION_EMAIL', () => {
      expect(TAB_TITLE_CONFIRMATION_EMAIL).toBe('Confirmation email')
    })

    it('should export TAB_TITLE_SECTIONS', () => {
      expect(TAB_TITLE_SECTIONS).toBe('Sections')
    })

    it('should export CHECK_ANSWERS_CAPTION', () => {
      expect(CHECK_ANSWERS_CAPTION).toBe('Check answers')
    })

    it('should export tab identifiers', () => {
      expect(CHECK_ANSWERS_TAB_PAGE_SETTINGS).toBe('check-answers-overview')
      expect(CHECK_ANSWERS_TAB_DECLARATION).toBe('check-answers-settings')
      expect(CHECK_ANSWERS_TAB_CONFIRMATION_EMAILS).toBe(
        'confirmation-email-settings'
      )
      expect(CHECK_ANSWERS_TAB_SECTIONS).toBe('check-answers-settings/sections')
    })
  })

  describe('getCheckAnswersTabConfig', () => {
    it('should return all four tabs', () => {
      const result = getCheckAnswersTabConfig(CHECK_ANSWERS_TAB_PAGE_SETTINGS)

      expect(result).toHaveLength(4)
      expect(result.map((t) => t.title)).toEqual([
        PAGE_SETTINGS_TITLE,
        TAB_TITLE_DECLARATION,
        TAB_TITLE_CONFIRMATION_EMAIL,
        TAB_TITLE_SECTIONS
      ])
    })

    it('should mark page settings tab as active', () => {
      const result = getCheckAnswersTabConfig(CHECK_ANSWERS_TAB_PAGE_SETTINGS)

      expect(result[0].isActive).toBe(true)
      expect(result[1].isActive).toBe(false)
      expect(result[2].isActive).toBe(false)
      expect(result[3].isActive).toBe(false)
    })

    it('should mark declaration tab as active', () => {
      const result = getCheckAnswersTabConfig(CHECK_ANSWERS_TAB_DECLARATION)

      expect(result[0].isActive).toBe(false)
      expect(result[1].isActive).toBe(true)
      expect(result[2].isActive).toBe(false)
      expect(result[3].isActive).toBe(false)
    })

    it('should mark confirmation emails tab as active', () => {
      const result = getCheckAnswersTabConfig(
        CHECK_ANSWERS_TAB_CONFIRMATION_EMAILS
      )

      expect(result[0].isActive).toBe(false)
      expect(result[1].isActive).toBe(false)
      expect(result[2].isActive).toBe(true)
      expect(result[3].isActive).toBe(false)
    })

    it('should mark sections tab as active', () => {
      const result = getCheckAnswersTabConfig(CHECK_ANSWERS_TAB_SECTIONS)

      expect(result[0].isActive).toBe(false)
      expect(result[1].isActive).toBe(false)
      expect(result[2].isActive).toBe(false)
      expect(result[3].isActive).toBe(true)
    })

    it('should have correct links', () => {
      const result = getCheckAnswersTabConfig(CHECK_ANSWERS_TAB_PAGE_SETTINGS)

      expect(result[0].link).toBe(CHECK_ANSWERS_TAB_PAGE_SETTINGS)
      expect(result[1].link).toBe(CHECK_ANSWERS_TAB_DECLARATION)
      expect(result[2].link).toBe(CHECK_ANSWERS_TAB_CONFIRMATION_EMAILS)
      expect(result[3].link).toBe(CHECK_ANSWERS_TAB_SECTIONS)
    })
  })
})
