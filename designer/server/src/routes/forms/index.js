import api from '~/src/routes/forms/api.js'
import contactEmail from '~/src/routes/forms/contact/email.js'
import contactOnline from '~/src/routes/forms/contact/online.js'
import contactPhone from '~/src/routes/forms/contact/phone.js'
import create from '~/src/routes/forms/create.js'
import edit from '~/src/routes/forms/edit.js'
import formLifecycle from '~/src/routes/forms/form-lifecycle.js'
import library from '~/src/routes/forms/library.js'
import privacyNotice from '~/src/routes/forms/privacy-notice.js'

export default [
  api,
  create,
  edit,
  library,
  formLifecycle,
  privacyNotice,
  contactPhone,
  contactEmail,
  contactOnline
].flat()
