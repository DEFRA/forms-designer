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

  const navigation = [
    buildEntry('Forms library', `/library`),
    buildEntry('Overview', formPath, { isActive: true }),
    buildEntry('Editor', `${formPath}/editor`)
  ]

  const buttons = getFormManagementButtons(metadata, formPath)

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
      buttons
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
    buttons.push({
      text: 'Create draft to edit',
      href: `${baseUrl}/create-draft-from-live`
    })
  }
  return buttons
}

/**
 * @param {FormMetadata} metadata
 */
export function editorViewModel(metadata) {
  const pageTitle = metadata.title
  const formPath = `/library/${metadata.slug}`

  const navigation = [
    buildEntry('Forms library', `/library`),
    buildEntry('Overview', formPath),
    buildEntry('Editor', `${formPath}/editor`, { isActive: true })
  ]

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
 * @typedef {import('@defra/forms-model').FormMetadata} FormMetadata
 */
