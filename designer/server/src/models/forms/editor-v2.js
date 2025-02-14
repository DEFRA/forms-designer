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
      href: editorv2Path(metadata.slug, 'add-page'),
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
 * @param {Partial<FormDefinition>} [_definition]
 * @param {ValidationFailure<FormDefinition>} [validation]
 */
export function addPageViewModel(_definition, validation) {
  const pageTitle = 'What kind of page do you need?'
  const { /* formValues */ formErrors } = validation ?? {}

  return {
    backLink: {
      href: ROUTE_PATH_PAGES
    },
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    errorList: buildErrorList(formErrors, ['pageType']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'pageType',
      name: 'pageType',
      legend: {
        text: pageTitle
      },
      value: null, // formValues?.pageType ?? definition?.pageType,
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
    ['Editor', `${formPath}/editor-v2`]
  ]

  return navigationItems.map((item) =>
    buildEntry(item[0], item[1], { isActive: item[0] === activePage })
  )
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 *  @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
