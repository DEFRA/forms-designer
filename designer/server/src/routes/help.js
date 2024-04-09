import joi from 'joi'

export default {
  method: 'GET',
  path: '/help/{filename}',
  handler: function (request, h) {
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
