import { type ServerRoute } from '@hapi/hapi'
import { nanoid } from 'nanoid'

import newFormJson from '~/src/common/new-form.json' with { type: 'json' }
import config from '~/src/config.js'
import { publish } from '~/src/lib/publish/index.js'

export const registerNewFormWithRunner: ServerRoute = {
  method: 'post',
  path: '/api/new',
  options: {
    async handler(request, h) {
      const { persistenceService } = request.services([])
      const { selected, name } = request.payload

      if (name && name !== '' && !name.match(/^[a-zA-Z0-9 _-]+$/)) {
        return h
          .response('Form name should not contain special characters')
          .type('application/json')
          .code(400)
      }

      const newName = name === '' ? nanoid(10) : name

      try {
        if (selected.Key === 'New') {
          await publish(newName, newFormJson)
        } else {
          await persistenceService.copyConfiguration(`${selected.Key}`, newName)
        }
      } catch (e) {
        request.logger.error(e)
        return h
          .response('Designer could not connect to runner instance.')
          .type('text/plain')
          .code(401)
      }

      const response = JSON.stringify({
        id: `${newName}`,
        previewUrl: config.previewUrl
      })
      return h.response(response).type('application/json').code(200)
    }
  }
}
