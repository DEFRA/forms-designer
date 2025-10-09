import { getSubmenuPaginatorMap } from '~/src/models/website/helpers.js'
import {
  Level2GetStartedMenu,
  WebsiteLevel1Routes
} from '~/src/routes/website/constants.js'

describe('helpers', () => {
  describe('getSubmenuPaginatorMap', () => {
    it('should zip the menus', () => {
      const menuStub = {
        text: 'Get started',
        param: WebsiteLevel1Routes.GET_STARTED,
        parent: true,
        children: [
          {
            param: Level2GetStartedMenu.GET_ACCESS,
            text: 'Get access to the Defra Form Designer'
          },
          {
            param: Level2GetStartedMenu.MAKE_FORM_LIVE,
            text: 'Make a form live checklist'
          },
          {
            param: Level2GetStartedMenu.FORM_SUITABILITY,
            text: 'Form suitability criteria'
          },
          {
            param: Level2GetStartedMenu.MEASURING_SUCCESS,
            text: 'Measuring the success of your form'
          }
        ]
      }
      const zippedMenus = getSubmenuPaginatorMap(menuStub)

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
