import account from '~/src/routes/account/account.js'
import auth from '~/src/routes/account/auth.js'
import signOut from '~/src/routes/account/sign-out.js'
import signedOut from '~/src/routes/account/signed-out.js'

export default [account, auth, signOut, signedOut].flat()
