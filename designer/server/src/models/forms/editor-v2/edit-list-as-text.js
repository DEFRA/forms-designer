import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  insertValidationErrors,
  mapListToTextareaStr
} from '~/src/lib/utils.js'
import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * Model to represent confirmation page dialog for a given form.
 * @param { QuestionSessionState | undefined } state
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {string} stateId
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function editListAsTextViewModel(
  state,
  metadata,
  definition,
  pageId,
  questionId,
  stateId,
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
    value: mapListToTextareaStr(state?.listItems),
    ...insertValidationErrors(validation?.formErrors.listAsText)
  }

  return {
    backLink: {
      href: editorv2Path(
        metadata.slug,
        `page/${pageId}/question/${questionId}/details/${stateId}`
      ),
      text: 'Back to edit question'
    },
    pageTitle: metadata.title,
    useNewMasthead: true,
    navigation,
    pageHeading: {
      text: metadata.title,
      size: 'large'
    },
    listAsText,
    errorList: buildErrorList(validation?.formErrors)
  }
}

/**
 * @import { FormDefinition, FormEditor, FormMetadata, List, QuestionSessionState } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
