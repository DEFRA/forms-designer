/**
 * Enum for user roles.
 * @readonly
 * @enum {string}
 */
const Product = {
  FORM_DESIGNER: 'Form Designer',
  DEVELOPER_PLUGIN: 'Developer Plugin'
}

export const whatsNewLatest = [
  {
    when: 'January 2026',
    updates: [
      {
        product: [Product.FORM_DESIGNER, Product.DEVELOPER_PLUGIN],
        content: `Customers get a unique reference number for their form submissions, which is also sent in the confirmation email.`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Confirmation emails now include customer answers.`
      }
    ]
  },
  {
    when: 'December 2025',
    updates: [
      {
        product: [Product.FORM_DESIGNER],
        content: `Form sections in Check your answers page:
- add section headings to the Check your answers page to help users quickly review their answers on longer forms
- edit the Check your answers page and select the Sections tab to add section headings and assign pages to each section`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Download submissions to Excel:
- download a spreadsheet of all submissions received for your form in the last 9 months
- from the Forms library page, select your form and open the Responses tab
- choose Send submissions data to receive an email with a download link`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Delete a draft form:
- delete draft forms that are no longer needed from the Form library page`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Customer satisfaction exit survey:
- a customer survey has been added to the end of all live forms
- view survey responses from the Responses tab by choosing Send feedback data`
      }
    ]
  },
  {
    when: 'November 2025',
    updates: [
      {
        product: [Product.FORM_DESIGNER, Product.DEVELOPER_PLUGIN],
        content: `Location questions:
- collect location data from users with four new question types:
  - Easting and northing
  - Ordnance Survey (OS) grid reference
  - National Grid field number
  - Longitude and latitude`
      },
      {
        product: [Product.FORM_DESIGNER, Product.DEVELOPER_PLUGIN],
        content: `Declaration questions:
- new declaration question type allows users to formally agree to something`
      },
      {
        product: [Product.FORM_DESIGNER, Product.DEVELOPER_PLUGIN],
        content: `Postcode lookup for UK Address question type:
- allow users to look up an address from a postcode
- enable this by modifying your UK Address question and checking the Use postcode lookup checkbox`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Support for multiple output emails:
- each output email can have a different address and format
- supports teams using robotics with manual fallback routes
- contact the Forms team to enable this feature`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Confirmation email toggle:
- turn confirmation emails on or off from the Check Your Answers page Editor
- new Confirmation email tab added
- confirmation emails are enabled by default`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Upload any file type:
- Upload supporting evidence question type updated to allow any file type
- enable by selecting the Accept any file checkbox in the Page Editor`
      },
      {
        product: [Product.FORM_DESIGNER, Product.DEVELOPER_PLUGIN],
        content: `Demoting H1 markdown:
- markdown heading levels automatically adjust to maintain proper page structure
- if an H1 exists, new markdown headings are adjusted to the appropriate level`
      }
    ]
  },
  {
    when: 'October 2025',
    updates: [
      {
        product: [Product.FORM_DESIGNER],
        content: `Launch of the Defra Forms microsite at https://forms.defra.gov.uk:
- describes our offering
- showcases features available in our Form Designer application and developer plugin
- provides a step-by-step guide to getting started with Defra Forms and making a form live
- offers a collection of resources to support form creation`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Confirmation emails for form submissions:
- members of the public can now request confirmation emails when submitting a form
- automatically enabled for all newly created forms
- available as an opt-in for existing forms`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Improved error messaging:
- enhanced error messages when deleting questions, pages, or list items that are referenced in conditions`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Forms with exceptionally large lists can now be saved.`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Filter pages in your form by condition.`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Added phase banner with an email link to provide feedback.`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Support for 'add another' items up to 200 items.`
      }
    ]
  },
  {
    when: 'August 2025',
    updates: [
      {
        product: [Product.FORM_DESIGNER],
        content: `User management feature:
- new user management functionality released
- production users set as Form Creators by default
- publishing restricted to the Forms team during Private Beta`
      }
    ]
  },
  {
    when: 'July 2025',
    updates: [
      {
        product: [Product.FORM_DESIGNER],
        content: `Final updates for conditions:
- delete conditions
- create and manage combined conditions
- apply conditions to a guidance page
- view the conditions listing page`
      },
      {
        product: [Product.FORM_DESIGNER],
        content: `Enhancements to Interactive Preview Panel:
- better keyboard navigation using skip links
- termination pages`
      },
      {
        product: [Product.DEVELOPER_PLUGIN],
        content: `v2.0.1 introduces breaking changes with new Save and Return functionality moved into a \`saveAndReturn\` plugin registration option, replacing previous separate functions:
- keyGenerator
- sessionHydrator
- sessionPersister`
      }
    ]
  },
  {
    when: 'April 2025',
    updates: [
      {
        product: [Product.FORM_DESIGNER],
        content: `Service moved to new domain https://forms.defra.gov.uk/ to improve access for colleagues across different ALBs.

No disruption expected:
- forms and files remain
- system functions normally
- old links will be automatically redirected`
      }
    ]
  }
]
