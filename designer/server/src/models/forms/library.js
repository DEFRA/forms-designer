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
 * @param {boolean} formMakeLiveSuccess - indicating if a success
 * message should be shown if form created successfully
 */
export function overviewViewModel(metadata, formMakeLiveSuccess) {
  const pageTitle = metadata.title
  const formPath = `/library/${metadata.slug}`

  const navigation = [
    buildEntry('Forms library', `/library`),
    buildEntry('Overview', formPath, { isActive: true }),
    buildEntry('Editor', `${formPath}/editor`)
  ]

  /**
   * @type {any[]}
   */
  const buttons = []

  if (metadata.draft) {
    buttons.concat([
      {
        text: 'Edit draft',
        href: `${formPath}/editor`,
        classes: 'govuk-button--secondary-quiet'
      },
      {
        text: 'Make draft live',
        href: `${formPath}/make-draft-live`
      }
    ])
  }

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
        text: 'Form management',
        size: 'medium',
        level: '3'
      },
      buttons
    },
    previewUrl: config.previewUrl,
    formMakeLiveSuccess
  }
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
 * @typedef {import('~/src/lib/forms.js').FormMetadata} FormMetadata
 */
