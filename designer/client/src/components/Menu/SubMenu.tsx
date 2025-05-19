import { type FormDefinition } from '@defra/forms-model'
import { useContext, useRef, type ChangeEvent, type MouseEvent } from 'react'

import { logger } from '~/src/common/helpers/logging/logger.js'
import { type MenuItemHook } from '~/src/components/Menu/useMenuItem.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { i18n } from '~/src/i18n/i18n.jsx'

interface Props {
  overview: MenuItemHook
}

export function SubMenu({ overview }: Readonly<Props>) {
  const { data, meta, previewUrl, save } = useContext(DataContext)
  const fileInput = useRef<HTMLInputElement>(null)

  const { href: formPreviewLink } = new URL(
    `/form/preview/draft/${meta.slug}`,
    previewUrl
  )

  function onClickUpload() {
    fileInput.current?.click()
  }

  function onClickDownload(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    const link = document.createElement('a')
    const contents = JSON.stringify(data, undefined, 2)

    link.download = `${meta.slug}.json`
    link.href = `data:text/json;charset=utf-8,${encodeURIComponent(contents)}`

    document.body.appendChild(link)

    link.click()
    link.remove()
  }

  function onFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const { files } = e.target

    if (!files?.length) {
      logger.warn('Upload file not found')
      return
    }

    const reader = new window.FileReader()
    reader.addEventListener('load', onFileUploaded)
    reader.readAsText(files[0], 'UTF-8')
  }

  function onFileUploaded(e: ProgressEvent<FileReader>) {
    const { result } = e.target ?? {}
    const { current: input } = fileInput

    // Default filename for logging
    let filename = 'file'

    // Update filename and reset input for next upload
    if (input?.files?.length) {
      filename += ` '${input.files[0].name}'`
      input.value = ''
    }

    if (typeof result !== 'string') {
      logger.warn(`Upload ${filename} contents must be a string`)
      return
    }

    let definition: FormDefinition | undefined

    try {
      definition = JSON.parse(result) as FormDefinition
    } catch (error: unknown) {
      logger.error(error, `Upload ${filename} contents invalid`)
      return
    }

    save(definition).catch((error: unknown) =>
      logger.error(error, `Upload ${filename} failed`)
    )
  }

  return (
    <div className="govuk-button-group">
      <button
        className="govuk-link govuk-!-font-size-16"
        type="button"
        onClick={onClickUpload}
      >
        {i18n('menu.upload')}
      </button>
      <button
        className="govuk-link govuk-!-font-size-16"
        type="button"
        onClick={onClickDownload}
      >
        {i18n('menu.download')}
      </button>
      <button
        className="govuk-link govuk-!-font-size-16"
        type="button"
        onClick={overview.show}
      >
        {i18n('menu.overview')}
      </button>
      <a
        href={formPreviewLink}
        target="_blank"
        rel="noreferrer noopener"
        className="govuk-link govuk-link--no-visited-state govuk-!-font-size-16"
      >
        {i18n('menu.preview')}
      </a>
      <input
        ref={fileInput}
        type="file"
        hidden
        onChange={onFileUpload}
        aria-label={i18n('menu.uploadFile')}
      />
    </div>
  )
}
