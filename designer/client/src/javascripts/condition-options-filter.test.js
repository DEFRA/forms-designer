import {
  buildHiddenNoticeText,
  buildStatusText,
  enhanceOptionsFilter,
  initConditionOptionsFilters
} from '~/src/javascripts/condition-options-filter.js'

/**
 * Renders the markup the server produces for a filterable condition value list.
 * @param {string[]} options - the option label texts
 * @param {number[]} [checkedIndexes] - indexes that should start checked
 * @returns {HTMLElement}
 */
function renderContainer(options, checkedIndexes = []) {
  const itemsHtml = options
    .map((text, idx) => {
      const checked = checkedIndexes.includes(idx) ? ' checked' : ''
      return `
        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="opt-${idx}" name="items" type="checkbox" value="${idx}"${checked}>
          <label class="govuk-checkboxes__label" for="opt-${idx}">${text}</label>
        </div>`
    })
    .join('')

  const container = document.createElement('div')
  container.setAttribute('data-module', 'app-options-filter')
  container.innerHTML = `
    <div class="govuk-form-group">
      <fieldset class="govuk-fieldset">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">Select a value</legend>
        <div class="govuk-checkboxes govuk-checkboxes--small">${itemsHtml}</div>
      </fieldset>
    </div>`

  document.body.appendChild(container)
  return container
}

/**
 * @param {HTMLElement} container
 */
function getVisibleLabels(container) {
  return Array.from(container.querySelectorAll('.govuk-checkboxes__item'))
    .filter((item) => !item.hasAttribute('hidden'))
    .map((item) => item.querySelector('.govuk-checkboxes__label')?.textContent)
}

