import { hasAdminRole } from '~/src/common/helpers/auth/get-user-session.js'
import config from '~/src/config.js'
import {
  accountViewModel,
  signInViewModel,
  signedOutViewModel
} from '~/src/models/account/auth.js'
import { Roles } from '~/src/models/account/role-mapper.js'

jest.mock('~/src/common/helpers/auth/get-user-session.js')
jest.mock('~/src/config.ts')

describe('Auth view models', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(config).serviceName = 'Forms Designer'
  })

  describe('signedOutViewModel', () => {
    test('should return correct view model for signed out page', () => {
      const result = signedOutViewModel()

      expect(result).toEqual({
        pageTitle: 'You have signed out',
        pageHeading: {
          text: 'You have signed out',
          size: 'large'
        }
      })
    })
  })

  describe('signInViewModel', () => {
    test('should return correct view model without errors', () => {
      const result = signInViewModel()

      expect(result).toEqual({
        pageTitle: 'Sign in to Forms Designer',
        pageHeading: {
          text: 'Sign in to Forms Designer',
          size: 'large'
        },
        errorList: []
      })
    })

    test('should return correct view model with failed authorisation error', () => {
      const result = signInViewModel({ hasFailedAuthorisation: true })

      expect(result).toEqual({
        pageTitle: 'Sign in to Forms Designer',
        pageHeading: {
          text: 'Sign in to Forms Designer',
          size: 'large'
        },
        errorList: [
          {
            html: `We could not sign you in. Please contact the system administrator for help,
      <a href="mailto:steven.thomas@defra.gov.uk" class="govuk-link">steven.thomas@defra.gov.uk</a>`
          }
        ]
      })
    })

    test('should return correct view model when hasFailedAuthorisation is false', () => {
      const result = signInViewModel({ hasFailedAuthorisation: false })

      expect(result).toEqual({
        pageTitle: 'Sign in to Forms Designer',
        pageHeading: {
          text: 'Sign in to Forms Designer',
          size: 'large'
        },
        errorList: []
      })
    })
  })

  describe('accountViewModel', () => {
    const mockUser = {
      userId: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      roles: [Roles.FormCreator],
      scopes: []
    }

    test('should return correct view model for non-admin user', () => {
      jest.mocked(hasAdminRole).mockReturnValue(false)

      const result = accountViewModel(mockUser)

      expect(result).toEqual({
        navigation: [
          {
            text: 'My account',
            url: '/auth/account',
            isActive: true
          }
        ],
        pageTitle: 'My account',
        pageHeading: {
          text: 'My account',
          size: 'large'
        },
        pageCaption: {
          text: 'Test User'
        },
        backLink: {
          text: 'Back to form library',
          href: '/library'
        },
        userDetails: {
          rows: [
            {
              key: {
                text: 'Email'
              },
              value: {
                text: 'test@example.com'
              }
            },
            {
              key: {
                text: 'Role'
              },
              value: {
                text: 'Form creator'
              }
            }
          ]
        },
        user: mockUser
      })
    })

    test('should return correct view model for admin user', () => {
      jest.mocked(hasAdminRole).mockReturnValue(true)

      const adminUser = {
        ...mockUser,
        roles: [Roles.Admin]
      }

      const result = accountViewModel(adminUser)

      expect(result.navigation).toEqual([
        {
          text: 'My account',
          url: '/auth/account',
          isActive: true
        },
        {
          text: 'Manage users',
          url: '/manage/users',
          isActive: false
        }
      ])

      expect(result.userDetails.rows[1].value.text).toBe('Admin')
    })

    test('should handle user with multiple roles', () => {
      jest.mocked(hasAdminRole).mockReturnValue(true)

      const multiRoleUser = {
        ...mockUser,
        roles: [Roles.Admin, Roles.FormCreator]
      }

      const result = accountViewModel(multiRoleUser)

      expect(result.userDetails.rows[1].value.text).toBe('Admin, Form creator')
    })
  })
})
