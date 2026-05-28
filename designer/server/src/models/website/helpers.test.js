import { getSubmenuPaginatorMap } from '~/src/models/website/helpers.js'
import {
  Level2MakingAFormMenu,
  WebsiteLevel1Routes
} from '~/src/routes/website/constants.js'

describe('helpers', () => {
  describe('getSubmenuPaginatorMap', () => {
    it('should zip the menus', () => {
      const menuStub = {
        text: 'Get started',
        param: WebsiteLevel1Routes.MAKING_A_FORM,
        parent: true,
        children: [
          {
            param: Level2MakingAFormMenu.MAKE_SURE_YOU_NEED_A_FORM,
            text: 'Make sure you need a form'
          },
          {
            param: Level2MakingAFormMenu.VIEW_THE_DEMO_FORM,
            text: 'View the demo form'
          },
          {
            param: Level2MakingAFormMenu.WATCH_THE_OVERVIEW_VIDEO,
            text: 'Watch the overview video'
          }
        ]
      }
      const zippedMenus = getSubmenuPaginatorMap(menuStub)

      expect([...zippedMenus.entries()]).toEqual([
        [
          'make-sure-you-need-a-form',
          {
            next: {
              href: '/making-a-form/view-the-demo-form',
              labelText: 'View the demo form'
            }
          }
        ],
        [
          'view-the-demo-form',
          {
            previous: {
              href: '/making-a-form/make-sure-you-need-a-form',
              labelText: 'Make sure you need a form'
            },
            next: {
              href: '/making-a-form/watch-the-overview-video',
              labelText: 'Watch the overview video'
            }
          }
        ],
        [
          'watch-the-overview-video',
          {
            previous: {
              href: '/making-a-form/view-the-demo-form',
              labelText: 'View the demo form'
            }
          }
        ]
      ])
    })
  })
})
