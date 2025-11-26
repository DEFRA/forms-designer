import { Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import {
  addSection,
  assignPageToSection,
  removeSection,
  unassignPageFromSection,
  updateSectionSettings
} from '~/src/lib/editor.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  CHANGES_SAVED_SUCCESSFULLY,
  SECTION_NAME_ALREADY_EXISTS
} from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/sections.js'

export const ROUTE_PATH_SECTIONS = `/library/{slug}/editor-v2/page/{pageId}/check-answers-settings/sections`

const errorKey = sessionNames.validationFailure.editorSections
const notificationKey = sessionNames.successNotification

const ENTER_SECTION_HEADING = 'Enter section heading'
const SECTION_ADDED = 'Section added'
const SECTION_REMOVED = 'Section removed'
const PAGE_ASSIGNED_TO_SECTION = 'Page assigned to section'
const PAGE_UNASSIGNED_FROM_SECTION = 'Page unassigned from section'

const OP_ADD_SECTION = 'add-section'
const OP_REMOVE_SECTION = 'remove-section'
const OP_ASSIGN_PAGE = 'assign-page'
const OP_UNASSIGN_PAGE = 'unassign-page'
const OP_SAVE_SETTINGS = 'save-settings'

export const schema = Joi.object().keys({
  operation: Joi.string()
    .valid(
      OP_ADD_SECTION,
      OP_REMOVE_SECTION,
      OP_ASSIGN_PAGE,
      OP_UNASSIGN_PAGE,
      OP_SAVE_SETTINGS
    )
    .required(),
  sectionHeading: Joi.when('operation', {
    is: OP_ADD_SECTION,
    then: Joi.string().required().messages({
      'any.required': ENTER_SECTION_HEADING,
      'string.empty': ENTER_SECTION_HEADING
    })
  }),
  sectionId: Joi.string().when('operation', {
    is: Joi.valid(OP_REMOVE_SECTION, OP_ASSIGN_PAGE, OP_SAVE_SETTINGS),
    then: Joi.required()
  }),
  pageId: Joi.string().when('operation', {
    is: Joi.valid(OP_ASSIGN_PAGE, OP_UNASSIGN_PAGE),
    then: Joi.required()
  }),
  hideTitle: Joi.boolean().truthy('true').falsy('false').optional()
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_SECTIONS,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, pageId } = params

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      return h.view(
        'forms/editor-v2/sections',
        viewModel.sectionsViewModel(
          metadata,
          definition,
          pageId,
          validation,
          notification
        )
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormRead}`]
        }
      }
    }
  }),
  /**
   * @typedef {object} SectionsPayload
   * @property {string} operation - The operation to perform (add-section, remove-section, etc.)
   * @property {string} [sectionHeading] - The heading text for a new section
   * @property {string} [sectionId] - The ID of the section to operate on
   * @property {string} [pageId] - The ID of the page to assign/unassign
   * @property {boolean} [hideTitle] - Whether to hide the section title in the form
   */
  /**
   * @satisfies {ServerRoute<{ Payload: SectionsPayload }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_SECTIONS,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { slug, pageId } = /** @type {{ slug: string, pageId: string }} */ (
        params
      )
      const { token } = auth.credentials
      const { operation } = payload

      const metadata = await forms.get(slug, token)

      try {
        switch (operation) {
          case OP_ADD_SECTION: {
            const { sectionHeading = '' } = payload
            await addSection(metadata.id, token, sectionHeading)
            yar.flash(sessionNames.successNotification, SECTION_ADDED)
            break
          }
          case OP_REMOVE_SECTION: {
            const { sectionId = '' } = payload
            await removeSection(metadata.id, token, sectionId)
            yar.flash(sessionNames.successNotification, SECTION_REMOVED)
            break
          }
          case OP_ASSIGN_PAGE: {
            const { pageId: targetPageId = '', sectionId = '' } = payload
            await assignPageToSection(
              metadata.id,
              token,
              targetPageId,
              sectionId
            )
            yar.flash(
              sessionNames.successNotification,
              PAGE_ASSIGNED_TO_SECTION
            )
            break
          }
          case OP_UNASSIGN_PAGE: {
            const { pageId: targetPageId = '' } = payload
            await unassignPageFromSection(metadata.id, token, targetPageId)
            yar.flash(
              sessionNames.successNotification,
              PAGE_UNASSIGNED_FROM_SECTION
            )
            break
          }
          case OP_SAVE_SETTINGS: {
            const { sectionId = '', hideTitle } = payload
            await updateSectionSettings(metadata.id, token, sectionId, {
              hideTitle: hideTitle === true
            })
            yar.flash(
              sessionNames.successNotification,
              CHANGES_SAVED_SUCCESSFULLY
            )
            break
          }
        }
      } catch (error) {
        const errorInstance = /** @type {Error} */ (error)
        if (errorInstance.message === SECTION_NAME_ALREADY_EXISTS) {
          yar.flash(errorKey, {
            sectionHeading: { message: errorInstance.message }
          })
        } else {
          throw error
        }
      }

      return h
        .redirect(
          ROUTE_PATH_SECTIONS.replace('{slug}', slug).replace(
            '{pageId}',
            pageId
          )
        )
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schema,
        failAction: (request, h, error) => {
          return redirectWithErrors(request, h, error, errorKey)
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
