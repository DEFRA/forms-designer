import {
  Level2GetStartedMenu,
  Level2ResourcesMenu,
  WebsiteLevel1Routes
} from '~/src/routes/website/constants.js'
import features from '~/src/routes/website/content/features.js'

export default {
  home: {
    mastHead: {
      heading: 'Create and publish Defra forms on GOV.UK',
      description: 'Create and publish Defra forms on GOV.UK'
    },
    whatsNew: {
      date: {
        text: '14 June 2025',
        iso: '2025-06-14T14:01:00.000Z'
      },
      text: 'New conditions and accessibility improvements and updates to preview panel functionality.'
    }
  },
  getStarted: {
    menus: [
      {
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
    ]
  },
  resources: {
    menus: [
      {
        text: 'Good form design guide',
        param: WebsiteLevel1Routes.RESOURCES,
        parent: true,
        children: [
          {
            param: Level2ResourcesMenu.DOES_IT_NEED,
            text: 'Does this need to be a form?'
          },
          {
            param: Level2ResourcesMenu.ACCESSIBILITY,
            text: 'Accessibility and inclusion'
          },
          {
            param: Level2ResourcesMenu.SMES,
            text: 'Working with subject matter experts (SMEs)'
          },
          {
            param: Level2ResourcesMenu.QUESTION_PROTOCOLS,
            text: 'Question protocols'
          },
          {
            param: Level2ResourcesMenu.PROTOTYPING,
            text: 'Prototyping a form'
          },
          {
            param: Level2ResourcesMenu.FORM_PAGES_GOVUK,
            text: 'Form pages on GOV.UK'
          },
          {
            param: Level2ResourcesMenu.PEER_REVIEWING,
            text: 'Peer reviewing forms'
          },
          {
            param: Level2ResourcesMenu.PRIVACY_NOTICES,
            text: 'Privacy notices'
          }
        ]
      }
    ]
  },
  features
}
