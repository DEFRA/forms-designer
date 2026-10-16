const FILTER_LABEL = 'Filter values'
const ENHANCED_FLAG = 'optionsFilterEnhanced'

let uniqueIdCounter = 0

/**
 * Generates a DOM-unique id with the given prefix.
 * @param {string} prefix
 * @returns {string}
 */
function generateUniqueId(prefix) {
  uniqueIdCounter += 1
  return `${prefix}-${uniqueIdCounter}`
}

/**
 * Builds the screen-reader status message describing how many options are shown.
 * @param {number} visible - number of options currently shown
 * @param {number} total - total number of options
 * @param {string} query - the current (trimmed) filter text
 * @returns {string}
 */
export function buildStatusText(visible, total, query) {
  if (query === '') {
    return `Showing all ${total} values`
  }

  if (visible === 0) {
    return 'No matching values'
  }

  return `Showing ${visible} of ${total} values`
}

/**
 * Builds the full text of the single "items hidden" link.
 * @param {number} hidden - number of options currently hidden by the filter
 * @returns {string}
 */
export function buildHiddenNoticeText(hidden) {
  const formatted = hidden.toLocaleString('en-GB')
  const noun = hidden === 1 ? 'item' : 'items'
  return `${formatted} ${noun} hidden. Show all`
}

/**
 * @typedef {object} FilterTargets
 * @property {HTMLElement} legend - the fieldset legend the filter sits below
 * @property {HTMLElement} checkboxes - the options container being filtered
 * @property {HTMLElement[]} items - the individual checkbox option elements
 */

/**
 * Finds and validates the elements the filter needs within a container.
 * Returns `null` when the container is missing the expected markup or has no
 * options to filter, in which case it should be left unenhanced.
 * @param {HTMLElement} container
 * @returns {FilterTargets | null}
 */
function resolveFilterTargets(container) {
  const legend = container.querySelector('.govuk-fieldset__legend')
  const checkboxes = container.querySelector('.govuk-checkboxes')

  if (
    !(legend instanceof HTMLElement) ||
    !(checkboxes instanceof HTMLElement)
  ) {
    return null
  }

  const items = /** @type {HTMLElement[]} */ (
    Array.from(checkboxes.querySelectorAll('.govuk-checkboxes__item'))
  )

  if (!items.length) {
    return null
  }

  // Ensure the options container can be referenced via aria-controls.
  if (!checkboxes.id) {
    checkboxes.id = generateUniqueId('condition-options')
  }

  return { legend, checkboxes, items }
}

/**
 * @typedef {object} FilterControls
 * @property {HTMLElement} group - the form group wrapping the filter controls
 * @property {HTMLInputElement} input - the filter text input
 * @property {HTMLButtonElement} clear - the Clear filter button
 * @property {HTMLElement} status - the live status region
 */

/**
 * Builds the filter control group (label, input, Clear button and live status
 * region) that is inserted directly below the legend.
 * @param {HTMLElement} checkboxes - the options container being filtered
 * @param {string} inputId
 * @param {string} statusId
 * @returns {FilterControls}
 */
function buildFilterControls(checkboxes, inputId, statusId) {
  const group = document.createElement('div')
  group.className = 'govuk-form-group app-options-filter'

  const label = document.createElement('label')
  label.className = 'govuk-label app-options-filter__label'
  label.setAttribute('for', inputId)
  label.textContent = FILTER_LABEL

  const row = document.createElement('div')
  row.className = 'app-options-filter__row'

  const input = document.createElement('input')
  input.className = 'govuk-input app-options-filter__input'
  input.id = inputId
  // No `name` attribute: the filter is client-side only and must not be
  // submitted with the form.
  input.type = 'text'
  input.setAttribute('autocomplete', 'off')
  input.setAttribute('spellcheck', 'false')
  input.setAttribute('aria-controls', checkboxes.id)
  input.setAttribute('aria-describedby', statusId)

  const clear = document.createElement('button')
  clear.type = 'button'
  clear.className =
    'govuk-button govuk-button--secondary app-options-filter__clear'
  clear.dataset.module = 'govuk-button'
  clear.textContent = 'Clear filter'

  const status = document.createElement('div')
  status.id = statusId
  status.className = 'govuk-visually-hidden'
  status.setAttribute('role', 'status')
  status.setAttribute('aria-live', 'polite')

  row.append(input, clear)
  group.append(label, row, status)

  return { group, input, clear, status }
}

