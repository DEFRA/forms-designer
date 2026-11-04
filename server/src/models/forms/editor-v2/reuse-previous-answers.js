import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors, isAllowCopyEnabled } from '~/src/lib/utils.js'
import {
  SAVE_AND_CONTINUE,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { BACK_TO_ADVANCED_SETTINGS } from '~/src/models/forms/editor-v2/email-actions.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

export const REUSE_PREVIOUS_ANSWERS_HEADING =
  'Can people reuse answers from a previous submission?'

/**
 * The yes/no radios for the reuse previous answers page.
 * The page heading is shown in the masthead, so the legend is visually hidden.
 * @param {boolean} reusePreviousAnswers
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function reusePreviousAnswersFields(reusePreviousAnswers, validation) {
  return {
    reusePreviousAnswers: {
      name: 'reusePreviousAnswers',
      idPrefix: 'reusePreviousAnswers',
      classes: 'govuk-radios--inline',
      fieldset: {
        legend: {
          text: REUSE_PREVIOUS_ANSWERS_HEADING,
          classes: 'govuk-visually-hidden'
        }
      },
      hint: {
        text: 'Use when people often submit this form more than once with similar answers.'
      },
      value: reusePreviousAnswers ? 'true' : 'false',
      items: [
        { text: 'Yes', value: 'true' },
        { text: 'No', value: 'false' }
      ],
      ...insertValidationErrors(validation?.formErrors.reusePreviousAnswers)
    }
  }
}

/**
 * View model for the reuse previous answers advanced setting page
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function reusePreviousAnswersViewModel(
  metadata,
  definition,
  validation
) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  const pageHeading = REUSE_PREVIOUS_ANSWERS_HEADING
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`

  const reusePreviousAnswers = isAllowCopyEnabled(definition)

  return {
    backLink: {
      href: editorv2Path(metadata.slug, 'advanced-settings'),
      text: BACK_TO_ADVANCED_SETTINGS
    },
    navigation,
    pageTitle,
    pageHeading: {
      text: pageHeading,
      size: 'large'
    },
    pageCaption: {
      text: pageCaption
    },
    useNewMasthead: true,
    errorList: buildErrorList(validation?.formErrors),
    fields: reusePreviousAnswersFields(reusePreviousAnswers, validation),
    buttonText: SAVE_AND_CONTINUE
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
