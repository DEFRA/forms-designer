import account from '~/src/routes/account/index.js'
import assets from '~/src/routes/assets.js'
import forms from '~/src/routes/forms/index.js'
import health from '~/src/routes/health.js'
import help from '~/src/routes/help.js'
import home from '~/src/routes/home.js'

export default [account, assets, forms, health, home, help].flat()
