import config from '~/src/config.js'
import { downloadCompleteModel } from '~/src/models/file/download-complete.js'

jest.mock('~/src/config.ts')

const localAppBaseUrl = 'http://localhost:3000'
const hostDockerInternalDownloadUrl =
  'http://host.docker.internal:4566/my-bucket/test-file.txt'
const localstackDownloadUrl = 'http://localstack:4566/my-bucket/test-file.txt'
const zeroAddressDownloadUrl = 'http://0.0.0.0:4566/my-bucket/test-file.txt'
const localhostDownloadUrl = 'http://localhost:4566/my-bucket/test-file.txt'
const externalDownloadUrl = 'http://example.com/my-bucket/test-file.txt'
const pageTitle = 'Your file is downloading'
const buttonText = 'Download file'

function buildExpectedLocalhostDownloadModel() {
  return {
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    downloadUrl: localhostDownloadUrl,
    buttonText
  }
}

describe('download complete model', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('rewrites host.docker.internal download URLs to localhost when running locally', () => {
    jest.mocked(config).appBaseUrl = localAppBaseUrl

    const result = downloadCompleteModel(hostDockerInternalDownloadUrl)

    expect(result).toEqual(buildExpectedLocalhostDownloadModel())
  })

  test('rewrites localstack download URLs to localhost when running locally', () => {
    jest.mocked(config).appBaseUrl = localAppBaseUrl

    const result = downloadCompleteModel(localstackDownloadUrl)

    expect(result).toEqual(buildExpectedLocalhostDownloadModel())
  })

  test('rewrites 0.0.0.0 download URLs to localhost when running locally', () => {
    jest.mocked(config).appBaseUrl = localAppBaseUrl

    const result = downloadCompleteModel(zeroAddressDownloadUrl)

    expect(result).toEqual(buildExpectedLocalhostDownloadModel())
  })

  test('does not rewrite internal Docker URLs when not running locally', () => {
    jest.mocked(config).appBaseUrl = 'https://forms.defra.gov.uk'

    const result = downloadCompleteModel(localstackDownloadUrl)

    expect(result).toEqual({
      pageTitle,
      pageHeading: {
        text: pageTitle,
        size: 'large'
      },
      downloadUrl: localstackDownloadUrl,
      buttonText
    })
  })

  test('does not rewrite external download URLs when running locally', () => {
    jest.mocked(config).appBaseUrl = localAppBaseUrl

    const result = downloadCompleteModel(externalDownloadUrl)

    expect(result).toEqual({
      pageTitle,
      pageHeading: {
        text: pageTitle,
        size: 'large'
      },
      downloadUrl: externalDownloadUrl,
      buttonText
    })
  })

  test('does not rewrite download URLs when APP_BASE_URL is invalid', () => {
    jest.mocked(config).appBaseUrl = 'not-a-valid-url'

    const result = downloadCompleteModel(localstackDownloadUrl)

    expect(result).toEqual({
      pageTitle,
      pageHeading: {
        text: pageTitle,
        size: 'large'
      },
      downloadUrl: localstackDownloadUrl,
      buttonText
    })
  })

  test('returns the original download URL when it cannot be parsed', () => {
    jest.mocked(config).appBaseUrl = localAppBaseUrl

    const invalidDownloadUrl = 'http://%'
    const result = downloadCompleteModel(invalidDownloadUrl)

    expect(result).toEqual({
      pageTitle,
      pageHeading: {
        text: pageTitle,
        size: 'large'
      },
      downloadUrl: invalidDownloadUrl,
      buttonText
    })
  })

  test('returns an undefined downloadUrl when one is not provided', () => {
    jest.mocked(config).appBaseUrl = localAppBaseUrl

    const result = downloadCompleteModel()

    expect(result.pageTitle).toBe(pageTitle)
    expect(result.pageHeading).toEqual({
      text: pageTitle,
      size: 'large'
    })
    expect(result.downloadUrl).toBeUndefined()
    expect(result.buttonText).toBe(buttonText)
  })
})
