import config from '../../../config'
import { buildNavigation } from './build-navigation'

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
        text: 'Form Builder',
        url: `${appPathPrefix}/app`
      }
    ])
  })

  test.each([
    {
      text: 'Home',
      url: appPathPrefix
    },
    {
      text: 'Form Builder',
      url: `${appPathPrefix}/app`
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
