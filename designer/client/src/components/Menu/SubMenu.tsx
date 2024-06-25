import { type FormDefinition } from '@defra/forms-model'
import React, {
  useContext,
  useRef,
  type ChangeEvent,
  type MouseEvent
} from 'react'

import { logger } from '~/src/common/helpers/logging/logger.js'
import { DataContext } from '~/src/context/DataContext.js'

interface Props {
  slug: string
}

export function SubMenu({ slug }: Props) {
  const { data, save } = useContext(DataContext)
  const fileInput = useRef<HTMLInputElement>(null)

  function onClickUpload() {
    fileInput.current?.click()
  }

  function onClickDownload(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    const link = document.createElement('a')
    const contents = JSON.stringify(data, undefined, 2)

    link.download = `${slug}.json`
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
    <div className="menu__row">
      <button className="govuk-link submenu__link" onClick={onClickUpload}>
        Import saved form
      </button>
      <button className="govuk-link submenu__link" onClick={onClickDownload}>
        Download form
      </button>
      <input
        ref={fileInput}
        type="file"
        hidden
        onChange={onFileUpload}
        aria-label="Import saved form"
      />
    </div>
  )
}
