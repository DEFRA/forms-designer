import { buildNavigation } from '~/src/common/nunjucks/context/build-navigation.js'

const mockRequest = ({ path = '' } = {}) => ({
  path
})

describe('build-navigation', () => {
  describe('#buildNavigation', () => {
    it('should provide expected navigation details', () => {
      expect(buildNavigation(mockRequest())).toEqual([
        {
          text: 'Home',
          url: '/library',
          isActive: false
        },
        {
          text: 'Features',
          url: '/features',
          isActive: false
        },
        {
          text: 'Making a form',
          url: '/making-a-form',
          isActive: false
        },
        {
          text: 'Support',
          url: '/support',
          isActive: false
        }
      ])
    })

    it('should provide expected navigation details on /features', () => {
      expect(buildNavigation(mockRequest({ path: '/features' }))).toEqual([
        {
          text: 'Home',
          url: '/library',
          isActive: false
        },
        {
          text: 'Features',
          url: '/features',
          isActive: true
        },
        {
          text: 'Making a form',
          url: '/making-a-form',
          isActive: false
        },
        {
          text: 'Support',
          url: '/support',
          isActive: false
        }
      ])
    })

    it.each([
      {
        path: '/',
        entries: [
          {
            text: 'Home',
            url: '/library',
            isActive: false
          }
        ]
      },
      {
        path: '/library',
        entries: [
          {
            text: 'Home',
            url: '/library',
            isActive: true
          }
        ]
      },
      {
        path: '/support',
        entries: [
          {
            text: 'Support',
            url: '/support',
            isActive: true
          }
        ]
      },
      {
        path: '/features',
        entries: [
          {
            text: 'Features',
            url: '/features',
            isActive: true
          }
        ]
      }
    ])(
      'should provide expected highlighted navigation details',
      ({ path, entries }) => {
        expect(buildNavigation(mockRequest({ path }))).toEqual(
          expect.arrayContaining(entries)
        )
      }
    )
  })
})
