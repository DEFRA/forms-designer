import { Roles } from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors } from '~/src/lib/utils.js'
import {
  getDescriptionForRole,
  getNameForRole
} from '~/src/models/account/role-mapper.js'
import { GOVUK_LABEL__M } from '~/src/models/forms/editor-v2/common.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/constants.js'

const editUrl = '/manage/users/'
const MANAGE_USERS_TEXT = 'Manage users'

export function getTabs() {
  return [
    {
      text: 'My account',
      url: '/auth/account',
      isActive: false
    },
    {
      text: MANAGE_USERS_TEXT,
      url: editUrl,
      isActive: true
    },
    {
      text: 'Admin tools',
      url: '/admin/index',
      isActive: false
    },
    {
      text: 'Support',
      url: `/${WebsiteLevel1Routes.SUPPORT}`,
      isActive: false
    }
  ]
}

/**
 * @param { EntitlementUser | undefined } user
 * @param { boolean } hideSuperadmin
 * @param {ValidationFailure<ManageUser>} [validation]
 */
export function createOrEditUserViewModel(user, hideSuperadmin, validation) {
  const { formValues, formErrors } = validation ?? {}
  const [role] = user?.roles ?? []
  const filter = (/** @type {Roles} */ r) =>
    hideSuperadmin ? r !== Roles.Superadmin : true

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
        items: Object.values(Roles)
          .filter(filter)
          .map((r) => ({
            text: getNameForRole(r),
            value: r,
            hint: {
              text: getDescriptionForRole(r)
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
 * @param {EntitlementUser} a
 * @param {EntitlementUser} b
 */
export function sortByName(a, b) {
  const [aFirstName, aLastFirst] = a.displayName.split(' ')
  const [bFirstName, bLastFirst] = b.displayName.split(' ')
  return `${aLastFirst} ${aFirstName}`.localeCompare(
    `${bLastFirst} ${bFirstName}`
  )
}

/**
 * @param {EntitlementUser[]} users
 * @param {string[]} [notification]
 */
export function listUsersViewModel(users, notification) {
  const rows = users
    .toSorted((a, b) => sortByName(a, b))
    .map((user) => [
      {
        html: `${user.displayName}<span class="govuk-visually-hidden">User: ${user.displayName}</span><br><span class="govuk-hint" aria-hidden="true"> ${user.email} </span>`
      },
      {
        text: user.roles.map((role) => getNameForRole(role)).join(', ')
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
 * @import { EntitlementUser, ManageUser } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
