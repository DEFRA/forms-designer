import { ComponentType } from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
import {
  editorv2Path,
  formOverviewBackLink,
  formOverviewPath,
  formsLibraryPath
} from '~/src/models/links.js'
import { ROUTE_PATH_PAGES } from '~/src/routes/forms/editor-v2/pages.js'

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
    backLink: {
      href: editorv2Path(metadata.slug, ROUTE_PATH_PAGES),
      text: 'Back to add and edit pages'
    },
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle
    },
    pageCaption: {
      text: metadata.title
    },
    useNewMasthead: true,
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
    buttonText: 'Save and continue'
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {Partial<FormEditor>} [editor]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function addQuestionViewModel(metadata, editor, validation) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formValues, formErrors } = validation ?? {}

  return {
    backLink: {
      href: editorv2Path(metadata.slug, 'pages'),
      text: 'Back to add and edit pages'
    },
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    useNewMasthead: true,
    errorList: buildErrorList(formErrors, ['questionType']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    fields: {
      questionType: {
        idPrefix: 'questionType',
        name: 'questionType',
        value: formValues?.questionType ?? editor?.questionType,
        items: [
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
        ],
        ...(validation?.formErrors.questionType && {
          errorMessage: {
            text: validation.formErrors.questionType.text
          }
        })
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
        items: [
          {
            text: 'Short answer (a single line)',
            value: ComponentType.TextField
          },
          {
            text: 'Long answer (more than a single line)',
            value: ComponentType.MultilineTextField
          },
          { text: 'Numbers only', value: ComponentType.NumberField }
        ],
        value: formValues?.writtenAnswerSub ?? editor?.question,
        ...(validation?.formErrors.writtenAnswerSub && {
          errorMessage: {
            text: validation.formErrors.writtenAnswerSub.text
          }
        })
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
        items: [
          { text: 'Day, month and year', value: 'DatePartsField' },
          { text: 'Month and year', value: 'MonthYearField' }
        ],
        value: formValues?.dateSub ?? editor?.question,
        ...(validation?.formErrors.dateSub && {
          errorMessage: {
            text: validation.formErrors.dateSub.text
          }
        })
      }
    },
    buttonText: 'Save and continue'
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {Partial<FormEditor>} [editor]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function addQuestionDetailsViewModel(metadata, editor, validation) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formValues, formErrors } = validation ?? {}

  return {
    backLink: {
      href: editorv2Path(metadata.slug, 'pages'),
      text: 'Back to add and edit pages'
    },
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    useNewMasthead: true,
    errorList: buildErrorList(formErrors, [
      'question',
      'shortDescription',
      'hintText'
    ]),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    fields: {
      question: {
        name: 'question',
        id: 'question',
        label: {
          text: 'Question',
          classes: 'govuk-label--m'
        },
        value: formValues?.question ?? editor?.question,
        ...(validation?.formErrors.question && {
          errorMessage: {
            text: validation.formErrors.question.text
          }
        })
      },
      hintText: {
        name: 'hintText',
        id: 'hintText',
        label: {
          text: 'Hint text (optional)',
          classes: 'govuk-label--m'
        },
        rows: 3,
        value: formValues?.hintText ?? editor?.hintText,
        ...(validation?.formErrors.hintText && {
          errorMessage: {
            text: validation.formErrors.hintText.text
          }
        })
      },
      questionOptional: {
        name: 'questionOptional',
        id: 'questionOptional',
        classes: 'govuk-checkboxes--small',
        items: [
          {
            value: 'optional',
            text: 'Make this question optional'
          }
        ],
        value: formValues?.questionOptional ?? editor?.questionOptional
      },
      shortDescription: {
        name: 'shortDescription',
        idPrefix: 'shortDescription',
        label: {
          text: 'Short description',
          classes: 'govuk-label--m'
        },
        hint: {
          text: "Enter a short description for this question like 'licence period'. Short descriptions are used in error messages and on the check your answers page."
        },
        value: formValues?.shortDescription ?? editor?.shortDescription,
        ...(validation?.formErrors.shortDescription && {
          errorMessage: {
            text: validation.formErrors.shortDescription.text
          }
        })
      }
    },
    buttonText: 'Save and continue'
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {ComponentDef[]} components
 * @param {Partial<FormEditor>} [editor]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function questionsViewModel(metadata, components, editor, validation) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const { formErrors } = validation ?? {}

  return {
    backLink: {
      href: editorv2Path(metadata.slug, 'pages'),
      text: 'Back to add and edit pages'
    },
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    useNewMasthead: true,
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
    buttonText: 'Save and continue'
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
 * @import { FormMetadata, FormDefinition, FormEditor, ComponentDef } from '@defra/forms-model'
 *  @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
