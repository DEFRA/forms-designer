import {
  FormStatus,
  LIST_ITEM_HINT,
  LIST_ITEM_WITH_HINT_FOLLOWING,
  TEXTAREA_12_ROWS_WITH_MARKDOWN,
  TEXTAREA_5_ROWS,
  TranslationRowTypes,
  buildTranslationDataRows,
  isConditionWrapperV2
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { buildPreviewUrl } from '~/src/models/forms/editor-v2/preview-helpers.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * @param {string} key
 * @param { ValidationFailure<any> | undefined } validation
 */
function fieldHasError(key, validation) {
  if (!validation?.formErrors) {
    return false
  }

  return !!validation.formErrors[key]
}

/**
 * @param {string} title
 * @param {TranslationRow} row
 * @param { ValidationFailure<any> | undefined } validation
 * @param {string} [type]
 */
function mapRowData(title, row, validation, type) {
  return {
    title,
    row,
    error: fieldHasError(row.name, validation),
    type
  }
}

const overviewRowNumbers = {
  FormName: 0,
  SupportEmail: 1,
  SupportResponse: 2,
  ContactLink: 3,
  ContactText: 4,
  Phone: 5,
  WhatNext: 6,
  PrivacyNotice: 7
}

/**
 * @param {TranslationRow[]} rows
 * @param { ValidationFailure<any> | undefined } validation
 */
function mapOverviewRowsToViewModel(rows, validation) {
  const overview = []

  overview.push(
    {
      caption: 'Form name',
      rowData: [
        mapRowData('Form name', rows[overviewRowNumbers.FormName], validation)
      ]
    },
    {
      caption: 'Contact details for support',
      caption2: 'Email address and response time',
      rowData: [
        mapRowData(
          'Email address',
          rows[overviewRowNumbers.SupportEmail],
          validation
        ),
        mapRowData(
          'Response time',
          rows[overviewRowNumbers.SupportResponse],
          validation
        )
      ]
    },
    {
      caption: 'Contact link for support',
      rowData: [
        mapRowData(
          'Contact link',
          rows[overviewRowNumbers.ContactLink],
          validation
        ),
        mapRowData(
          'Contact text',
          rows[overviewRowNumbers.ContactText],
          validation
        )
      ]
    },
    {
      caption: 'Phone number and opening times',
      rowData: [
        mapRowData(
          'Phone number and opening times',
          rows[overviewRowNumbers.Phone],
          validation,
          TEXTAREA_5_ROWS
        )
      ]
    },
    {
      caption: 'Information about what happens next',
      rowData: [
        mapRowData(
          'What happens next',
          rows[overviewRowNumbers.WhatNext],
          validation,
          TEXTAREA_12_ROWS_WITH_MARKDOWN
        )
      ]
    }
  )

  if (
    rows[overviewRowNumbers.PrivacyNotice].name === 'form.privacyNoticeText'
  ) {
    overview.push({
      caption: 'Privacy information for this form (uses inline content)',
      rowData: [
        mapRowData(
          'Privacy notice text',
          rows[overviewRowNumbers.PrivacyNotice],
          validation,
          TEXTAREA_12_ROWS_WITH_MARKDOWN
        )
      ]
    })
  } else {
    overview.push({
      caption: 'Privacy information for this form',
      subHeading: 'This form uses a link to a privacy notice.',
      rowData: [
        mapRowData(
          'Privacy notice link',
          rows[overviewRowNumbers.PrivacyNotice],
          validation
        )
      ]
    })
  }

  return overview
}

/**
 * @param {TranslationRow[]} rows
 */
function mapFormRowsToViewModel(rows) {
  const formRows = []

  const uniquePageNums = new Set(rows.map((row) => row.pageNum))

  for (const pageNum of uniquePageNums.values()) {
    formRows.push({
      caption: `Page ${pageNum}`
    })

    const pageRows = rows.filter((row) => row.pageNum === pageNum)

    const pageHeading = pageRows.find(
      (row) => row.type === TranslationRowTypes.PageHeading
    )
    const pageGuidance = pageRows.find(
      (row) => row.type === TranslationRowTypes.PageGuidance
    )
    const pageHeadingRow = pageHeading
      ? [
          {
            title: 'Page heading',
            row: pageHeading
          }
        ]
      : []
    const pageGuidanceRow = pageGuidance
      ? [
          {
            title: 'Page guidance',
            row: pageGuidance
          }
        ]
      : []

    if (pageHeadingRow.length || pageGuidanceRow.length) {
      formRows.push({
        rowData: [...pageHeadingRow, ...pageGuidanceRow]
      })
    }

    const uniqueQuestionNums = new Set(
      pageRows.map((row) => row.questionNum).filter((row) => row)
    )
    for (const questionNum of uniqueQuestionNums.values()) {
      const questionRows = pageRows.filter(
        (row) => row.questionNum === questionNum
      )

      const questionText = questionRows.find(
        (row) => row.type === TranslationRowTypes.QuestionText
      )
      const questionHint = questionRows.find(
        (row) => row.type === TranslationRowTypes.QuestionHint
      )
      const shortDescription = questionRows.find(
        (row) => row.type === TranslationRowTypes.ShortDescription
      )

      const questionTextRow = questionText
        ? [
            {
              title: 'Question text',
              row: questionText
            }
          ]
        : []
      const questionHintRow = questionHint
        ? [
            {
              title: 'Hint',
              row: questionHint
            }
          ]
        : []
      const shortDescriptionRow = shortDescription
        ? [
            {
              title: 'Short description',
              row: shortDescription
            }
          ]
        : []

      if (
        questionTextRow.length ||
        questionHintRow.length ||
        shortDescriptionRow.length
      ) {
        formRows.push(
          {
            caption: `Page ${pageNum}, question ${questionNum}`,
            captionClasses: 'govuk-heading-s'
          },
          {
            rowData: [
              ...questionTextRow,
              ...questionHintRow,
              ...shortDescriptionRow
            ]
          }
        )
      }

      const listItems = questionRows.filter(
        (row) => row.type === TranslationRowTypes.ListItemText
      )
      const listItemHints = questionRows.filter(
        (row) => row.type === TranslationRowTypes.ListItemHint
      )
      if (listItems.length === 0) {
        continue
      }

      const optionRows = []
      for (const item of listItems) {
        const hint = listItemHints.find((ht) => ht.itemNum === item.itemNum)
        optionRows.push({
          title: `Option ${item.itemNum}`,
          row: item,
          type: hint ? LIST_ITEM_WITH_HINT_FOLLOWING : undefined
        })

        if (hint) {
          optionRows.push({
            title: '',
            row: hint,
            type: LIST_ITEM_HINT
          })
        }
      }

      formRows.push({
        rowData: optionRows
      })
    }
  }

  return formRows
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ValidationFailure<any>} [validation]
 * @param {string[]} [notification]
 */
export function translationsViewModel(
  metadata,
  definition,
  validation,
  notification
) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )
  const previewBaseUrl = `${buildPreviewUrl(metadata.slug, FormStatus.Draft)}?language=cy`
  const pageHeading = 'Add Welsh translations for your form'
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`
  const errorList = buildErrorList(validation?.formErrors)
  const errorSummary = errorList

  const rows = buildTranslationDataRows(metadata, definition, validation)

  const overviewRows = mapOverviewRowsToViewModel(rows.overviewRows, validation)
  const formRows = mapFormRowsToViewModel(rows.formRows)

  const formHasConditions = definition.conditions.some(isConditionWrapperV2)
  const conditionsManagerUrl = editorv2Path(metadata.slug, 'conditions')

  return {
    ...baseModelFields(metadata.slug, pageTitle, pageHeading),
    formSlug: metadata.slug,
    previewBaseUrl,
    navigation,
    pageCaption: {
      text: pageCaption
    },
    errorList: errorSummary,
    notification,
    rowViewModel: {
      overviewRows,
      formRows
    },
    formHasConditions,
    conditionsManagerUrl
  }
}

/**
 * Model to represent confirmation page dialog
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function deleteConfirmationPageViewModel(metadata, definition) {
  const backOrCancelUrl = editorv2Path(metadata.slug, 'welsh')
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  return {
    navigation,
    backLink: {
      href: backOrCancelUrl,
      text: 'Back to Welsh translations'
    },
    useNewMasthead: true,
    pageHeading: {
      text: 'Are you sure you want to delete your Welsh translations?'
    },
    pageCaption: {
      text: definition.name
    },
    warning: {
      text: 'You cannot undo this action. You would need to enter Welsh translations again if you change your mind.'
    },
    bodyText:
      '<p class="govuk-body">This will delete all Welsh translations you have entered for this form.</p><p class="govuk-body">Your English form is not deleted.</p><p class="govuk-body">&nbsp;</p>',
    buttons: [
      {
        text: 'Delete Welsh translations',
        classes: 'govuk-button--warning'
      },
      {
        href: backOrCancelUrl,
        text: 'Cancel',
        classes: 'govuk-button--secondary'
      }
    ]
  }
}

/**
 * @import { FormMetadata, FormDefinition, TranslationRow } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
