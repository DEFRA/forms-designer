import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  BACK_TO_MANAGE_CONDITIONS,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { buildConditionEditor } from '~/src/models/forms/editor-v2/condition-helper.js'
import { editorFormPath, formOverviewPath } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ConditionSessionState} state
 * @param {string[]} [notification]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function conditionViewModel(
  metadata,
  definition,
  state,
  notification,
  validation
) {
  const conditionEditorModel = buildConditionEditor(
    definition,
    validation,
    state
  )
  const formSlug = metadata.slug
  const formPath = formOverviewPath(formSlug)
  const navigation = getFormSpecificNavigation(formPath, metadata, definition)
  const pageHeading = conditionEditorModel.originalCondition.name
    ? `Edit condition "${conditionEditorModel.originalCondition.name}"`
    : 'Create new condition'
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`
  const { formErrors } = validation ?? {}

  return {
    backLink: {
      href: editorFormPath(metadata.slug, 'conditions'),
      text: BACK_TO_MANAGE_CONDITIONS
    },
    pageTitle,
    pageHeading: {
      text: pageHeading,
      size: 'large'
    },
    useNewMasthead: true,
    formSlug,
    navigation,
    pageCaption: {
      text: pageCaption
    },
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    notification,
    conditionEditor: {
      ...conditionEditorModel,
      allowComplexConditions: true
    }
  }
}

/**
 * @import { ConditionSessionState, FormMetadata, FormDefinition, FormEditor } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
