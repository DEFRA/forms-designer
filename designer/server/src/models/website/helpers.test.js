import { getSubmenuPaginatorMap } from '~/src/models/website/helpers.js'
import { Level2GetStartedMenu } from '~/src/routes/website/constants.js'
import content from '~/src/routes/website/content.js'

describe('helpers', () => {
  describe('getSubmenuPaginatorMap', () => {
    it('should zip the menus', () => {
      const zippedMenus = getSubmenuPaginatorMap(content.getStarted.menus[0])

      expect([...zippedMenus.entries()]).toEqual([
        [
          Level2GetStartedMenu.GET_ACCESS,
          {
            next: {
              href: '/get-started/make-form-live-checklist',
              labelText: 'Make a form live checklist'
            }
          }
        ],
        [
          Level2GetStartedMenu.MAKE_FORM_LIVE,
          {
            previous: {
              href: '/get-started/get-access',
              labelText: 'Get access to the Defra Form Designer'
            },
            next: {
              href: '/get-started/form-suitability-criteria',
              labelText: 'Form suitability criteria'
            }
          }
        ],
        [
          Level2GetStartedMenu.FORM_SUITABILITY,
          {
            previous: {
              href: '/get-started/make-form-live-checklist',
              labelText: 'Make a form live checklist'
            },
            next: {
              href: '/get-started/measuring-suitability',
              labelText: 'Measuring the success of your form'
            }
          }
        ],
        [
          Level2GetStartedMenu.MEASURING_SUCCESS,
          {
            previous: {
              href: '/get-started/form-suitability-criteria',
              labelText: 'Form suitability criteria'
            }
          }
        ]
      ])
    })
  })
})
