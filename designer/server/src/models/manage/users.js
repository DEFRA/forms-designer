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
 * @param {ValidationFailure<ManageUser>} [validation]
 */
export function createUserViewModel(allRoles, validation) {
  const { formValues, formErrors } = validation ?? {}
  return {
    pageTitle: MANAGE_USERS_TEXT,
    navigation: getTabs(),
    backLink: {
      text: 'Back to manage users',
      href: '/manage/users'
    },
    pageHeading: {
      text: 'Add new user',
      size: 'large'
    },
    fields: {
      emailAddress: {
        id: 'emailAddress',
        name: 'emailAddress',
        label: {
          text: 'Email address',
          classes: GOVUK_LABEL__M
        },
        hint: {
          text: 'Must be a Defra group email adrress'
        },
        value: formValues?.emailAddress,
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
        value: formValues?.userRole,
        ...insertValidationErrors(formErrors?.userRole)
      }
    }
  }
}

/**
 * @import { EntitlementRole, ManageUser } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
