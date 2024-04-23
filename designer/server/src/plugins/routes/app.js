import JSZip from 'jszip'

import config from '~/src/config.js'

/**
 * @type {ServerRoute}
 */
export const getAppChildRoutes = {
  method: 'get',
  path: '/editor/{path*}',
  options: {
    handler(request, h) {
      return h.view('editor', {
        phase: config.phase,
        previewUrl: config.previewUrl
      })
    }
  }
}

/**
 * @type {ServerRoute}
 */
export const getErrorCrashReport = {
  method: 'get',
  path: '/error/crashreport/{id}',
  options: {
    async handler(request, h) {
      try {
        const { id } = request.params
        const error = request.yar.get(`error-summary-${id}`)
        const zip = new JSZip()
        zip.file(`${id}-crash-report.json`, JSON.stringify(error))
        const buffer = await zip.generateAsync({
          type: 'nodebuffer',
          compression: 'DEFLATE'
        })
        return h
          .response(buffer)
          .encoding('binary')
          .type('application/zip')
          .header(
            'content-disposition',
            `attachment; filename=${id}-crash-report.zip`
          )
      } catch (err) {
        request.logger.error('Error while generating crash report:', err)
        return h
          .response(Buffer.from('Error while generating crash report'))
          .encoding('binary')
          .type('text/plain')
          .header(
            'content-disposition',
            `attachment; filename=error-${new Date().toISOString()}.txt;`
          )
      }
    }
  }
}

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
