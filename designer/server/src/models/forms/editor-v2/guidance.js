import { ComponentType, hasComponents } from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors } from '~/src/lib/utils.js'
import {
  GOVUK_LABEL__M,
  SAVE,
  baseModelFields,
  getFormSpecificNavigation,
  getPageNum
} from '~/src/models/forms/editor-v2/common.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * @param {string | undefined} pageHeadingVal
 * @param {string | undefined} guidanceTextVal
 * @param {ValidationFailure<FormEditor>} [validation]
 */
function guidanceFields(pageHeadingVal, guidanceTextVal, validation) {
  return {
    pageHeading: {
      name: 'pageHeading',
      id: 'pageHeading',
      label: {
        text: 'Page heading',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: "This should be a statement, not a question. For example, 'Passport information'"
      },
      value: pageHeadingVal,
      ...insertValidationErrors(validation?.formErrors.pageHeading)
    },
    guidanceText: {
      name: 'guidanceText',
      id: 'guidanceText',
      label: {
        text: 'Guidance text',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'You can use Markdown if you want to format the content or add links'
      },
      rows: 3,
      value: guidanceTextVal,
      ...insertValidationErrors(validation?.formErrors.guidanceText)
    }
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {ValidationFailure<FormEditor>} [validation]
 * @param {string[]} [notification]
 */
export function guidanceViewModel(
  metadata,
  definition,
  pageId,
  validation,
  notification
) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formValues, formErrors } = validation ?? {}

  const pageNum = getPageNum(definition, pageId)

  const pageIdx = definition.pages.findIndex((x) => x.id === pageId)
  const page = /** @type { Page | undefined } */ (definition.pages[pageIdx])
  const components = hasComponents(page) ? page.components : []

  const pageHeadingVal = formValues?.pageHeading ?? page?.title

  const guidanceComponent = /** @type { MarkdownComponent | undefined } */ (
    components.find((comp, idx) => {
      return comp.type === ComponentType.Markdown && idx === 0
    })
  )

  const guidanceTextVal = formValues?.guidanceText ?? guidanceComponent?.content

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    fields: { ...guidanceFields(pageHeadingVal, guidanceTextVal, validation) },
    cardTitle: `Page settings`,
    cardCaption: `Page ${pageNum}`,
    cardHeading: 'Edit guidance page',
    navigation,
    errorList: buildErrorList(formErrors, ['pageHeading', 'guidanceText']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    buttonText: SAVE,
    notification
  }
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor, MarkdownComponent, Page } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
