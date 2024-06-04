import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
import config from '~/src/config.js'
import * as forms from '~/src/lib/forms.js'

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
 * @param {boolean} [displayCreateLiveSuccess] - indicating if the form was successfully promoted to live
 * @param {boolean} [displayCreateDraftSuccess] - indicating if a draft form was successfully created
 */
export function overviewViewModel(
  metadata,
  displayCreateLiveSuccess = false,
  displayCreateDraftSuccess = false
) {
  const pageTitle = metadata.title
  const formPath = `/library/${metadata.slug}`

  const navigation = getFormSpecificNavigation(formPath, 'Overview')

  const notification = getFormOverviewNotification(
    displayCreateLiveSuccess,
    displayCreateDraftSuccess
  )

  return {
    backLink: {
      text: 'Back to forms library',
      href: '/library'
    },
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
 * @param {boolean} displayCreateLiveSuccess - whether to display form live success message
 * @param {boolean} displayCreateDraftSuccess - whether to display draft created success message
 */
function getFormOverviewNotification(
  displayCreateLiveSuccess,
  displayCreateDraftSuccess
) {
  if (displayCreateLiveSuccess) {
    return 'This form is now live'
  }

  if (displayCreateDraftSuccess) {
    return 'New draft created'
  }
}

/**
 * @param {FormMetadata} metadata
 */
export function editorViewModel(metadata) {
  const pageTitle = metadata.title
  const formPath = `/library/${metadata.slug}`

  const navigation = getFormSpecificNavigation(formPath, 'Editor')

  return {
    backLink: {
      text: 'Back to form overview',
      href: `/library/${metadata.slug}`
    },
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    form: metadata,
    previewUrl: config.previewUrl
  }
}

/**
 * Returns the navigation bar items as an array. Where activePage matches
 * a page, that page will have isActive:true set.
 * @param {string} formPath
 * @param {string} activePage
 */
export function getFormSpecificNavigation(formPath, activePage = '') {
  return [
    ['Forms library', '/library'],
    ['Overview', formPath],
    ['Editor', `${formPath}/editor`]
  ].map((item) =>
    buildEntry(item[0], item[1], { isActive: item[0] === activePage })
  )
}

/**
 * @typedef {import('@defra/forms-model').FormMetadata} FormMetadata
 */
