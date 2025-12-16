import account from '~/src/routes/account/index.js'
import admin from '~/src/routes/admin/index.js'
import assets from '~/src/routes/assets.js'
import file from '~/src/routes/file/file.js'
import forms from '~/src/routes/forms/index.js'
import health from '~/src/routes/health.js'
import help from '~/src/routes/help.js'
import home from '~/src/routes/home.js'
import manage from '~/src/routes/manage/index.js'
import website from '~/src/routes/website/index.js'

export default [
  account,
  admin,
  assets,
  forms,
  health,
  home,
  help,
  file,
  manage,
  website
].flat()
