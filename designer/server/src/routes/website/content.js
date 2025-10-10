import {
  FeatureIcons,
  Level2GetStartedMenu,
  Level2ResourcesMenu,
  WebsiteLevel1Routes
} from '~/src/routes/website/constants.js'

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
  features: {
    formDesigner: {
      formManagement: [
        {
          heading: 'Library of existing forms',
          icon: FeatureIcons.LIBRARY,
          markdown: 'Search for forms by title, keyword, author and status.'
        },
        {
          heading: 'Form information',
          icon: FeatureIcons.FORM_INFO,
          markdown: `Add data about your form including:
* where submission data is sent
* contact details for support
* what happens after someone submits the form
* privacy policy
* organisation details`
        }
      ],
      formDesign: [
        {
          heading: 'Page types',
          icon: FeatureIcons.PAGE_TYPES,
          markdown: `The Defra Form Designer supports:
- question pages
- guidance pages
- check your answers pages
- confirmation pages
- exit pages`
        },
        {
          heading: 'Error messages',
          icon: FeatureIcons.ERROR_MESSAGES,
          markdown: `Error messages are automatically generated using a short description and can be previewed in real time too.`
        },
        {
          heading: 'Answer limits',
          icon: FeatureIcons.ANSWER_LIMITS,
          markdown: `Limit the answers users can provide. For example, minimum and maximum character lengths or date ranges.`
        },
        {
          heading: 'Form guidance',
          icon: FeatureIcons.FORM_GUIDANCE,
          markdown: `Add guidance and hint text to question or create a specific guidance page.`
        },
        {
          heading: 'Conditions',
          icon: FeatureIcons.CONDITIONS,
          markdown: `Use conditions to show or skip pages based on answers. Combine 2 conditions together for complex routing.`
        },
        {
          heading: 'Form declaration',
          icon: FeatureIcons.FORM_DECLARATION,
          markdown: `Include declaration text at the end of the form for users to agree to.`
        }
      ],
      textAndNumbers: [
        {
          heading: 'Text & Numbers',
          icon: FeatureIcons.TEXT_NUMBERS,
          markdown: `You can ask users for:
- a long or short written answer
- a number
- a date
- a UK address
- a phone number
- an email address
- supporting information like a file or image`
        },
        {
          heading: 'File upload',
          icon: FeatureIcons.FILE_UPLOAD,
          markdown: `Allow users to securely upload supporting documents.`
        }
      ],
      selectingFromAList: [
        {
          heading: 'Yes or no',
          icon: FeatureIcons.YES_NO,
          markdown: `Ask users to select answers from a list of options. Formats include:
- Yes or no
- Checkboxes
- Radios
- Autocomplete
- Select`
        }
      ],
      advancedFeatures: [
        {
          heading: 'Repeating questions',
          icon: FeatureIcons.REPEATING_QUESTIONS,
          markdown: `Get repeated sets of data from users with repeating questions. Design the question once and set the number of times you want users to answer it.`
        },
        {
          heading: 'Previewing a form',
          icon: FeatureIcons.PREVIEW,
          markdown: `Preview your form in real time as you build it. Use the preview link to test the layout and conditions end to end. Share a preview link with others without affecting your form.`
        },
        {
          heading: 'Submitted forms',
          icon: FeatureIcons.SUBMITTED_FORMS,
          markdown: `Data from a form submission is automatically sent to the shared mailbox you signed up with.`
        }
      ],
      featuresComingSoon: [
        {
          heading: 'Confirmation emails',
          icon: FeatureIcons.CONFIRMATION_EMAILS,
          markdown: `Users receive a confirmation email after submitting a form. Confirmation emails include:
- name of form
- date and time of submission
- what happens next
- support information`
        },
        {
          heading: 'Save and exit',
          icon: FeatureIcons.SAVE_EXIT,
          markdown: `Users can save their form progress and return within 28 days using a magic link.`
        },
        {
          heading: 'User management',
          icon: FeatureIcons.USER_MANAGEMENT,
          markdown: `Manage user access and permissions for your forms.`
        },
        {
          heading: 'Auditing',
          icon: FeatureIcons.AUDITING,
          markdown: `See the changes made to your form over time with a clear audit trial.`
        },
        {
          heading: 'API integration',
          icon: FeatureIcons.API_INTEGRATION,
          markdown: `Import data from form submissions into your backend system.`
        },
        {
          heading: 'Page sections',
          icon: FeatureIcons.PAGE_SECTIONS,
          markdown: `Categorise questions into sections. Show and hide sections from users and use section headings on the 'check your answers page'.`
        },
        {
          heading: 'Data output',
          icon: FeatureIcons.DATA_OUTPUT,
          markdown: `Choose how to retrieve submission data.
1. In a human readable format (standard HTML email)
2. In a machine readable format that robots and computers can easily read
`
        }
      ]
    },
    developerPlugin: {
      keyFeatures: [
        {
          heading: 'Seamless Integration',
          icon: FeatureIcons.API_INTEGRATION,
          markdown: `Integrate forms directly into your existing applications with minimal setup and configuration.`
        },
        {
          heading: 'API-first Design',
          icon: FeatureIcons.API_FIRST,
          markdown: `Built with developers in mind, featuring comprehensive APIs for form creation, management, and data retrieval.`
        },
        {
          heading: 'Custom Styling',
          icon: FeatureIcons.CUSTOM_STYLING,
          markdown: `Full control over form appearance and styling to match your application's design system.`
        }
      ]
    },
    compare: {
      table: []
    }
  }
}
