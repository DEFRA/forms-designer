import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { hasAdminRole } from '~/src/common/helpers/auth/get-user-session.js'
import config from '~/src/config.js'
import { checkBoomError } from '~/src/lib/error-boom-helper.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import {
  addUser,
  deleteUser,
  getRoles,
  getUser,
  updateUser
} from '~/src/lib/manage.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { Roles, getNameForRole } from '~/src/models/account/role-mapper.js'
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
  userRole: Joi.string()
    .valid(Roles.Admin, Roles.FormCreator)
    .required()
    .messages({
      '*': 'Select a role'
    })
})

const amendUserSchema = Joi.object({
  userRole: Joi.string()
    .valid(Roles.Admin, Roles.FormCreator)
    .required()
    .messages({
      '*': 'Select a role'
    })
})

const userIdSchema = Joi.object({
  userId: Joi.string().required()
})

const MANAGE_USERS_BASE_URL = '/manage/users'

/**
 * Pre-handler to check if user management features are available
 */
const checkUserManagementAccess = [
  {
    method: /** @param {Request} request */ (request) => {
      if (!config.featureFlagUseEntitlementApi) {
        throw Boom.forbidden('User management is not available')
      }

      const { credentials } = request.auth
      if (!hasAdminRole(credentials.user)) {
        throw Boom.forbidden('Admin access required')
      }
      return true
    }
  }
]

export default [
  /** @type {ServerRoute} */
  // Add a new user
  ({
    method: 'GET',
    path: `${MANAGE_USERS_BASE_URL}/new`,
    async handler(request, h) {
      const { auth, yar } = request
      const { token } = auth.credentials

      const roles = await getRoles(token)

      const validation =
        /** @type { ValidationFailure<ManageUser> | undefined } */ (
          getValidationErrorsFromSession(yar, errorKey)
        )

      return h.view(
        'manage/user',
        viewModel.createOrEditUserViewModel(roles, undefined, validation)
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      },
      pre: checkUserManagementAccess
    }
  }),

  /** @type {ServerRoute} */
  // Edit an existing user
  ({
    method: 'GET',
    path: `${MANAGE_USERS_BASE_URL}/{userId}/amend`,
    async handler(request, h) {
      const { auth, yar, params } = request
      const { token } = auth.credentials
      const { userId } = params

      const roles = await getRoles(token)

      const validation =
        /** @type { ValidationFailure<ManageUser> | undefined } */ (
          getValidationErrorsFromSession(yar, errorKey)
        )

      const user = await getUser(token, userId)

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
      },
      pre: checkUserManagementAccess
    }
  }),

  /** @type {ServerRoute} */
  // Delete a user
  ({
    method: 'GET',
    path: `${MANAGE_USERS_BASE_URL}/{userId}/delete`,
    async handler(request, h) {
      const { auth, params } = request
      const { token } = auth.credentials
      const { userId } = params

      // Validate the userId
      const user = await getUser(token, userId)

      return h.view(
        'forms/confirmation-page',
        viewModel.deleteUserConfirmationPageViewModel(user)
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      },
      pre: checkUserManagementAccess
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: ManageUser }>}
   */
  // Post new user details
  ({
    method: 'POST',
    path: `${MANAGE_USERS_BASE_URL}/new`,
    async handler(request, h) {
      const { payload, yar, auth } = request
      const { token } = auth.credentials

      try {
        const newUser = await addUser(token, {
          email: payload.emailAddress,
          roles: [payload.userRole]
        })

        yar.flash(
          sessionNames.successNotification,
          `You added ${newUser.displayName}`
        )

        // Redirect back to list of users
        return h.redirect(MANAGE_USERS_BASE_URL).code(StatusCodes.SEE_OTHER)
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
  // Post edited user details
  ({
    method: 'POST',
    path: `${MANAGE_USERS_BASE_URL}/{userId}/amend`,
    async handler(request, h) {
      const { payload, yar, auth, params } = request
      const { token } = auth.credentials
      const { userId } = params
      const { userRole } = payload

      try {
        const existingUser = await getUser(token, userId)

        await updateUser(token, {
          userId,
          roles: [userRole]
        })

        yar.flash(
          sessionNames.successNotification,
          `You updated ${existingUser.displayName}'s role to ${getNameForRole(userRole)}`
        )

        // Redirect back to list of users
        return h.redirect(MANAGE_USERS_BASE_URL).code(StatusCodes.SEE_OTHER)
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
  }),

  /**
   * @satisfies {ServerRoute}
   */
  // Post operation for delete confirmation
  ({
    method: 'POST',
    path: `${MANAGE_USERS_BASE_URL}/{userId}/delete`,
    async handler(request, h) {
      const { yar, auth, params } = request
      const { token } = auth.credentials
      const { userId } = params

      try {
        const existingUser = await getUser(token, userId)

        await deleteUser(token, userId)

        yar.flash(
          sessionNames.successNotification,
          `You removed ${existingUser.displayName} from Forms Designer`
        )

        // Redirect back to list of users
        return h.redirect(MANAGE_USERS_BASE_URL).code(StatusCodes.SEE_OTHER)
      } catch (err) {
        const error = checkBoomError(/** @type {Boom.Boom} */ (err), errorKey)
        if (error) {
          return redirectWithErrors(request, h, error, errorKey)
        }
        throw err
      }
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
  })
]

/**
 * @import { ManageUser } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 * @import { ServerRoute, Request } from '@hapi/hapi'
 */
