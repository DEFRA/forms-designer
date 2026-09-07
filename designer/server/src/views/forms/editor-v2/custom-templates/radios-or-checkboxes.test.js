import { ExtensionType } from '@defra/forms-model'

import { renderView } from '~/test/helpers/component-helpers.js'

const viewPath = 'forms/editor-v2/custom-templates/radios-or-checkboxes.njk'

const listItems = [
  { id: '1', text: 'Cattle', value: 'cattle' },
  { id: '2', text: 'Sheep', value: 'sheep' },
  {
    id: '3',
    text: 'None of these',
    value: 'none',
    extensions: [{ type: ExtensionType.Exclusive }]
  }
]

// Mirrors enhancedFieldsPerComponentType.CheckboxesField - the edit template
// reads these by position
const checkboxesEnhancedFields = [
  { name: 'radioId', id: 'radioId', value: '' },
  { name: 'radioText', id: 'radioText', label: { text: 'Item text' } },
  { name: 'radioHint', id: 'radioHint', label: { text: 'Hint text' } },
  { name: 'radioValue', id: 'radioValue', label: { text: 'Value' } },
  {
    name: 'radioExclusive',
    id: 'radioExclusive',
    items: [{ text: 'Use as a ‘none of the above’ item' }]
  },
  { name: 'radioAdditionalTitle', id: 'radioAdditionalTitle' },
  { name: 'radioAdditionalHint', id: 'radioAdditionalHint' },
  { name: 'radioAdditionalMaxLength', id: 'radioAdditionalMaxLength' },
  {
    name: 'radioAdditionalOptional',
    id: 'radioAdditionalOptional',
    items: [{ text: 'Make optional' }]
  }
]

describe('Radios or checkboxes list items', () => {
  describe('Exclusive item marker', () => {
    it('should tag only the exclusive item', () => {
      const { document } = renderView(viewPath, {
        context: { state: { listItems } }
      })

      const $tags = document.getElementsByClassName('govuk-tag')

      expect($tags).toHaveLength(1)
      expect($tags[0]).toHaveTextContent('None of the above')
      expect($tags[0]).toHaveClass('govuk-tag--grey')

      const $label = document.getElementById('option-3-label-display')
      expect($label).toContainElement(/** @type {HTMLElement} */ ($tags[0]))
    })

    it('should tag the exclusive item while reordering', () => {
      const { document } = renderView(viewPath, {
        context: { state: { listItems, isReordering: true } }
      })

      const $tags = document.getElementsByClassName('govuk-tag')

      expect($tags).toHaveLength(1)
      expect($tags[0]).toHaveTextContent('None of the above')
    })

    it('should not tag anything when no item is exclusive', () => {
      const { document } = renderView(viewPath, {
        context: { state: { listItems: listItems.slice(0, 2) } }
      })

      expect(document.getElementsByClassName('govuk-tag')).toHaveLength(0)
    })
  })

  describe('Exclusive option availability', () => {
    /**
     * @param {number} rowNumBeingEdited
     * @param {boolean} canSetExclusive
     */
    function renderEditRow(rowNumBeingEdited, canSetExclusive) {
      const editRow = {
        expanded: true,
        radioId: listItems[rowNumBeingEdited - 1]?.id ?? ''
      }

      return renderView(viewPath, {
        context: {
          state: { listItems, editRow },
          listDetails: { rowNumBeingEdited, canSetExclusive, list: 'listname' },
          enhancedFields: checkboxesEnhancedFields
        }
      })
    }

    it('should offer the exclusive option when the row can carry it', () => {
      const { document } = renderEditRow(3, true)

      expect(document.getElementById('radioExclusive')).toBeInTheDocument()
    })

    it('should hide the exclusive option when the row cannot carry it', () => {
      const { document } = renderEditRow(2, false)

      expect(document.getElementById('radioExclusive')).toBeNull()
    })
  })

  describe('Warning notification', () => {
    it('should render the banner when a warning is passed', () => {
      const { container, document } = renderView(viewPath, {
        context: {
          state: { listItems },
          warningNotification:
            '‘Cattle’ is no longer the ‘none of the above’ item.'
        }
      })

      const $banner = document.getElementsByClassName(
        'govuk-notification-banner'
      )

      expect($banner).toHaveLength(1)
      expect(container.getByText('Important')).toBeInTheDocument()
      expect($banner[0]).toHaveTextContent(
        '‘Cattle’ is no longer the ‘none of the above’ item.'
      )
    })

    it('should not render the banner when there is no warning', () => {
      const { document } = renderView(viewPath, {
        context: { state: { listItems } }
      })

      expect(
        document.getElementsByClassName('govuk-notification-banner')
      ).toHaveLength(0)
    })
  })
})
