import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
import config from '~/src/config.js'
import * as forms from '~/src/lib/forms.js'
import {
  formOverviewBackLink,
  formOverviewPath,
  formsLibraryBackLink,
  formsLibraryPath
} from '~/src/models/links.js'

/**
 * @param {string} token
 */
export async function listViewModel(token) {
  const pageTitle = 'Forms library'
  const formItems = await forms.list(token)

  return {
    pageTitle,
    pageHeading: {
      text: pageTitle
    },
    formItems
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {string} [notification] - success notification to display
 */
export function overviewViewModel(metadata, notification) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)

  const navigation = getFormSpecificNavigation(formPath, metadata, 'Overview')

  return {
    backLink: formsLibraryBackLink,
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    form: metadata,
    formManage: {
      heading: {
        text: 'Manage form',
        size: 'medium',
        level: '3'
      },

      // Adjust default action when draft is available
      ...(!metadata.draft
        ? {
            action: `${formPath}/create-draft-from-live`,
            method: 'POST'
          }
        : {
            action: `${formPath}/editor`,
            method: 'GET'
          }),

      // Adjust buttons when draft is available
      buttons: !metadata.draft
        ? [{ text: 'Create draft to edit' }]
        : [
            {
              text: 'Edit draft',
              classes: 'govuk-button--secondary-quiet'
            },
            {
              text: 'Make draft live',
              attributes: {
                formaction: `${formPath}/make-draft-live`
              }
            }
          ]
    },
    previewUrl: config.previewUrl,
    notification
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function editorViewModel(metadata, definition) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)

  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')

  return {
    backLink: formOverviewBackLink(metadata.slug),
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    form: metadata,
    formDefinition: definition,
    previewUrl: config.previewUrl
  }
}

/**
 * Returns the navigation bar items as an array. Where activePage matches
 * a page, that page will have isActive:true set.
 * @param {string} formPath
 * @param {string} activePage
 * @param {FormMetadata} metadata
 */
export function getFormSpecificNavigation(formPath, metadata, activePage = '') {
  const navigationItems = [
    ['Forms library', formsLibraryPath],
    ['Overview', formPath]
  ]

  if (metadata.draft) {
    navigationItems.push(['Editor', `${formPath}/editor`])
  }

  return navigationItems.map((item) =>
    buildEntry(item[0], item[1], { isActive: item[0] === activePage })
  )
}

/**
 * @import { FormDefinition, FormMetadata } from '@defra/forms-model'
 */
