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

    const reader = new window.FileReader()
    reader.addEventListener('load', onFileUploaded)
    reader.readAsText(files[0], 'UTF-8')
  }

  function onFileUploaded(e: ProgressEvent<FileReader>) {
    const { result } = e.target ?? {}
    const content = JSON.parse(result) as FormDefinition
    save(content)
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
