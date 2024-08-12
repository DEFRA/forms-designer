import React, { type FunctionComponent, type SVGAttributes } from 'react'

export type Props = SVGAttributes<SVGSVGElement>

export const FileUploadIcon: FunctionComponent<Props> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 20 20"
      focusable="false"
      role="img"
      aria-labelledby="fileUploadIconLabel"
      className="file-upload__icon"
      {...props}
    >
      <title aria-labelledby="fileUploadIconLabel">file upload</title>
      <path d="M10 14.864a1.19 1.19 0 0 1-.89-.37c-.24-.246-.36-.55-.36-.915V4.4L6.406 6.805c-.25.257-.541.385-.875.385-.333 0-.635-.14-.906-.417a1.211 1.211 0 0 1-.359-.916c.01-.353.13-.647.359-.882l4.5-4.623c.125-.128.26-.22.406-.273A1.36 1.36 0 0 1 10 0c.167 0 .323.027.469.08.146.054.281.145.406.273l4.5 4.623c.25.257.37.562.359.914a1.27 1.27 0 0 1-.359.884c-.25.256-.547.39-.89.4a1.146 1.146 0 0 1-.891-.368L11.25 4.398v9.181c0 .364-.12.669-.359.915-.24.246-.537.37-.891.37ZM2.5 20a2.375 2.375 0 0 1-1.765-.754A2.508 2.508 0 0 1 0 17.432v-2.568c0-.364.12-.67.359-.916.24-.246.537-.369.891-.369s.651.123.891.369.359.552.359.916v2.568h15v-2.568c0-.364.12-.67.36-.916s.536-.369.89-.369.65.123.89.369.36.552.36.916v2.568a2.51 2.51 0 0 1-.734 1.814c-.49.503-1.078.754-1.766.754h-15Z" />
    </svg>
  )
}
