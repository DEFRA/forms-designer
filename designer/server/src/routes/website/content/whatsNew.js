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
    when: 'July 2025',
    updates: [
      {
        product: Product.FORM_DESIGNER,
        content: `Final updates for conditions:
- Delete Conditions
- Create and Manage Combined Conditions
- Apply Conditions to a Guidance Page
- View the Conditions Listing Page

Enhancements to Interactive Preview Panel:
- Better keyboard navigation using skip links
- Termination Pages
- Fixes for defects like lost repeater settings and hint text`
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
- Delete Conditions
- Create and Manage Combined Conditions
- Apply Conditions to a Guidance Page
- View the Conditions Listing Page

Enhancements to Interactive Preview Panel:
- Better keyboard navigation using skip links
- Termination Pages
- Fixes for defects like lost repeater settings and hint text`
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
- Forms and files remain
- System functions normally
- Old links will be automatically redirected`
      }
    ]
  }
]
