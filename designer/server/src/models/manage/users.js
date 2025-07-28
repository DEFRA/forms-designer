import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors } from '~/src/lib/utils.js'
import { GOVUK_LABEL__M } from '~/src/models/forms/editor-v2/common.js'

const editUrl = '/manage/users/'
const MANAGE_USERS_TEXT = 'Manage users'

export function getTabs() {
  return [
    {
      text: 'My account',
      Url: '/account',
      isActive: false
    },
    {
      text: MANAGE_USERS_TEXT,
      Url: editUrl,
      isActive: true
    }
  ]
}

/**
 * @param {EntitlementRole[]} allRoles
 * @param { EntitlementUser | undefined } user
 * @param {ValidationFailure<ManageUser>} [validation]
 */
export function createOrEditUserViewModel(allRoles, user, validation) {
  const { formValues, formErrors } = validation ?? {}
  const [role] = user?.roles ?? []
  return {
    isEditing: user !== undefined,
    pageTitle: MANAGE_USERS_TEXT,
    navigation: getTabs(),
    backLink: {
      text: 'Back to manage users',
      href: '/manage/users'
    },
    pageHeading: {
      text: user ? 'Manage user account' : 'Add new user',
      size: 'large'
    },
    errorList: buildErrorList(formErrors),
    fields: {
      emailAddress: {
        id: 'emailAddress',
        name: 'emailAddress',
        label: {
          text: 'Email address',
          classes: GOVUK_LABEL__M
        },
        hint: {
          text: 'Must be a Defra group email address'
        },
        value: formValues?.emailAddress ?? user?.userId,
        disabled: user !== undefined,
        ...insertValidationErrors(formErrors?.emailAddress)
      },
      userRole: {
        id: 'userRole',
        name: 'userRole',
        idPrefix: 'userRole',
        fieldset: {
          legend: {
            text: 'Choose role',
            isPageHeading: false
          }
        },
        items: allRoles.map((role) => ({
          text: role.name,
          value: role.code
        })),
        value: formValues?.userRole ?? role,
        ...insertValidationErrors(formErrors?.userRole)
      }
    }
  }
}

/**
 * @import { EntitlementRole, ManageUser } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
