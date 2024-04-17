import { buildNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import config from '~/src/config.js'

const appPathPrefix = config.appPathPrefix
const mockRequest = ({ path = '' } = {}) => ({
  path
})

describe('#buildNavigation', () => {
  test('Should provide expected navigation details', () => {
    expect(buildNavigation(mockRequest())).toEqual([
      {
        isActive: false,
        text: 'Home',
        url: appPathPrefix
      },
      {
        isActive: false,
        text: 'Forms library',
        url: `${appPathPrefix}/library`
      }
    ])
  })

  test.each([
    {
      text: 'Home',
      url: appPathPrefix
    },
    {
      text: 'Forms library',
      url: `${appPathPrefix}/library`
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
