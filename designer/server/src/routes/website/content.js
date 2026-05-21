import { Level2MakingAFormMenu } from '~/src/routes/website/constants.js'
import features from '~/src/routes/website/content/features.js'

const heading = 'Create and publish Defra forms on GOV.UK'

export default {
  home: {
    mastHead: {
      heading,
      description: heading
    }
  },
  makingAForm: {
    mastHead: {
      heading,
      description: heading
    },
    menus: [
      {
        text: 'Get started',
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
      },
      {
        text: 'Planning and design',
        parent: true,
        children: [
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
          }
        ]
      },
      {
        text: 'Mandatory tasks',
        parent: true,
        children: [
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
          }
        ]
      },
      {
        text: 'Build, test and publish',
        parent: true,
        children: [
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
  resources: {},
  features
}
