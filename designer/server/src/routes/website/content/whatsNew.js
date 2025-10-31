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
    when: 'October 2025',
    updates: [
      {
        product: Product.FORM_DESIGNER,
        content: `Launch of the Defra Forms microsite. https://forms.defra.gov.uk has been launched to:
- describe our offering
- showcase the features available in our Form Designer application and developer plugin
- provide a step-by-step guide to getting started with Defra Forms and making a form live
- offer a collection of resources to support form creation

Confirmation emails for form submissions:
- members of the public can now request confirmation emails when submitting a form.
- this feature is automatically enabled for all newly created forms and is available as an opt-in for existing forms.
- we'll be rolling this out to all forms soon. If you'd like this enabled for an existing form as a priority, please reach out to us.
- improved error messaging:
- we've enhanced the error messages shown when deleting questions, pages, or list items that are referenced in conditions.
        `
      }
    ]
  },
  {
    when: 'July 2025',
    updates: [
      {
        product: Product.FORM_DESIGNER,
        content: `Final updates for conditions:
- delete conditions
- create and manage combined conditions
- apply conditions to a guidance page
- view the conditions listing page

Enhancements to Interactive Preview Panel:
- better keyboard navigation using skip links
- termination pages
- fixes for defects like lost repeater settings and hint text`
      },
      {
        product: Product.DEVELOPER_PLUGIN,
        content: `v2.0.1 introduces breaking changes with new Save and Return functionality moved into a \`saveAndReturn\` plugin registration option, replacing previous separate functions:
- keyGenerator
- sessionHydrator
- sessionPersister`
      }
    ]
  },
  {
    when: 'August 2025',
    updates: [
      {
        product: Product.FORM_DESIGNER,
        content: `Final updates for conditions:
- delete conditions
- create and manage combined conditions
- apply conditions to a guidance page
- view the conditions listing page

Enhancements to Interactive Preview Panel:
- better keyboard navigation using skip links
- termination pages
- fixes for defects like lost repeater settings and hint text`
      }
    ]
  },
  {
    when: 'April 2025',
    updates: [
      {
        product: Product.FORM_DESIGNER,
        content: `Service moved to new domain https://forms.defra.gov.uk/ to improve access for colleagues across different ALBs.

No disruption expected:
- forms and files remain
- system functions normally
- old links will be automatically redirected`
      }
    ]
  }
]
