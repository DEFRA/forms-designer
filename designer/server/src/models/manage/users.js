const editUrl = '/manage/users/'

export function getTabs() {
  return [
    {
      text: 'My account',
      Url: '/account',
      isActive: false
    },
    {
      text: 'Manage users',
      Url: '/manage/users',
      isActive: true
    }
  ]
}

/**
 * @param {string} role
 */
export function mapRoleName(role) {
  if (role === 'admin') {
    return 'Admin'
  }
  if (role === 'form-creator') {
    return 'Form creator'
  }
  return 'Unknown'
}

/**
 * @param {EntitlementUser[]} users
 */
export function usersViewModel(users) {
  const rows = users.map((user) => [
    {
      html: `${user.fullName}<span class="govuk-visually-hidden">User: ${user.fullName}</span><br><span class="govuk-hint" aria-hidden="true"> ${user.emailAddress} </span>`
    },
    {
      text: user.roles.map(mapRoleName).join(', ')
    },
    {
      html: `<a class="govuk-link govuk-link--no-visited-state" href="${editUrl}${user.userId}">Manage</a>`
    }
  ])

  return {
    pageTitle: 'Manage users',
    navigation: getTabs(),
    backLink: {
      text: 'Back to form library',
      href: '/library'
    },
    pageHeading: {
      text: 'Manage users',
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
    }
  }
}

/**
 * @import {EntitlementUser} from '@defra/forms-model'
 */
