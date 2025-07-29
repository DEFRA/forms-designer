import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { checkBoomError } from '~/src/lib/error-boom-helper.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import { addUser, getRoles, getUser, updateUser } from '~/src/lib/manage.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/manage/users.js'

const errorKey = sessionNames.validationFailure.manageUsers

const addUserSchema = Joi.object({
  emailAddress: Joi.string()
    .email()
    .trim()
    .required()
    .messages({
      '*': 'Enter an email address in the correct format'
    })
    .description('Email address of user'),
  userRole: Joi.string().valid('admin', 'form-creator').required().messages({
    '*': 'Select a role'
  })
})

const amendUserSchema = Joi.object({
  userRole: Joi.string().valid('admin', 'form-creator').required().messages({
    '*': 'Select a role'
  })
})

const userIdSchema = Joi.object({
  userId: Joi.string().required()
})

export default [
  /** @type {ServerRoute} */
  ({
    method: 'GET',
    path: '/manage/users/{userId}/{amend?}',
    async handler(request, h) {
      const { auth, yar, params } = request
      const { token } = auth.credentials
      const { userId } = params

      // Get list of possible roles
      const roles = await getRoles(token)

      const validation =
        /** @type { ValidationFailure<ManageUser> | undefined } */ (
          getValidationErrorsFromSession(yar, errorKey)
        )

      let user
      if (userId !== 'new') {
        user = await getUser(token, userId)
      }

      return h.view(
        'manage/user',
        viewModel.createOrEditUserViewModel(roles, user, validation)
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: ManageUser }>}
   */
  ({
    method: 'POST',
    path: '/manage/users/new',
    async handler(request, h) {
      const { payload, yar, auth } = request
      const { token } = auth.credentials

      try {
        await addUser(token, {
          email: payload.emailAddress,
          roles: [payload.userRole]
        })

        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

        // Redirect back to list of users
        return h.redirect('/manage/users').code(StatusCodes.SEE_OTHER)
      } catch (err) {
        const error = checkBoomError(/** @type {Boom.Boom} */ (err), errorKey)
        if (error) {
          return redirectWithErrors(request, h, error, errorKey)
        }
        throw err
      }
    },
    options: {
      validate: {
        payload: addUserSchema,
        failAction: (request, h, error) => {
          return redirectWithErrors(request, h, error, errorKey)
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: ManageUser }>}
   */
  ({
    method: 'POST',
    path: '/manage/users/{userId}/amend',
    async handler(request, h) {
      const { payload, yar, auth, params } = request
      const { token } = auth.credentials
      const { userId } = params

      try {
        await updateUser(token, {
          userId,
          roles: [payload.userRole]
        })

        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

        // Redirect back to list of users
        return h.redirect('/manage/users').code(StatusCodes.SEE_OTHER)
      } catch (err) {
        const error = checkBoomError(/** @type {Boom.Boom} */ (err), errorKey)
        if (error) {
          return redirectWithErrors(request, h, error, errorKey)
        }
        throw err
      }
    },
    options: {
      validate: {
        params: userIdSchema,
        payload: amendUserSchema,
        failAction: (request, h, error) => {
          return redirectWithErrors(request, h, error, errorKey)
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  })
]

/**
 * @import { ManageUser } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 * @import Boom from '@hapi/boom'
 * @import { ServerRoute } from '@hapi/hapi'
 */
