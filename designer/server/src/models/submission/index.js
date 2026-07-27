import { FormComponent } from '@defra/forms-engine-plugin/engine/components/FormComponent.js'
import { FormModel } from '@defra/forms-engine-plugin/engine/models/FormModel.js'
import {
  ComponentType,
  hasComponentsEvenIfNoNext,
  hasRepeater,
  replaceCustomControllers
} from '@defra/forms-model'

import { format } from '~/src/models/forms/history-date-utils.js'

/**
 * @param {FormAdapterSubmissionMessagePayload} submission - the form submission record
 * @param {FormDefinition} definition - the form definition
 */
export function submissionViewModel(submission, definition) {
  const { data, meta } = submission
  const { referenceNumber } = meta
  const fixedDefinition = replaceCustomControllers(definition)
  const formModel = new FormModel(fixedDefinition, { basePath: '' })
  const translator = formModel.createTranslator()
  const pageTitle = `Form submission: ${referenceNumber}`
  const pageHeading = referenceNumber
  const caption = formModel.name
  const { pages, sections } = definition

  /**
   * @type { { section: string | undefined, rows: SummaryRows }[] }
   */
  const summaries = []

  ;[...sections, undefined].forEach(processSection)

  const lede = `Submitted on ${format(meta.timestamp, "dd MMMM yyyy 'at' h:mm")}`

  /**
   * Process a page component
   * @param {ComponentDef} component
   * @param {Page} page
   * @param {{ item: Record<string, any>, index: number}} [repeat]
   */
  function processSectionComponent(component, page, repeat) {
    let value = ''
    let actions

    const field = formModel.componentMap.get(component.name)

    if (field instanceof FormComponent) {
      if (component.type === ComponentType.FileUploadField) {
        if (component.name in data.files) {
          const files = /** @type {any} */ (data.files[component.name])
          if (Array.isArray(files) && files.length) {
            value = field.getDisplayStringFromFormValue(
              /** @type {any} */ (files),
              translator
            )
            actions = [
              {
                href: `/files-download/${referenceNumber}`,
                text: 'Download files',
                visuallyHiddenText: 'Download files'
              }
            ]

            return {
              key: { text: component.title },
              value: { text: value },
              actions: { items: actions }
            }
          }
        }
      } else {
        const source = repeat?.item ?? data.main

        if (component.name in source) {
          value = field.getDisplayStringFromFormValue(
            /** @type {any} */ (source[component.name]),
            translator
          )

          if (component.type === ComponentType.GeospatialField) {
            actions = [
              {
                text: 'Review map',
                href: `/submission/${referenceNumber}/map-review/${page.id}/${component.id}${repeat ? '#answer_' + repeat.index.toString() : ''}`,
                visuallyHiddenText: 'Review map'
              }
            ]
          }

          return {
            key: { text: component.title },
            value: { text: value },
            actions: actions ? { items: actions } : undefined
          }
        }
      }
    }

    return undefined
  }

  /**
   * Process a section page
   * @param {Page} page
   * @returns {SummaryRows}
   */
  function processSectionPage(page) {
    if (!hasComponentsEvenIfNoNext(page)) {
      return []
    }

    if (hasRepeater(page)) {
      const { name, title } = page.repeat.options
      const items = data.repeaters[name] ?? []

      /** @type {SummaryRowKey} */
      const key = { text: title }

      /** @type {SummaryRowRepeaterValue} */
      const value = {
        repeatTitle: title,
        rows: items.map((item, index) =>
          page.components
            .map((c) => processSectionComponent(c, page, { item, index }))
            .filter((v) => v !== undefined)
        )
      }

      return [{ key, value }]
    }

    const components = page.components
      .map((c) => processSectionComponent(c, page))
      .filter((v) => v !== undefined)

    return components
  }

  /**
   * Process form section
   * @param {Section | undefined} section
   */
  function processSection(section) {
    const sectionPages = pages.filter(
      (page) => page.section === (section ? section.id : undefined)
    )

    /** @type {SummaryRows} */
    const rows = sectionPages.flatMap(processSectionPage)

    if (rows.length) {
      summaries.push({
        section: section?.title,
        rows
      })
    }
  }

  return {
    pageTitle,
    caption,
    pageHeading,
    lede,
    summaries
  }
}

/**
 * @typedef {{ text: string }} SummaryRowKey
 * @typedef {{ text: string }} SummaryRowTextValue
 * @typedef {{ repeatTitle: string, rows: SummaryRow[][] }} SummaryRowRepeaterValue
 * @typedef {{ items: { href: string, text: string, visuallyHiddenText: string }[]}} SummaryRowActions
 * @typedef {{ key: SummaryRowKey, value: SummaryRowTextValue | SummaryRowRepeaterValue, actions?: SummaryRowActions | undefined}} SummaryRow
 * @typedef {SummaryRow[]} SummaryRows
 */

/**
 * @import { FormDefinition, Section, Page, ComponentDef } from '@defra/forms-model'
 * @import { FormAdapterSubmissionMessagePayload } from '@defra/forms-engine-plugin/engine/types.js'
 */
