import { buildNavigation } from '~/src/common/nunjucks/context/build-navigation.js'

const mockRequest = ({ path = '' } = {}) => ({
  path
})

describe('#buildNavigation', () => {
  test('Should provide expected navigation details', () => {
    expect(buildNavigation(mockRequest())).toEqual([
      {
        isActive: false,
        text: 'Forms library',
        url: '/library'
      }
    ])
  })

  test.each([
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
    }
  ])(
    'Should provide expected highlighted navigation details',
    ({ path, entries }) => {
      expect(buildNavigation(mockRequest({ path }))).toEqual(
        expect.arrayContaining(entries)
      )
    }
  )
})