/**
 * @typedef {object} HiddenNotice
 * @property {HTMLElement} notice - the wrapper shown while options are hidden
 * @property {HTMLButtonElement} showAll - the "Show all" link/button
 */

/**
 * Builds the "N items hidden. Show all" notice, shown below the last visible
 * option whenever the filter is hiding one or more options. The whole entry is
 * a single link that clears the filter when clicked.
 * @returns {HiddenNotice}
 */
function buildHiddenNotice() {
  const notice = document.createElement('p')
  notice.className = 'govuk-body app-options-filter__hidden-notice'
  notice.hidden = true

  const showAll = document.createElement('button')
  showAll.type = 'button'
  // Reuses the existing `.govuk-link[type="button"]` styling so it reads as a
  // link rather than a button.
  showAll.className = 'govuk-link app-options-filter__show-all'

  notice.append(showAll)

  return { notice, showAll }
}

/**
 * Creates the function that applies the current filter text to the options,
 * toggling each option's visibility and updating the status and hidden notice.
 * @param {object} parts
 * @param {HTMLElement[]} parts.items - the checkbox option elements
 * @param {HTMLInputElement} parts.input - the filter text input
 * @param {HTMLElement} parts.status - the live status region
 * @param {HTMLElement} parts.notice - the hidden-items notice wrapper
 * @param {HTMLButtonElement} parts.showAll - the "Show all" link/button
 * @returns {() => void}
 */
function createApplyFilter({ items, input, status, notice, showAll }) {
  return function applyFilter() {
    const query = input.value.trim().toLowerCase()
    let visible = 0

    for (const item of items) {
      const itemLabel = item.querySelector('.govuk-checkboxes__label')
      const text = (itemLabel?.textContent ?? '').trim().toLowerCase()
      const match = query === '' || text.includes(query)

      // Hide (rather than remove) non-matching options so their checked state
      // and form value are retained while they're filtered out.
      item.toggleAttribute('hidden', !match)

      if (match) {
        visible += 1
      }
    }

    const hidden = items.length - visible
    if (hidden > 0) {
      showAll.textContent = buildHiddenNoticeText(hidden)
      notice.hidden = false
    } else {
      notice.hidden = true
    }

    status.textContent = buildStatusText(visible, items.length, query)
  }
}

/**
 * Progressively enhances a single options-filter container by inserting an
 * accessible filter box (with a Clear button) directly below the legend and
 * above the answer options.
 * @param {HTMLElement} container
 */
export function enhanceOptionsFilter(container) {
  // Avoid enhancing the same container twice (e.g. if init runs again).
  if (container.dataset[ENHANCED_FLAG] === 'true') {
    return
  }

  const targets = resolveFilterTargets(container)
  if (!targets) {
    return
  }

  const { legend, checkboxes, items } = targets
  const inputId = `${checkboxes.id}-filter`
  const statusId = `${checkboxes.id}-filter-status`

  const { group, input, clear, status } = buildFilterControls(
    checkboxes,
    inputId,
    statusId
  )

  // Insert directly below the "Select a value" legend, above the options.
  legend.after(group)

  const { notice, showAll } = buildHiddenNotice()
  checkboxes.append(notice)

  const applyFilter = createApplyFilter({
    items,
    input,
    status,
    notice,
    showAll
  })

  const resetFilter = () => {
    input.value = ''
    applyFilter()
    input.focus()
  }

  input.addEventListener('input', applyFilter)
  clear.addEventListener('click', resetFilter)
  showAll.addEventListener('click', resetFilter)

  container.dataset[ENHANCED_FLAG] = 'true'
}

/**
 * Finds every options-filter container in the given root and enhances it.
 * @param {ParentNode} [root]
 */
export function initConditionOptionsFilters(root = document) {
  const containers = root.querySelectorAll('[data-module="app-options-filter"]')

  for (const container of Array.from(containers)) {
    if (container instanceof HTMLElement) {
      enhanceOptionsFilter(container)
    }
  }
}
