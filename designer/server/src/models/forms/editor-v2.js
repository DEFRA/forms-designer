import { ComponentType, ControllerType } from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
import { insertValidationErrors, isCheckboxSelected } from '~/src/lib/utils.js'
import {
  editorv2Path,
  formOverviewBackLink,
  formOverviewPath,
  formsLibraryPath
} from '~/src/models/links.js'

const BACK_TO_ADD_AND_EDIT_PAGES = 'Back to add and edit pages'
const SAVE_AND_CONTINUE = 'Save and continue'
const GOVUK_LABEL__M = 'govuk-label--m'

/**
 * @param {FormDefinition} definition
 * @param {string} pageId
 */
export function getPageNum(definition, pageId) {
  if (pageId === 'new') {
    return (
      definition.pages.filter((x) => x.controller !== ControllerType.Summary)
        .length + 1
    )
  }
  const pageIdx = definition.pages.findIndex((x) => x.id === pageId)
  return pageIdx + 1
}

/**
 * @param {string} slug
 * @param {string} pageTitle
 */
function baseModelFields(slug, pageTitle) {
  return {
    backLink: {
      href: editorv2Path(slug, 'pages'),
      text: BACK_TO_ADD_AND_EDIT_PAGES
    },
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    useNewMasthead: true
  }
}
/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function pageListViewModel(metadata, definition) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')

  const pageActions = [
    {
      text: 'Add new page',
      href: editorv2Path(metadata.slug, 'page'),
      classes: 'govuk-button--inverse'
    }
  ]

  const extraPageActions = [
    {
      text: 'Re-order pages',
      href: '/reorder',
      classes: 'govuk-button--secondary'
    },
    {
      text: 'Preview form',
      href: '/preview',
      classes: 'govuk-link govuk-link--inverse'
    }
  ]

  if (definition.pages.length > 1) {
    pageActions.push(...extraPageActions)
  }

  const pageListModel = {
    ...definition,
    formSlug: metadata.slug,
    navigation,
    pageHeading: {
      text: 'Add and edit pages'
    },
    pageCaption: {
      text: definition.name
    },
    pageActions
  }

  return {
    ...pageListModel,
    backLink: formOverviewBackLink(metadata.slug)
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {Partial<FormEditor>} [editor]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function addPageViewModel(metadata, editor, validation) {
  const pageTitle = 'What kind of page do you need?'
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formValues, formErrors } = validation ?? {}

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    navigation,
    pageCaption: {
      text: metadata.title
    },
    pageClasses:
      'govuk-grid-column-full govuk-grid-column-one-half-from-desktop',
    errorList: buildErrorList(formErrors, ['pageType']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'pageType',
      name: 'pageType',
      value: formValues?.pageType ?? editor?.pageType,
      items: [
        {
          value: 'question',
          text: 'Question page',
          hint: {
            text: 'A page to hold one or more related questions'
          }
        },
        {
          value: 'guidance',
          text: 'Guidance page',
          hint: {
            text: 'If you need to add guidance without asking a question'
          }
        }
      ]
    },
    buttonText: SAVE_AND_CONTINUE
  }
}

const questionTypeRadioItemsSimple = [
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
    value: ComponentType.SelectField
  }
]

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
  { text: 'Day, month and year', value: 'DatePartsField' },
  { text: 'Month and year', value: 'MonthYearField' }
]

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function addQuestionViewModel(metadata, definition, pageId, validation) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formValues, formErrors } = validation ?? {}

  const pageNum = getPageNum(definition, pageId)

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    navigation,
    errorList: buildErrorList(formErrors, ['questionType']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    cardTitle: 'Question 1',
    cardCaption: `Page ${pageNum}: question 1`,
    fields: {
      questionType: {
        idPrefix: 'questionType',
        name: 'questionType',
        value: formValues?.questionType,
        items: questionTypeRadioItemsSimple,
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
      }
    },
    buttonText: SAVE_AND_CONTINUE
  }
}

/**
 * @param {ValidationFailure<FormEditor> | undefined} validation
 */
function questionDetailsFields(validation) {
  const formValues = validation?.formValues
  return {
    fields: {
      question: {
        name: 'question',
        id: 'question',
        label: {
          text: 'Question',
          classes: GOVUK_LABEL__M
        },
        value: formValues?.question,
        ...insertValidationErrors(validation?.formErrors.question)
      },
      hintText: {
        name: 'hintText',
        id: 'hintText',
        label: {
          text: 'Hint text (optional)',
          classes: GOVUK_LABEL__M
        },
        rows: 3,
        value: formValues?.hintText,
        ...insertValidationErrors(validation?.formErrors.hintText)
      },
      questionOptional: {
        name: 'questionOptional',
        id: 'questionOptional',
        classes: 'govuk-checkboxes--small',
        items: [
          {
            value: 'true',
            text: 'Make this question optional',
            checked: isCheckboxSelected(formValues?.questionOptional)
          }
        ]
      },
      shortDescription: {
        name: 'shortDescription',
        idPrefix: 'shortDescription',
        label: {
          text: 'Short description',
          classes: GOVUK_LABEL__M
        },
        hint: {
          text: "Enter a short description for this question like 'licence period'. Short descriptions are used in error messages and on the check your answers page."
        },
        value: formValues?.shortDescription,
        ...insertValidationErrors(validation?.formErrors.shortDescription)
      }
    }
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function addQuestionDetailsViewModel(
  metadata,
  definition,
  pageId,
  validation
) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formErrors } = validation ?? {}

  const pageNum = getPageNum(definition, pageId)

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    cardTitle: 'Question 1',
    cardCaption: `Page ${pageNum}`,
    navigation,
    errorList: buildErrorList(formErrors, [
      'question',
      'shortDescription',
      'hintText'
    ]),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    ...questionDetailsFields(validation),
    buttonText: SAVE_AND_CONTINUE
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {Partial<FormEditor>} [_editor]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function questionsViewModel(
  metadata,
  definition,
  pageId,
  _editor,
  validation
) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formErrors } = validation ?? {}

  const pageIdx = definition.pages.findIndex((x) => x.id === pageId)
  const page = definition.pages[pageIdx]
  const components = 'components' in page ? page.components : []

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    cardTitle: `Page ${pageIdx + 1} overview`,
    cardCaption: `Page ${pageIdx + 1}`,
    navigation,
    errorList: buildErrorList(formErrors, ['questionType']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    questionRows: components.map((comp, idx) => {
      return {
        key: {
          text: `Question ${idx + 1}`
        },
        value: {
          text: comp.title
        },
        actions: {
          items: [
            {
              href: '#',
              text: 'Change',
              visuallyHiddenText: 'name'
            }
          ]
        }
      }
    }),
    buttonText: SAVE_AND_CONTINUE
  }
}

/**
 * Returns the navigation bar items as an array. Where activePage matches
 * a page, that page will have isActive:true set.
 * @param {string} formPath
 * @param {FormMetadata} _metadata
 * @param {string} activePage
 */
export function getFormSpecificNavigation(
  formPath,
  _metadata,
  activePage = ''
) {
  const navigationItems = [
    ['Forms library', formsLibraryPath],
    ['Overview', formPath],
    ['Editor', `${formPath}/editor-v2/pages`]
  ]

  return navigationItems.map((item) =>
    buildEntry(item[0], item[1], { isActive: item[0] === activePage })
  )
}

/**
 * @import { FormMetadata, FormDefinition, FormEditor } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
