import {
  Level2GetStartedMenu,
  Level2MakingAFormMenu,
  WebsiteLevel1Routes
} from '~/src/routes/website/constants.js'
import features from '~/src/routes/website/content/features.js'
import { whatsNewLatest } from '~/src/routes/website/content/whatsNew.js'

export default {
  home: {
    mastHead: {
      heading: 'Create and publish Defra forms on GOV.UK',
      description: 'Create and publish Defra forms on GOV.UK'
    },
    whatsNew: {
      date: {
        text: '30 January 2026',
        iso: '2026-01-30T15:00:00.000Z'
      },
      text: 'Confirmation emails now include customer answers and unique reference numbers.'
    }
  },
  makingAForm: {
    mastHead: {
      heading: 'Create and publish Defra forms on GOV.UK',
      description: 'Create and publish Defra forms on GOV.UK'
    },
    menus: [
      {
        text: 'Making a form',
        param: WebsiteLevel1Routes.MAKING_A_FORM,
        parent: true,
        children: [
          {
            param: Level2MakingAFormMenu.MAKE_SURE_YOU_NEED_A_FORM,
            text: 'Make sure you need a form'
          },
          {
            param: Level2MakingAFormMenu.WHAT_MAKES_A_GOOD_FORM,
            text: 'What makes a good form'
          },
          {
            param: Level2MakingAFormMenu.GET_THE_RIGHT_PEOPLE_TOGETHER,
            text: 'Get the right people together'
          },
          {
            param: Level2MakingAFormMenu.PLAN_TO_RECEIVE_ONLINE_SUBMISSIONS,
            text: 'Plan to receive digital submissions'
          },
          {
            param: Level2MakingAFormMenu.ONLY_ASK_FOR_INFORMATION_YOU_NEED,
            text: 'Only ask for information you need'
          },
          {
            param: Level2MakingAFormMenu.PLAN_YOUR_FORM,
            text: 'Plan your form'
          },
          {
            param:
              Level2MakingAFormMenu.ADAPTING_A_PDF_OR_PAPER_FORM_TO_A_DIGITAL_FORM,
            text: 'Adapting a PDF or paper form to a digital form'
          },
          {
            param: Level2MakingAFormMenu.TAKE_PAYMENTS,
            text: 'Take payments'
          },
          {
            param: Level2MakingAFormMenu.WRITE_A_PRIVACY_NOTICE,
            text: 'Write a privacy notice'
          },
          {
            param:
              Level2MakingAFormMenu.AGREE_TO_THE_DATA_PROTECTION_TERMS_AND_CONDITIONS,
            text: 'Agree to the data protection terms and conditions'
          },
          {
            param: Level2MakingAFormMenu.CREATE_GUIDANCE_PAGES_ON_GOVUK,
            text: 'Create guidance pages on GOV.UK'
          },
          {
            param: Level2MakingAFormMenu.HAVE_AN_ALTERNATIVE_CONTACT_METHOD,
            text: 'Have an alternative contact method'
          },
          {
            param:
              Level2MakingAFormMenu.CHOOSE_THE_RIGHT_FORMAT_FOR_YOUR_QUESTIONS,
            text: 'Choose the right format for your questions'
          },
          {
            param: Level2MakingAFormMenu.HOW_TO_MAKE_CONDITIONS,
            text: 'How to make conditions'
          },
          {
            param: Level2MakingAFormMenu.SHARE_A_DRAFT_WITH_OTHERS,
            text: 'Share a draft with others'
          },
          {
            param: Level2MakingAFormMenu.GET_A_PEER_REVIEW,
            text: 'Get a peer review'
          },
          {
            param: Level2MakingAFormMenu.SUBMIT_FOR_PUBLICATION,
            text: 'Submit for publication'
          },
          {
            param: Level2MakingAFormMenu.RETIRING_A_PDF_OR_PAPER_FORM,
            text: 'Retiring a PDF or paper form'
          }
        ]
      }
    ]
  },
  whatsNew: {
    mastHead: {
      heading: 'Updates',
      caption: "What's new",
      description: 'Updates to the Defra Form Designer and Developer Plugin.'
    },
    latest: whatsNewLatest
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
  resources: {},
  features
}
