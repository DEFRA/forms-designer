import { buildNavigation } from '~/src/common/nunjucks/context/build-navigation.js'

const mockRequest = ({ path = '' } = {}) => ({
  path
})

describe('#buildNavigation', () => {
  it('should provide expected navigation details', () => {
    expect(buildNavigation(mockRequest())).toEqual([
      {
        isActive: false,
        text: 'Forms library',
        url: '/library'
      },
      {
        isActive: false,
        text: 'About',
        url: '/about'
      },
      {
        isActive: false,
        text: 'Get started',
        url: '/get-started'
      },
      {
        isActive: false,
        text: 'Features',
        url: '/features'
      },
      {
        isActive: false,
        text: 'Resources',
        url: '/resources'
      },
      {
        isActive: false,
        text: 'Support',
        url: '/support'
      }
    ])
  })

  it.each([
    {
      path: '/',
      entries: [
        {
          text: 'Forms library',
          url: '/library',
          isActive: false
        }
      ]
    },
    {
      path: '/library',
      entries: [
        {
          text: 'Forms library',
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
      path: '/about',
      entries: [
        {
          text: 'About',
          url: '/about',
          isActive: true
        }
      ]
    },
    {
      path: '/get-started',
      entries: [
        {
          text: 'Get started',
          url: '/get-started',
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
    },
    {
      path: '/resources',
      entries: [
        {
          text: 'Resources',
          url: '/resources',
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
