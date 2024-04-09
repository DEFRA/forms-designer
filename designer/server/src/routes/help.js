import joi from 'joi'

/**
 * @type {ServerRoute}
 */
export default {
  method: 'GET',
  path: '/help/{filename}',
  handler(request, h) {
    return h.view(`help/${request.params.filename}`)
  },
  options: {
    auth: {
      mode: 'try'
    },
    validate: {
      params: joi.object().keys({
        filename: joi.string().required()
      })
    }
  }
}

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
