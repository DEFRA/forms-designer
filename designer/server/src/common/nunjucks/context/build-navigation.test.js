import config from '../../../config'
import { buildNavigation } from './build-navigation'

const appPathPrefix = config.appPathPrefix
const mockRequest = ({ path = '' } = {}) => ({
  path
})

describe('#buildNavigation', () => {
  test('Should provide expected navigation details', async () => {
    expect(await buildNavigation(mockRequest())).toEqual([
      {
        isActive: false,
        text: 'Home',
        url: appPathPrefix
      }
    ])
  })
  test('Should provide expected highlighted navigation details', async () => {
    expect(await buildNavigation(mockRequest({ path: appPathPrefix }))).toEqual(
      [
        {
          isActive: true,
          text: 'Home',
          url: appPathPrefix
        }
      ]
    )
  })
})
