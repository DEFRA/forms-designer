import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  insertValidationErrors,
  mapListToTextareaStr
} from '~/src/lib/utils.js'
import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * Model to represent confirmation page dialog for a given form.
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param { ListItem[] } listItems
 * @param {{ backText: string, backUrl: string }} backLink
 * @param {boolean} showTitle
 * @param { string | undefined } listTitleValue
 * @param {string[]} [notification]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function editListAsTextViewModel(
  metadata,
  definition,
  listItems,
  backLink,
  showTitle,
  listTitleValue,
  notification,
  validation
) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  const listAsText = {
    name: 'listAsText',
    id: 'listAsText',
    label: {
      text: 'Add each option on a new line',
      classes: 'govuk-label--s'
    },
    hint: {
      text: 'To optionally set an input value for each item, separate the option text and value with a colon (e.g English:en-gb). For hint text, add the hint text after a further colon (e.g. English:en-gb:This is my hint text)'
    },
    rows: 15,
    value: mapListToTextareaStr(listItems),
    ...insertValidationErrors(validation?.formErrors.listAsText)
  }

  const listTitle = {
    name: 'listTitle',
    id: 'listTitle',
    label: {
      text: 'List title',
      classes: 'govuk-label--s'
    },
    hint: {
      text: 'For easily identifying the list in the list management screens'
    },
    value: listTitleValue,
    ...insertValidationErrors(validation?.formErrors.listTitle)
  }

  return {
    backLink: {
      href: editorv2Path(metadata.slug, backLink.backUrl),
      text: backLink.backText
    },
    pageTitle: metadata.title,
    useNewMasthead: true,
    navigation,
    pageHeading: {
      text: metadata.title,
      size: 'large'
    },
    listAsText,
    errorList: buildErrorList(validation?.formErrors),
    notification,
    showTitle,
    listTitle
  }
}

/**
 * @import { FormDefinition, FormEditor, FormMetadata, ListItem } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
