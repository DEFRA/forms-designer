import React, { useContext, useRef } from 'react'

import { DataContext } from '~/src/context/DataContext.js'

interface Props {
  id?: string
}

export function SubMenu({ id }: Props) {
  const { data, save } = useContext(DataContext)
  const fileInput = useRef<HTMLInputElement>(null)

  const onClickUpload = () => {
    fileInput.current?.click()
  }

  const onClickDownload = (e) => {
    e.preventDefault()
    const encodedData = `text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`
    const link = document.createElement('a')
    link.download = `${id}.json`
    link.href = `data:${encodedData}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const onFileUpload = (e) => {
    const file = e.target.files.item(0)
    const reader = new window.FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = function (evt) {
      const content = JSON.parse(evt.target.result)
      save(content)
    }
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
