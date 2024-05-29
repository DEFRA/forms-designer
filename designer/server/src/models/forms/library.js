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

  const { buttons, submitButtons } = getFormManagementButtons(
    metadata,
    formPath
  )

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
    formManagement: {
      heading: {
        text: 'Manage form',
        size: 'medium',
        level: '3'
      },
      buttons,
      submitButtons
    },
    previewUrl: config.previewUrl,
    notification
  }
}

/**
 * @param {boolean} displayCreateLiveSuccess - wwhether to display form live success message
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
 * @param {string} baseUrl
 */
function getFormManagementButtons(metadata, baseUrl) {
  const buttons = []
  const submitButtons = []

  if (metadata.draft) {
    buttons.push(
      {
        text: 'Edit draft',
        href: `${baseUrl}/editor`,
        classes: 'govuk-button--secondary-quiet'
      },
      {
        text: 'Make draft live',
        href: `${baseUrl}/make-draft-live`
      }
    )
  } else if (metadata.live) {
    submitButtons.push({
      text: 'Create draft to edit',
      href: `${baseUrl}/create-draft-from-live`
    })
  }

  return { buttons, submitButtons }
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
