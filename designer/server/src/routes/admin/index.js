import { performance } from 'node:perf_hooks'
import { PassThrough } from 'node:stream'

import { Scopes, getErrorMessage } from '@defra/forms-model'
import Archiver from 'archiver'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { mapUserForAudit } from '~/src/common/helpers/auth/user-helper.js'
import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import * as forms from '~/src/lib/forms.js'
import { getUser } from '~/src/lib/manage.js'
import {
  publishFormsBackupRequestedEvent,
  publishPlatformCsatExcelRequestedEvent
} from '~/src/messaging/publish.js'
import { sendFeedbackSubmissionsFile } from '~/src/services/formSubmissionService.js'

export const ROUTE_FULL_PATH = '/admin/index'

const schema = Joi.object({
  action: Joi.string().valid('feedback', 'download').required()
})

/**
 * @param { string | undefined } email
 */
export function generateSuccessMessage(email) {
  return `
  <h3 class="govuk-notification-banner__heading">
    We have emailed a link to your email
  </h3>
  <p class="govuk-body">This might take a couple of minutes.</p>
  <p class="govuk-body">Email: ${email}</p>`
}

export function generateTitling() {
  const pageTitle = 'Admin tools'

  return {
    pageTitle,
    pageHeading: {
      text: pageTitle
    },
    backLink: {
      text: 'Back to form library',
      href: '/library'
    }
  }
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH,
    handler(request, h) {
      const { yar } = request

      const navigation = buildAdminNavigation('Admin tools')

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(sessionNames.successNotification).at(0)
      )

      return h.view('admin/index', {
        ...generateTitling(),
        navigation,
        notification
      })
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.UserEdit}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: { action: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH,
    async handler(request, h) {
      const { auth, yar, payload } = request
      const { token } = auth.credentials
      const { action } = payload

      if (action === 'download') {
        return downloadAllFormsAsZip(request, h)
      }

      // feedback action: Request all forms by omitting the formId
      await sendFeedbackSubmissionsFile(undefined, token)

      const user = mapUserForAudit(auth.credentials.user)
      const { email } = await getUser(token, user.id)

      await publishPlatformCsatExcelRequestedEvent(
        {
          formId: 'platform',
          formName: 'all',
          notificationEmail: email.toLowerCase()
        },
        user
      )

      yar.flash(
        sessionNames.successNotification,
        generateSuccessMessage(email.toLowerCase())
      )

      // Redirect to same page
      return h.redirect('/admin/index').code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schema
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.UserEdit}`]
        }
      }
    }
  })
]

/**
 * Process a single form - fetch definitions and append to archive
 * @param {FormMetadata} metadata
 * @param {string} token
 * @param {ReturnType<Archiver>} archive
 * @returns {Promise<boolean>} true if successful, false if failed
 */
async function processForm(metadata, token, archive) {
  // Add metadata first under {id}/metadata.json
  const metadataName = `${metadata.id}/metadata.json`
  const metadataJson = JSON.stringify(metadata, null, 2)
  archive.append(metadataJson, { name: metadataName })

  // Then append definitions under {id}/definition_*.json
  const definition = await getFormDefinitions(
    metadata.id,
    !!metadata.draft,
    token
  )
  appendFormDefinitionsToArchive(metadata.id, archive, definition)
  return true
}

/**
 * Download all forms as a ZIP file
 * @param {Request<{ Payload: { action: string } }>} request
 * @param {ResponseToolkit<{ Payload: { action: string; }; }>} responseToolkit
 * @returns {Promise<ResponseObject>}
 */
async function downloadAllFormsAsZip(request, responseToolkit) {
  const { auth } = request
  const { token } = auth.credentials
  const user = mapUserForAudit(auth.credentials.user)

  try {
    const startedAt = performance.now()

    const stream = new PassThrough()
    // Create archive
    const archive = Archiver('zip', { zlib: { level: 9 } })

    // Pipe archive to PassThrough stream
    archive.pipe(stream)

    // Set headers
    const response = responseToolkit.response(stream)
    response.header('Content-Type', 'application/zip')
    response.header('Content-Disposition', 'attachment; filename="forms.zip"')

    // Handle archive events
    archive.on('warning', (/**  @type {Error} */ err) => {
      request.logger.warn(
        err,
        `[downloadAllForms] Archive warning - ${getErrorMessage(err)}`
      )
    })

    archive.on('error', (/**  @type {Error} */ err) => {
      request.logger.error(
        err,
        `[downloadAllForms] Archive error - ${getErrorMessage(err)}`
      )
      stream.destroy(err)
    })

    // 5 promises at a time
    const concurrency = 5
    let totalForms = 0
    let batch = []

    // Process forms as they're yielded from the generator
    for await (const metadata of forms.listAll(token)) {
      totalForms++
      batch.push(metadata)
      // Process in batches
      if (batch.length >= concurrency) {
        await Promise.all(
          batch.map((formMetadata) => processForm(formMetadata, token, archive))
        )
        batch = []
      }
    }

    // Process remaining forms in batch
    if (batch.length > 0) {
      await Promise.all(
        batch.map((formMetadata) => processForm(formMetadata, token, archive))
      )
    }
    // no forms, 404 response
    if (totalForms === 0) {
      request.logger.warn('[downloadAllForms] No forms found for download')
      return responseToolkit
        .response({ message: 'No forms available to download' })
        .code(StatusCodes.NOT_FOUND)
    }

    request.logger.info(
      {
        totalForms,
        userId: user.id
      },
      '[downloadAllForms] Finalizing archive'
    )

    await archive.finalize()

    const durationMs = performance.now() - startedAt
    // Publish audit event
    await publishFormsBackupRequestedEvent(user, totalForms, durationMs)
    return response
  } catch (err) {
    request.logger.error(
      err,
      `[downloadAllForms] Failed to create ZIP - ${getErrorMessage(err)}`
    )
    return responseToolkit
      .response({
        message: 'Failed to download forms',
        error: getErrorMessage(err)
      })
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Retrieve both live and draft form definitions
 * @param {string} id - The form metadata ID
 * @param { boolean } includeDraft - Whether to include draft definition
 * @param {string} token - Auth token
 * @returns {Promise<{ liveDefinition: FormDefinition | null, draftDefinition: FormDefinition | null }>}
 */
async function getFormDefinitions(id, includeDraft, token) {
  const [liveDefinition, draftDefinition] = await Promise.all([
    forms.getLiveFormDefinition(id, token),
    includeDraft
      ? forms.getDraftFormDefinition(id, token)
      : Promise.resolve(null)
  ])

  return { liveDefinition, draftDefinition }
}

/**
 * Append form definitions using id-based folder paths
 * @param {string} id form ID
 * @param {ReturnType<Archiver>} archive archive instance
 * @param {Awaited<ReturnType<getFormDefinitions>>} definition form definitions
 */
function appendFormDefinitionsToArchive(id, archive, definition) {
  const liveFilename = `${id}/definition_live.json`
  const draftFilename = `${id}/definition_draft.json`
  if (definition.liveDefinition) {
    const jsonString = JSON.stringify(definition.liveDefinition, null, 2)
    archive.append(jsonString, { name: liveFilename })
  }
  if (definition.draftDefinition) {
    const jsonString = JSON.stringify(definition.draftDefinition, null, 2)
    archive.append(jsonString, { name: draftFilename })
  }
}

/**
 * @import { ServerRoute , Request, ResponseToolkit, ResponseObject} from '@hapi/hapi'
 * @import { FormMetadata, FormDefinition ,FormMetadataState} from '@defra/forms-model'
 */
