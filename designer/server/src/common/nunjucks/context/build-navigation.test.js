import { buildNavigation } from '~/src/common/nunjucks/context/build-navigation.js'

const mockRequest = ({ path = '' } = {}) => ({
  path
})

describe('#buildNavigation', () => {
  test('Should provide expected navigation details', () => {
    expect(buildNavigation(mockRequest())).toEqual([
      {
        isActive: false,
        text: 'Home',
        url: '/'
      },
      {
        isActive: false,
        text: 'Forms library',
        url: '/library'
      }
    ])
  })

  test.each([
    {
      text: 'Home',
      url: '/'
    },
    {
      text: 'Forms library',
      url: '/library'
    }
  ])('Should provide expected highlighted navigation details', (fixture) => {
    expect(buildNavigation(mockRequest({ path: fixture.url }))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          isActive: true,
          text: fixture.text,
          url: fixture.url
        })
      ])
    )
  })
})
