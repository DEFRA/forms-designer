import {
  ComponentType,
  ControllerType,
  QuestionTypeSubGroup,
  hasComponents,
  includesFileUploadField,
  isFormType
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import config from '~/src/config.js'
import {
  getPageFromDefinition,
  insertValidationErrors
} from '~/src/lib/utils.js'
import {
  SAVE_AND_CONTINUE,
  baseModelFields,
  getFormSpecificNavigation,
  getPageNum,
  getQuestionNum
} from '~/src/models/forms/editor-v2/common.js'
import { formOverviewPath } from '~/src/models/links.js'

const questionTypeRadioItems = /** @type {FormEditorCheckbox[]} */ ([
  {
    text: 'Written answer',
    hint: {
      text: 'A short or long answer as text or number'
    },
    value: QuestionTypeSubGroup.WrittenAnswerSubGroup
  },
  {
    text: 'Date',
    hint: {
      text: 'A day, month and year or month and year only'
    },
    value: QuestionTypeSubGroup.DateSubGroup
  },
  {
    text: 'Location',
    hint: {
      text: 'A UK address or precise location'
    },
    value: QuestionTypeSubGroup.LocationSubGroup
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
    text: 'Declaration',
    hint: {
      text: 'Ask users to formally agree to something'
    },
    value: ComponentType.DeclarationField
  },
  {
    text: 'Payment',
    hint: {
      text: 'Ask users to pay for something'
    },
    value: ComponentType.PaymentField
  },
  {
    divider: 'or'
  },
  {
    text: 'A list of options that users can choose from',
    value: QuestionTypeSubGroup.ListSubGroup
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

const locationSubItems = [
  {
    text: 'UK address',
    hint: {
      text: 'A street address, town or city and postcode'
    },
    value: ComponentType.UkAddressField
  },
  {
    text: 'Easting and northing',
    value: ComponentType.EastingNorthingField
  },
  {
    text: 'Ordnance Survey (OS) grid reference',
    value: ComponentType.OsGridRefField
  },
  {
    text: 'National Grid field number',
    value: ComponentType.NationalGridFieldNumberField
  },
  {
    text: 'Latitude and longitude',
    value: ComponentType.LatLongField
  }
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
  },
  {
    text: 'Select',
    hint: {
      text: 'A drop-down list for users to select one answer'
    },
    value: ComponentType.SelectField
  }
]

/**
 * @param {string} questionId
 * @param {FormEditorCheckbox[]} questionTypes
 * @param {Page|undefined} page
 * @param { QuestionSessionState | null | undefined } state
 */
export function filterQuestionTypes(questionId, questionTypes, page, state) {
  let components = hasComponents(page)
    ? page.components.filter((c) => isFormType(c.type))
    : []
  const formComponentCount = components.length

  // TODO Temporary - remove later
  const allowPayments = config.featureFlagAllowPayments
  if (!allowPayments) {
    questionTypes = questionTypes.filter((qt) => qt.text !== 'Payment')
  }

  if (
    page?.controller === ControllerType.Repeat ||
    formComponentCount > 1 ||
    (formComponentCount === 1 && questionId === 'new')
  ) {
    // File upload not allowed for Repeat, or if more than one question already, or if adding a second question
    return questionTypes.filter(
      (q) => q.value !== ComponentType.FileUploadField
    )
  }

  // Handle question type override from state
  if (state?.questionType) {
    components = components.map((comp) => {
      if (comp.id === questionId) {
        return /** @type {ComponentDef} */ ({
          ...comp,
          type: state.questionType
        })
      } else {
        return comp
      }
    })
  }

  if (includesFileUploadField(components)) {
    return questionTypes.filter(
      (q) => q.value !== ComponentType.FileUploadField
    )
  }
  return questionTypes
}

/**
 * @param { FormEditor | undefined } formValues
 * @param { ValidationFailure<FormEditor> | undefined } validation
 */
function questionTypeGroupFields(formValues, validation) {
  return {
    [QuestionTypeSubGroup.WrittenAnswerSubGroup]: {
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
    [QuestionTypeSubGroup.DateSubGroup]: {
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
    [QuestionTypeSubGroup.ListSubGroup]: {
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
    },
    [QuestionTypeSubGroup.LocationSubGroup]: {
      id: 'locationSub',
      name: 'locationSub',
      idPrefix: 'locationSub',
      fieldset: {
        legend: {
          text: 'Type of location you require',
          isPageHeading: false
        }
      },
      items: locationSubItems,
      value: formValues?.locationSub,
      ...insertValidationErrors(validation?.formErrors.locationSub)
    }
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param { QuestionSessionState | null | undefined } state
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function questionTypeViewModel(
  metadata,
  definition,
  pageId,
  questionId,
  state,
  validation
) {
  const formTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )
  const { formValues, formErrors } = validation ?? {}

  const pageNum = getPageNum(definition, pageId)
  const questionNum = getQuestionNum(definition, pageId, questionId)
  const pageHeading = 'What information do you need from users?'
  const page = getPageFromDefinition(definition, pageId)
  return {
    ...baseModelFields(
      metadata.slug,
      `${pageHeading} - ${formTitle}`,
      formTitle
    ),
    navigation,
    errorList: buildErrorList(formErrors),
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
          questionId,
          questionTypeRadioItems,
          page,
          state
        ),
        ...insertValidationErrors(validation?.formErrors.questionType)
      },
      ...questionTypeGroupFields(formValues, validation)
    },
    buttonText: SAVE_AND_CONTINUE
  }
}

/**
 * @import { ComponentDef, FormEditorCheckbox, FormMetadata, FormDefinition, FormEditor, Page, QuestionSessionState } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
