import api from '~/src/routes/forms/api.js'
import create from '~/src/routes/forms/create.js'
import formLifecycle from '~/src/routes/forms/form-lifecycle.js'
import library from '~/src/routes/forms/library.js'

export default [api, create, library, formLifecycle].flat()
