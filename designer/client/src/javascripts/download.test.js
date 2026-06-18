import { init } from '~/src/javascripts/download.js'

describe('Download Client JS', () => {
  const email = 'enrique.chase@defra.gov.uk'
  const referenceNumber = 'ARM-WJ6-7VJ'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('download all files', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-two-thirds">
              <button type="submit" class="govuk-button js-show" data-module="govuk-button" id="download-all">Download all files</button>
              <dl class="govuk-summary-list" id="download-all-list">
                <div class="govuk-summary-list__row">
                  <dt class="govuk-summary-list__key">file1.jpeg</dt>
                  <dd class="govuk-summary-list__value">Your supporting evidence
                    <strong id="downloaded-tag-2463de4a-4851-4b6b-ae5d-73cb410bf9b5" class="govuk-tag govuk-tag--green pull-right app-hidden">Downloaded</strong>
                    <strong id="downloading-tag-2463de4a-4851-4b6b-ae5d-73cb410bf9b5" class="govuk-tag govuk-tag--yellow pull-right app-hidden">Downloading</strong>
                  </dd>
                  <dd class="govuk-summary-list__actions app-summary-list__actions--narrow">
                    <a class="govuk-link" href="/file-download/2463de4a-4851-4b6b-ae5d-73cb410bf9b5" data-fileid="2463de4a-4851-4b6b-ae5d-73cb410bf9b5">Download<span class="govuk-visually-hidden">Download file file1.jpeg for component Your supporting evidence</span></a>
                  </dd>
                </div>
                <div class="govuk-summary-list__row">
                  <dt class="govuk-summary-list__key">file2.jpeg</dt>
                  <dd class="govuk-summary-list__value">Your supporting evidence
                    <strong id="downloaded-tag-68308e75-ab02-46b9-89ad-e81a08e72736" class="govuk-tag govuk-tag--green pull-right app-hidden">Downloaded</strong>
                    <strong id="downloading-tag-68308e75-ab02-46b9-89ad-e81a08e72736" class="govuk-tag govuk-tag--yellow pull-right app-hidden">Downloading</strong>
                  </dd>
                  <dd class="govuk-summary-list__actions app-summary-list__actions--narrow">
                    <a class="govuk-link" href="/file-download/68308e75-ab02-46b9-89ad-e81a08e72736" data-fileid="68308e75-ab02-46b9-89ad-e81a08e72736">Download<span class="govuk-visually-hidden"> Download file file2.jpeg for component Your supporting evidence</span></a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        `
    })

    function initDownload() {
      const downloadAllBtn = document.getElementById('download-all')
      if (!downloadAllBtn || !(downloadAllBtn instanceof HTMLButtonElement)) {
        throw new Error('Download all button not found in the DOM')
      }

      const summaryList = document.getElementById('download-all-list')
      if (!summaryList || !(summaryList instanceof HTMLDListElement)) {
        throw new Error('Summary list not found in the DOM')
      }

      expect(downloadAllBtn).toBeInTheDocument()
      expect(summaryList).toBeInTheDocument()

      const downloadAllBtnClickListener = jest.spyOn(
        downloadAllBtn,
        'addEventListener'
      )
      const summaryListClickListener = jest.spyOn(
        summaryList,
        'addEventListener'
      )

      expect(() => init(email, referenceNumber)).not.toThrow()

      expect(downloadAllBtnClickListener).toHaveBeenCalledTimes(1)
      expect(downloadAllBtnClickListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        false
      )

      expect(summaryListClickListener).toHaveBeenCalledTimes(1)
      expect(summaryListClickListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        false
      )

      const onClickDownloadAll = downloadAllBtnClickListener.mock.calls[0][1]
      const onClickDownloadFileLink = summaryListClickListener.mock.calls[0][1]

      return {
        onClickDownloadAll,
        onClickDownloadFileLink,
        downloadAllBtn,
        summaryList
      }
    }

    describe('initialisation', () => {
      test('it initialises without errors when DOM elements are present', () => {
        const {
          onClickDownloadAll,
          onClickDownloadFileLink,
          downloadAllBtn,
          summaryList
        } = initDownload()

        expect(typeof onClickDownloadAll).toBe('function')
        expect(typeof onClickDownloadFileLink).toBe('function')
        expect(downloadAllBtn).toBeDefined()
        expect(summaryList).toBeDefined()
      })

      test('it downloads files when the download all button is clicked', async () => {
        const { onClickDownloadAll, downloadAllBtn } = initDownload()

        jest
          .spyOn(global, 'fetch')
          // @ts-expect-error - Response type
          .mockImplementation(() =>
            Promise.resolve({
              ok: true,
              json: () =>
                Promise.resolve({
                  url: 'http://example.com/file',
                  fileName: 'file.jpeg'
                })
            })
          )

        expect(typeof onClickDownloadAll).toBe('function')
        if (!(typeof onClickDownloadAll === 'function')) {
          throw new Error('Download all button not found in the DOM')
        }

        // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
        await onClickDownloadAll.call(downloadAllBtn, new MouseEvent('click'))

        expect(global.fetch).toHaveBeenCalledTimes(2)
        expect(global.fetch).toHaveBeenNthCalledWith(
          1,
          '/file-download/2463de4a-4851-4b6b-ae5d-73cb410bf9b5',
          {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          }
        )
        expect(global.fetch).toHaveBeenNthCalledWith(
          2,
          '/file-download/68308e75-ab02-46b9-89ad-e81a08e72736',
          {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          }
        )
      })

      test('it downloads a single files when the download link is clicked', () => {
        const { onClickDownloadFileLink, summaryList } = initDownload()

        jest
          .spyOn(global, 'fetch')
          // @ts-expect-error - Response type
          .mockImplementation(() =>
            Promise.resolve({
              json: () =>
                Promise.resolve({
                  url: 'http://example.com/file',
                  fileName: 'file.jpeg'
                })
            })
          )

        expect(typeof onClickDownloadFileLink).toBe('function')

        const firstFileLink = summaryList.querySelector(
          '.app-summary-list__actions--narrow a'
        )
        if (!firstFileLink || !(firstFileLink instanceof HTMLAnchorElement)) {
          throw new Error('First file link not found in the DOM')
        }
        firstFileLink.click()

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toHaveBeenCalledWith(
          '/file-download/2463de4a-4851-4b6b-ae5d-73cb410bf9b5',
          {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          }
        )
      })
    })
  })
})
