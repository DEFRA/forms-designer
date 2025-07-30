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
        value: formValues?.emailAddress ?? user?.email,
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
        items: allRoles.map((r) => ({
          text: r.name,
          value: r.code,
          hint: {
            text: r.description
          }
        })),
        value: formValues?.userRole ?? role,
        ...insertValidationErrors(formErrors?.userRole)
      }
    },
    displayName: {
      text: user?.displayName
    },
    userId: user?.userId
  }
}

/**
 * @param {string} role
 * @param {EntitlementRole[]} allRoles
 */
export function mapRoleName(role, allRoles) {
  const foundRole = allRoles.find((r) => r.code === role)
  return foundRole ? foundRole.name : 'Unknown'
}

/**
 * @param {EntitlementUser[]} users
 * @param {EntitlementRole[]} allRoles
 * @param {string[]} [notification]
 */
export function listUsersViewModel(users, allRoles, notification) {
  const rows = users.map((user) => [
    {
      html: `${user.displayName}<span class="govuk-visually-hidden">User: ${user.displayName}</span><br><span class="govuk-hint" aria-hidden="true"> ${user.email} </span>`
    },
    {
      text: user.roles.map((role) => mapRoleName(role, allRoles)).join(', ')
    },
    {
      html: `<a class="govuk-link govuk-link--no-visited-state" href="${editUrl}${user.userId}/amend">Manage</a>`
    }
  ])

  return {
    pageTitle: MANAGE_USERS_TEXT,
    navigation: getTabs(),
    backLink: {
      text: 'Back to form library',
      href: '/library'
    },
    pageHeading: {
      text: MANAGE_USERS_TEXT,
      size: 'large'
    },
    pageActions: [
      {
        text: 'Add new user',
        href: '/manage/users/new',
        classes: 'govuk-button--inverse'
      }
    ],
    summaryTable: {
      caption: 'Users',
      captionClasses: 'govuk-table__caption--m',
      head: [
        {
          text: 'Name'
        },
        {
          text: 'Role'
        },
        {
          text: 'Actions'
        }
      ],
      rows
    },
    notification
  }
}

/**
 * Model to represent confirmation page dialog
 * @param {EntitlementUser} user
 */
export function deleteUserConfirmationPageViewModel(user) {
  const backOrCancelUrl = `${editUrl}${user.userId}/amend`
  return {
    navigation: getTabs(),
    backLink: {
      href: backOrCancelUrl,
      text: 'Back to edit user'
    },
    useNewMasthead: true,
    pageHeading: {
      text: 'Are you sure you want to remove this user?'
    },
    pageCaption: {
      text: user.displayName
    },
    warning: {
      text: 'Removing this user means they can no longer create and manage forms.'
    },
    buttons: [
      {
        text: 'Remove user',
        classes: 'govuk-button--warning'
      },
      {
        href: backOrCancelUrl,
        text: 'Cancel',
        classes: 'govuk-button--secondary'
      }
    ]
  }
}

/**
 * @import { EntitlementUser, EntitlementRole, ManageUser } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
