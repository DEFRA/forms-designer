import { ComponentType } from '@defra/forms-model'

import {
  QUESTION_TYPE_DATE_GROUP,
  QUESTION_TYPE_LIST_GROUP,
  QUESTION_TYPE_WRITTEN_ANSWER_GROUP
} from '~/src/common/constants/editor.js'
import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors } from '~/src/lib/utils.js'
import {
  SAVE_AND_CONTINUE,
  baseModelFields,
  getFormSpecificNavigation,
  getPageNum,
  getQuestionNum,
  getQuestionsOnPage
} from '~/src/models/forms/editor-v2/common.js'
import { formOverviewPath } from '~/src/models/links.js'

const questionTypeRadioItems = /** @type {FormEditorCheckbox[]} */ ([
  {
    text: 'Written answer',
    hint: {
      text: 'A short or long answer as test or number'
    },
    value: QUESTION_TYPE_WRITTEN_ANSWER_GROUP
  },
  {
    text: 'Date',
    hint: {
      text: 'A day, month and year or month and year only'
    },
    value: QUESTION_TYPE_DATE_GROUP
  },
  {
    text: 'UK address',
    hint: {
      text: 'A street address, town or city and postcode'
    },
    value: ComponentType.UkAddressField
  },
  {
    text: 'Phone number',
    hint: {
      text: 'A UK phone number, for example, 07700 900 982 or +44 808 157 0192'
    },
    value: ComponentType.TelephoneNumberField
  },
  {
    text: 'Supporting evidence',
    hint: {
      text: 'A document, for example, DOC, PDF, CSV, Excel'
    },
    value: ComponentType.FileUploadField
  },
  {
    text: 'Email address',
    hint: {
      text: 'An email address, for example, name@example.com'
    },
    value: ComponentType.EmailAddressField
  },
  {
    divider: 'or'
  },
  {
    text: 'A list of options that users can choose from',
    value: QUESTION_TYPE_LIST_GROUP
  }
])

const writtenAnswerSubItems = [
  {
    text: 'Short answer (a single line)',
    value: ComponentType.TextField
  },
  {
    text: 'Long answer (more than a single line)',
    value: ComponentType.MultilineTextField
  },
  { text: 'Numbers only', value: ComponentType.NumberField }
]

const dateSubItems = [
  { text: 'Day, month and year', value: ComponentType.DatePartsField },
  { text: 'Month and year', value: ComponentType.MonthYearField }
]

const listSubItems = [
  {
    text: 'Yes or No',
    hint: {
      text: 'Allow users to answer either ‘Yes’ or ‘No’'
    },
    value: ComponentType.YesNoField
  },
  {
    text: 'Checkboxes',
    hint: {
      text: 'A list for users to select multiple answers'
    },
    value: ComponentType.CheckboxesField
  },
  {
    text: 'Radios',
    hint: {
      text: 'A list for users to select one answer'
    },
    value: ComponentType.RadiosField
  },
  {
    text: 'Autocomplete',
    hint: {
      text: 'A list of options revealed to users as they type'
    },
    value: ComponentType.AutocompleteField
  }
]

/**
 * @param {FormEditorCheckbox[]} questionTypes
 * @param {ComponentDef[]} componentsSoFar
 */
export function filterQuestionTypes(questionTypes, componentsSoFar) {
  const hasFormComponent = componentsSoFar.some(
    (x) => x.type !== ComponentType.Markdown
  )
  const preventFileUpload =
    componentsSoFar.some((x) => x.type === ComponentType.FileUploadField) ||
    hasFormComponent
  return preventFileUpload
    ? questionTypes.filter((q) => q.value !== ComponentType.FileUploadField)
    : questionTypes
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function questionTypeViewModel(
  metadata,
  definition,
  pageId,
  questionId,
  validation
) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formValues, formErrors } = validation ?? {}

  const pageNum = getPageNum(definition, pageId)
  const questionNum = getQuestionNum(definition, pageId, questionId)

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    navigation,
    errorList: buildErrorList(formErrors, ['questionType']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    cardTitle: `Question ${questionNum}`,
    cardCaption: `Page ${pageNum}: question ${questionNum}`,
    fields: {
      questionType: {
        idPrefix: 'questionType',
        name: 'questionType',
        value: formValues?.questionType,
        items: filterQuestionTypes(
          questionTypeRadioItems,
          getQuestionsOnPage(definition, pageId)
        ),
        ...insertValidationErrors(validation?.formErrors.questionType)
      },
      writtenAnswerSub: {
        id: 'writtenAnswerSub',
        name: 'writtenAnswerSub',
        idPrefix: 'writtenAnswerSub',
        fieldset: {
          legend: {
            text: 'Type of written answer',
            isPageHeading: false
          }
        },
        items: writtenAnswerSubItems,
        value: formValues?.writtenAnswerSub,
        ...insertValidationErrors(validation?.formErrors.writtenAnswerSub)
      },
      dateSub: {
        id: 'dateSub',
        name: 'dateSub',
        idPrefix: 'dateSub',
        fieldset: {
          legend: {
            text: 'Type of date',
            isPageHeading: false
          }
        },
        items: dateSubItems,
        value: formValues?.dateSub,
        ...insertValidationErrors(validation?.formErrors.dateSub)
      },
      listSub: {
        id: 'listSub',
        name: 'listSub',
        idPrefix: 'listSub',
        fieldset: {
          legend: {
            text: 'Type of list',
            isPageHeading: false
          }
        },
        items: listSubItems,
        value: formValues?.listSub,
        ...insertValidationErrors(validation?.formErrors.listSub)
      }
    },
    buttonText: SAVE_AND_CONTINUE
  }
}

/**
 * @import { ComponentDef, FormEditorCheckbox, FormMetadata, FormDefinition, FormEditor } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
