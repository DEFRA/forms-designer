import {
  FeatureComparisonIcons,
  FeatureIcons
} from '~/src/routes/website/constants.js'

export default {
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
      },
      {
        heading: 'Auditing',
        icon: FeatureIcons.AUDITING,
        markdown: `See the changes made to your form over time with a clear audit trial.`
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
      },
      {
        heading: 'Page sections',
        icon: FeatureIcons.PAGE_SECTIONS,
        markdown: `Categorise questions into sections.`
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
    location: [
      {
        heading: 'Address and postcode lookup',
        icon: FeatureIcons.ADDRESS_LOOKUP,
        markdown: `Search for addresses using postcodes with autocomplete functionality.`
      },
      {
        heading: 'Map questions',
        icon: FeatureIcons.MAP,
        markdown: `Gather location information from a user with an interactive map.`
      }
    ],
    outputs: [
      {
        heading: 'Submitted forms as emails',
        icon: FeatureIcons.SUBMITTED_FORMS,
        markdown: `Data from a form submission is automatically sent to the shared mailbox you signed up with.`
      },
      {
        heading: 'Email formats',
        icon: FeatureIcons.DATA_OUTPUT,
        markdown: `Choose how to retrieve submission data.
1. In a human readable format (standard HTML email)
2. In a machine readable format that robots and computers can easily read
`
      },
      {
        heading: 'Export to Excel',
        icon: FeatureIcons.EXCEL_DOWNLOAD,
        markdown: `Download all form responses as an Excel document.`
      },
      {
        heading: 'API integration',
        icon: FeatureIcons.API_INTEGRATION,
        markdown: `Import data from form submissions into your backend system.`
      },
      {
        heading: 'Sharepoint integration',
        icon: FeatureIcons.SHAREPOINT,
        markdown: `Send form submission data directly to your SharePoint site.`
      }
    ],
    customerCommunication: [
      {
        heading: 'Confirmation emails',
        icon: FeatureIcons.CONFIRMATION_EMAILS,
        markdown: `Users receive a confirmation email after submitting a form. Confirmation emails include:
- a copy of their answers
- name of form
- date and time of submission
- what happens next
- support information`
      },
      {
        heading: 'Customer satisfaction exit survey',
        icon: FeatureIcons.SURVEY,
        markdown: `Gather feedback from users after they submit their form to improve your service.`
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
        heading: 'Save and exit',
        icon: FeatureIcons.SAVE_EXIT,
        markdown: `Users can save their form progress and return within 28 days using a magic link.`
      },
      {
        heading: 'Reference numbers',
        icon: FeatureIcons.REFERENCE_NUMBERS,
        markdown: `Each form submission is assigned a unique reference number that users can use to track their application.`
      }
    ],
    featuresComingSoon: [
      {
        heading: 'GOV.UK Pay',
        icon: FeatureIcons.PAYMENT,
        markdown: `Collect payments as part of your form. Support for fixed and variable payment amounts.`
      },
      {
        heading: 'Map questions',
        icon: FeatureIcons.MAP_ADVANCED,
        markdown: `Advanced map interactions including drawing shapes, lines, and data layers.`
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
        heading: 'API-first design',
        icon: FeatureIcons.API_FIRST,
        markdown: `Built with developers in mind, featuring comprehensive APIs for form creation, management, and data retrieval.`
      },
      {
        heading: 'Custom styling',
        icon: FeatureIcons.CUSTOM_STYLING,
        markdown: `Full control over form appearance and styling to match your application's design system.`
      }
    ]
  },
  compare: {
    table: [
      {
        title: 'Form management',
        children: [
          {
            icon: FeatureIcons.LIBRARY,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.NOT_AVAILABLE,
            title: 'Library of existing forms',
            description:
              'Search for forms by title, keyword, author and status.'
          },
          {
            icon: FeatureIcons.FORM_INFO,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.NOT_AVAILABLE,
            title: 'Form information',
            description:
              'Manage form metadata, titles, descriptions and settings.'
          },
          {
            icon: FeatureIcons.PENCIL,
            designer: FeatureComparisonIcons.NOT_AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Load forms from a custom source',
            description:
              'Forms can be persisted and loaded in any service of your choosing. Example options: filesystem, database, API, etc.'
          },
          {
            icon: FeatureIcons.AUDITING,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.NOT_AVAILABLE,
            title: 'Auditing',
            description:
              'Track changes made to your form over time with a clear audit trail for compliance and governance.'
          }
        ]
      },
      {
        title: 'Form design',
        children: [
          {
            icon: FeatureIcons.PENCIL_BOX,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.NOT_AVAILABLE,
            title: 'Visual form editor',
            description:
              'Work on your form with a web-based graphical user interface. Live previews, etc.'
          },
          {
            icon: FeatureIcons.PAGE_TYPES,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Page types',
            description:
              'Standard page types for common form patterns and layouts.'
          },
          {
            icon: FeatureIcons.PENCIL_BOX,
            designer: FeatureComparisonIcons.NOT_AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Custom page types',
            description:
              'Developers can build bespoke pages using Javascript and Nunjucks, e.g. custom visuals, calls out to backend APIs, etc.'
          },
          {
            icon: FeatureIcons.ERROR_MESSAGES,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Error messages',
            description:
              ' Customisable validation error messages for form fields.'
          },
          {
            icon: FeatureIcons.ANSWER_LIMITS,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Answer limits',
            description:
              'Set character limits and validation rules for text input fields.'
          },
          {
            icon: FeatureIcons.FORM_GUIDANCE,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Form guidance',
            description:
              'Add help text and guidance to help users complete forms correctly.'
          },
          {
            icon: FeatureIcons.CONDITIONS,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Conditions',
            description:
              'Show or hide questions and pages based on previous answers.'
          },
          {
            icon: FeatureIcons.FORM_DECLARATION,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Form declaration',
            description:
              'Legal declarations and terms that users must agree to before submitting.'
          },
          {
            icon: FeatureIcons.CUSTOM_STYLING,
            designer: FeatureComparisonIcons.NOT_AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Fully customisable page content',
            description:
              'Form designer allows you to add questions (input fields, selection fields) on a page. Developer plugin allows you to add components (input fields, selection fields, guidance, HTML, etc) to a page. Developer plugin does not enforce the order of these components.'
          },
          {
            icon: FeatureIcons.PAGE_SECTIONS,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Page sections',
            description:
              'Categorise questions into sections for better organisation and user experience.'
          }
        ]
      },
      {
        title: 'Information types',
        children: [
          {
            icon: FeatureIcons.TEXT_NUMBERS,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Text & numbers',
            description:
              'Standard text input fields for names, addresses, numbers and other alphanumeric data.'
          },
          {
            icon: FeatureIcons.FILE_UPLOAD,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.SOME_AVAILABLE,
            title: 'File upload',
            description:
              'Allow users to upload documents, images and other files as part of their form submission.'
          }
        ]
      },
      {
        title: 'Selecting from a list',
        children: [
          {
            icon: FeatureIcons.YES_NO,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Yes or no',
            description:
              'Simple radio button selection for yes/no questions and confirmations.'
          }
        ]
      },
      {
        title: 'Location',
        children: [
          {
            icon: FeatureIcons.ADDRESS_LOOKUP,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Address and postcode lookup',
            description:
              'Search for addresses using postcodes with autocomplete functionality.'
          },
          {
            icon: FeatureIcons.MAP,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Map questions',
            description:
              'Gather location information from users with an interactive map.'
          }
        ]
      },
      {
        title: 'Outputs',
        children: [
          {
            icon: FeatureIcons.SUBMITTED_FORMS,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Submitted forms as emails',
            description:
              'Data from form submissions is automatically sent to the shared mailbox you signed up with.'
          },
          {
            icon: FeatureIcons.DATA_OUTPUT,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Email formats',
            description:
              'Choose how to retrieve submission data in human readable (HTML email) or machine readable format.'
          },
          {
            icon: FeatureIcons.EXCEL_DOWNLOAD,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.NOT_AVAILABLE,
            title: 'Export to Excel',
            description:
              'Download all form responses as an Excel document for analysis and record keeping.'
          },
          {
            icon: FeatureIcons.API_INTEGRATION,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'API integration',
            description:
              'Import data from form submissions into your backend system.'
          },
          {
            icon: FeatureIcons.SHAREPOINT,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.NOT_AVAILABLE,
            title: 'Sharepoint integration',
            description:
              'Send form submission data directly to your SharePoint site.'
          }
        ]
      },
      {
        title: 'Customer communication',
        children: [
          {
            icon: FeatureIcons.CONFIRMATION_EMAILS,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Confirmation emails',
            description:
              'Users receive a confirmation email after submitting a form with a copy of their answers, submission details, and next steps.'
          },
          {
            icon: FeatureIcons.SURVEY,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.NOT_AVAILABLE,
            title: 'Customer satisfaction exit survey',
            description:
              'Gather feedback from users after they submit their form to improve your service.'
          }
        ]
      },
      {
        title: 'Advanced features',
        children: [
          {
            icon: FeatureIcons.REPEATING_QUESTIONS,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Repeating questions',
            description:
              'Allow users to add multiple instances of the same question, such as multiple addresses or dependents.'
          },
          {
            icon: FeatureIcons.PREVIEW,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.NOT_AVAILABLE,
            title: 'Previewing a form',
            description:
              'Test how your form looks and behaves before publishing it to users.'
          },
          {
            icon: FeatureIcons.SAVE_EXIT,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: 'someAvailable',
            title: 'Save and exit',
            description:
              'Users can save their form progress and return within 28 days using a magic link. The plugin offers an API for save and return functionality, but service teams are responsible for providing the user interface.'
          },
          {
            icon: FeatureIcons.REFERENCE_NUMBERS,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Reference numbers',
            description:
              'Each form submission is assigned a unique reference number that users can use to track their application.'
          },
          {
            icon: FeatureIcons.PENCIL,
            designer: FeatureComparisonIcons.NOT_AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Page events',
            description:
              'Trigger API calls on certain events, e.g. loading or saving a page. Change page visuals with code, e.g. using previous answers, API responses, etc.'
          },
          {
            icon: FeatureIcons.PAGE_TEMPLATES,
            designer: FeatureComparisonIcons.NOT_AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Page templates',
            description:
              'Reusable page layouts and designs that can be applied across multiple forms.'
          }
        ]
      },
      {
        title: 'Features coming soon',
        children: [
          {
            icon: FeatureIcons.PAYMENT,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.NOT_AVAILABLE,
            title: 'GOV.UK Pay',
            description:
              'Collect payments as part of your form with support for fixed and variable payment amounts.'
          },
          {
            icon: FeatureIcons.MAP_ADVANCED,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Advanced map questions',
            description:
              'Advanced map interactions including drawing shapes, lines, and data layers.'
          }
        ]
      },
      {
        title: 'Deployment',
        children: [
          {
            icon: FeatureIcons.FREE_HOSTING,
            designer: FeatureComparisonIcons.AVAILABLE,
            plugin: FeatureComparisonIcons.NOT_AVAILABLE,
            title: 'Free hosting',
            description:
              "Defra Forms team take care of hosting the service so it's always accessible by members of the public. We take care of hosting, monitoring, maintenance, running costs, etc."
          },
          {
            icon: FeatureIcons.SELF_HOSTED,
            designer: FeatureComparisonIcons.NOT_AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Self-hosted',
            description:
              'Service teams take care of hosting the form themselves, either as a standalone form or integrated into their existing service.'
          },
          {
            icon: FeatureIcons.INTEGRATION,
            designer: FeatureComparisonIcons.NOT_AVAILABLE,
            plugin: FeatureComparisonIcons.AVAILABLE,
            title: 'Integration into existing applications',
            description: 'Forms can be embedded in existing applications.'
          }
        ]
      }
    ]
  }
}