describe('condition-options-filter', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('buildStatusText', () => {
    it('reports all values when the query is empty', () => {
      expect(buildStatusText(12, 12, '')).toBe('Showing all 12 values')
    })

    it('reports no matching values when nothing matches', () => {
      expect(buildStatusText(0, 12, 'zzz')).toBe('No matching values')
    })

    it('reports the matching count when filtered', () => {
      expect(buildStatusText(3, 12, 're')).toBe('Showing 3 of 12 values')
    })
  })

  describe('buildHiddenNoticeText', () => {
    it('uses the singular noun for one hidden item', () => {
      expect(buildHiddenNoticeText(1)).toBe('1 item hidden. Show all')
    })

    it('uses the plural noun for multiple hidden items', () => {
      expect(buildHiddenNoticeText(4)).toBe('4 items hidden. Show all')
    })

    it('formats large numbers for readability', () => {
      expect(buildHiddenNoticeText(1234)).toBe('1,234 items hidden. Show all')
    })
  })

  describe('enhanceOptionsFilter', () => {
    it('inserts an accessible filter box directly below the legend', () => {
      const container = renderContainer(['Red', 'Blue', 'Green'])

      enhanceOptionsFilter(container)

      const legend = container.querySelector('.govuk-fieldset__legend')
      const group = legend?.nextElementSibling

      expect(group).toHaveClass('app-options-filter')

      const label = group?.querySelector('label')
      const input = group?.querySelector('input')

      expect(label).toHaveTextContent('Filter values')
      expect(label?.getAttribute('for')).toBe(input?.id)
      expect(input?.getAttribute('aria-controls')).toBe(
        container.querySelector('.govuk-checkboxes')?.id
      )
      expect(input?.getAttribute('aria-describedby')).toBe(
        group?.querySelector('[role="status"]')?.id
      )
      // Must not be submitted with the form
      expect(input?.hasAttribute('name')).toBe(false)
    })

    it('places the filter box above the options', () => {
      const container = renderContainer(['Red', 'Blue', 'Green'])

      enhanceOptionsFilter(container)

      const children = Array.from(
        container.querySelector('.govuk-fieldset')?.children ?? []
      )
      const filterIndex = children.findIndex((el) =>
        el.classList.contains('app-options-filter')
      )
      const optionsIndex = children.findIndex((el) =>
        el.classList.contains('govuk-checkboxes')
      )

      expect(filterIndex).toBeGreaterThanOrEqual(0)
      expect(filterIndex).toBeLessThan(optionsIndex)
    })

    it('hides options that do not match the typed filter', () => {
      const container = renderContainer(['Red', 'Blue', 'Green', 'Yellow'])

      enhanceOptionsFilter(container)

      const input = /** @type {HTMLInputElement} */ (
        container.querySelector('.app-options-filter__input')
      )
      input.value = 'll'
      input.dispatchEvent(new InputEvent('input', { bubbles: true }))

      expect(getVisibleLabels(container)).toEqual(['Yellow'])
    })

    it('shows all options again when the filter is cleared by typing', () => {
      const container = renderContainer(['Red', 'Blue', 'Green'])

      enhanceOptionsFilter(container)

      const input = /** @type {HTMLInputElement} */ (
        container.querySelector('.app-options-filter__input')
      )
      input.value = 'red'
      input.dispatchEvent(new InputEvent('input', { bubbles: true }))
      expect(getVisibleLabels(container)).toEqual(['Red'])

      input.value = ''
      input.dispatchEvent(new InputEvent('input', { bubbles: true }))
      expect(getVisibleLabels(container)).toEqual(['Red', 'Blue', 'Green'])
    })

    it('retains the checked state of options hidden by the filter', () => {
      const container = renderContainer(['Red', 'Blue', 'Green'], [1])

      enhanceOptionsFilter(container)

      const input = /** @type {HTMLInputElement} */ (
        container.querySelector('.app-options-filter__input')
      )
      const blue = /** @type {HTMLInputElement} */ (
        container.querySelector('#opt-1')
      )

      expect(blue.checked).toBe(true)

      // Filter Blue out of view
      input.value = 'red'
      input.dispatchEvent(new InputEvent('input', { bubbles: true }))
      expect(blue.closest('.govuk-checkboxes__item')).toHaveAttribute('hidden')
      expect(blue.checked).toBe(true)

      // Bring it back
      input.value = ''
      input.dispatchEvent(new InputEvent('input', { bubbles: true }))
      expect(blue.checked).toBe(true)
    })

    it('clears the filter and refocuses the input via the Clear button', () => {
      const container = renderContainer(['Red', 'Blue', 'Green'])

      enhanceOptionsFilter(container)

      const input = /** @type {HTMLInputElement} */ (
        container.querySelector('.app-options-filter__input')
      )
      const clear = /** @type {HTMLButtonElement} */ (
        container.querySelector('.app-options-filter__clear')
      )

      expect(clear.type).toBe('button')
      expect(clear).toHaveTextContent('Clear filter')

      input.value = 'green'
      input.dispatchEvent(new InputEvent('input', { bubbles: true }))
      expect(getVisibleLabels(container)).toEqual(['Green'])

      clear.click()

      expect(input.value).toBe('')
      expect(getVisibleLabels(container)).toEqual(['Red', 'Blue', 'Green'])
      expect(document.activeElement).toBe(input)
    })

    it('updates the live status region as the filter changes', () => {
      const container = renderContainer(['Red', 'Blue', 'Green'])

      enhanceOptionsFilter(container)

      const input = /** @type {HTMLInputElement} */ (
        container.querySelector('.app-options-filter__input')
      )
      const status = /** @type {HTMLElement} */ (
        container.querySelector('[role="status"]')
      )

      input.value = 'bl'
      input.dispatchEvent(new InputEvent('input', { bubbles: true }))
      expect(status).toHaveTextContent('Showing 1 of 3 values')

      input.value = 'zzz'
      input.dispatchEvent(new InputEvent('input', { bubbles: true }))
      expect(status).toHaveTextContent('No matching values')
    })

    it('shows a hidden-items notice with the count only while items are hidden', () => {
      const container = renderContainer(['Red', 'Blue', 'Green', 'Yellow'])

      enhanceOptionsFilter(container)

      const input = /** @type {HTMLInputElement} */ (
        container.querySelector('.app-options-filter__input')
      )
      const notice = /** @type {HTMLElement} */ (
        container.querySelector('.app-options-filter__hidden-notice')
      )

      // Nothing hidden initially
      expect(notice).toHaveAttribute('hidden')

      // Filtering to a single match hides the other three
      input.value = 'red'
      input.dispatchEvent(new InputEvent('input', { bubbles: true }))
      expect(notice).not.toHaveAttribute('hidden')
      expect(notice).toHaveTextContent('3 items hidden. Show all')

      // Clearing shows everything again and hides the notice
      input.value = ''
      input.dispatchEvent(new InputEvent('input', { bubbles: true }))
      expect(notice).toHaveAttribute('hidden')
    })

    it('renders the hidden-items notice below the last visible option', () => {
      const container = renderContainer(['Red', 'Blue', 'Green', 'Yellow'])

      enhanceOptionsFilter(container)

      const checkboxes = /** @type {HTMLElement} */ (
        container.querySelector('.govuk-checkboxes')
      )
      const notice = /** @type {HTMLElement} */ (
        container.querySelector('.app-options-filter__hidden-notice')
      )

      // The notice is the last child of the options list
      expect(checkboxes.lastElementChild).toBe(notice)
    })

    it('clears the filter when the "Show all" link is clicked', () => {
      const container = renderContainer(['Red', 'Blue', 'Green', 'Yellow'])

      enhanceOptionsFilter(container)

      const input = /** @type {HTMLInputElement} */ (
        container.querySelector('.app-options-filter__input')
      )
      const showAll = /** @type {HTMLButtonElement} */ (
        container.querySelector('.app-options-filter__show-all')
      )

      // It is a button (action), styled as a link
      expect(showAll.type).toBe('button')
      expect(showAll).toHaveClass('govuk-link')

      input.value = 'red'
      input.dispatchEvent(new InputEvent('input', { bubbles: true }))
      expect(getVisibleLabels(container)).toEqual(['Red'])

      showAll.click()

      expect(input.value).toBe('')
      expect(getVisibleLabels(container)).toEqual([
        'Red',
        'Blue',
        'Green',
        'Yellow'
      ])
      expect(document.activeElement).toBe(input)
    })

    it('does not enhance the same container twice', () => {
      const container = renderContainer(['Red', 'Blue', 'Green'])

      enhanceOptionsFilter(container)
      enhanceOptionsFilter(container)

      expect(container.querySelectorAll('.app-options-filter')).toHaveLength(1)
    })

    it('ignores containers without checkboxes', () => {
      const container = document.createElement('div')
      container.setAttribute('data-module', 'app-options-filter')
      container.innerHTML =
        '<fieldset class="govuk-fieldset"><legend class="govuk-fieldset__legend">Select a value</legend></fieldset>'
      document.body.appendChild(container)

      expect(() => {
        enhanceOptionsFilter(container)
      }).not.toThrow()
      expect(container.querySelector('.app-options-filter')).toBeNull()
    })
  })

  describe('initConditionOptionsFilters', () => {
    it('enhances every options-filter container on the page', () => {
      renderContainer(['Red', 'Blue', 'Green'])
      renderContainer(['One', 'Two', 'Three'])

      initConditionOptionsFilters()

      expect(document.querySelectorAll('.app-options-filter')).toHaveLength(2)
    })

    it('is a no-op when no containers are present', () => {
      expect(() => {
        initConditionOptionsFilters()
      }).not.toThrow()
      expect(document.querySelector('.app-options-filter')).toBeNull()
    })
  })
})
