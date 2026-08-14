import { FormComponent } from '@defra/forms-engine-plugin/engine/components/FormComponent.js'
import { FormModel } from '@defra/forms-engine-plugin/engine/models/FormModel.js'
import {
  ComponentType,
  hasComponentsEvenIfNoNext,
  hasRepeater,
  replaceCustomControllers
} from '@defra/forms-model'

import { formatCurrency } from '~/src/common/nunjucks/filters/index.js'
import { format } from '~/src/models/forms/history-date-utils.js'

/**
 * Process a file upload page component
 * @param {ComponentDef} component
 * @param {FormComponent} field
 * @param {Context} context
 */
function processFileUploadComponent(component, field, context) {
  const { submission, translator, referenceNumber } = context

  if (component.name in submission.data.files) {
    const files = submission.data.files[component.name]

    if (Array.isArray(files) && files.length) {
      const value = field.getDisplayStringFromFormValue(
        /** @type {any} */ (files),
        translator
      )
      const actions = [
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

  return undefined
}

/**
 * Process a payment field component
 * @param {Context} context
 */
function processPaymentFieldComponent(context) {
  const { submission } = context

  const payment = submission.data.payment
  if (payment) {
    const formattedAmount = formatCurrency(payment.amount)

    return {
      key: { text: payment.description },
      value: { text: formattedAmount }
    }
  }

  return undefined
}

/**
 * Process a page component
 * @param {ComponentDef} component
 */
export function isMapTypeComponent(component) {
  return (
    component.type === ComponentType.GeospatialField ||
    component.type === ComponentType.EastingNorthingField ||
    component.type === ComponentType.LatLongField ||
    component.type === ComponentType.OsGridRefField
  )
}

/**
 * Process a page component
 * @param {ComponentDef} component
 * @param {Page} page
 * @param {Context} context
 * @param {{ item: Record<string, any>, index: number}} [repeat]
 */
function processSectionComponent(component, page, context, repeat) {
  const { formModel, submission, translator, referenceNumber } = context
  const field = formModel.componentMap.get(component.name)

  if (!(field instanceof FormComponent)) {
    return undefined
  }

  if (component.type === ComponentType.FileUploadField) {
    return processFileUploadComponent(component, field, context)
  } else if (component.type === ComponentType.PaymentField) {
    return processPaymentFieldComponent(context)
  } else {
    const source = repeat?.item ?? submission.data.main

    if (component.name in source) {
      const value = field.getDisplayStringFromFormValue(
        /** @type {any} */ (source[component.name]),
        translator
      )

      let actions
      if (isMapTypeComponent(component)) {
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

  return undefined
}

/**
 * Process a section page
 * @param {Page} page
 * @param {Context} context
 * @returns {SummaryRows}
 */
function processSectionPage(page, context) {
  if (!hasComponentsEvenIfNoNext(page)) {
    return []
  }

  if (hasRepeater(page)) {
    const { name, title } = page.repeat.options
    const items = context.submission.data.repeaters[name] ?? []

    /** @type {SummaryRowKey} */
    const key = { text: title }

    /** @type {SummaryRowRepeaterValue} */
    const value = {
      repeatTitle: title,
      rows: items.map(
        /**
         * @param {any} item
         * @param {number} index
         */
        (item, index) =>
          page.components
            .map((c) =>
              processSectionComponent(c, page, context, { item, index })
            )
            .filter((v) => v !== undefined)
      )
    }

    return [{ key, value }]
  }

  const components = page.components
    .map((c) => processSectionComponent(c, page, context))
    .filter((v) => v !== undefined)

  return components
}

/**
 * Process form section
 * @param {Section | undefined} section
 * @param {Context} context
 */
function processSection(section, context) {
  const { summaries, pages } = context

  const sectionPages = pages.filter(
    (page) => page.section === (section ? section.id : undefined)
  )

  /** @type {SummaryRows} */
  const rows = sectionPages.flatMap((page) => processSectionPage(page, context))

  if (rows.length) {
    summaries.push({
      section: section?.title,
      rows
    })
  }
}

/**
 * @param {FormAdapterSubmissionMessagePayload} submission - the form submission record
 * @param {FormDefinition} definition - the form definition
 */
export function submissionViewModel(submission, definition) {
  const { meta } = submission
  const { referenceNumber } = meta
  const fixedDefinition = replaceCustomControllers(definition)
  const formModel = new FormModel(fixedDefinition, { basePath: '' })
  const translator = formModel.createTranslator()
  const pageTitle = `Form submission: ${referenceNumber}`
  const pageHeading = referenceNumber
  const caption = formModel.name
  const { pages, sections } = definition

  /**
   * @type {{ section: string | undefined, rows: SummaryRows }[]}
   */
  const summaries = []
  const context = {
    summaries,
    pages,
    translator,
    submission,
    formModel,
    referenceNumber
  }

  ;[...sections, undefined].forEach((section) =>
    processSection(section, context)
  )

  const formattedTimestamp = `Submitted on ${format(meta.timestamp, "dd MMMM yyyy 'at' h:mm")}`

  return {
    pageTitle,
    caption,
    pageHeading,
    formattedTimestamp,
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
 * @typedef {{ summaries: { section: string | undefined, rows: SummaryRows }[], pages: Page[], translator: any, submission: FormAdapterSubmissionMessagePayload, formModel: FormModel, referenceNumber: string }} Context
 */

/**
 * @import { FormDefinition, Section, Page, ComponentDef } from '@defra/forms-model'
 * @import { FormAdapterSubmissionMessagePayload } from '@defra/forms-engine-plugin/engine/types.js'
 */
