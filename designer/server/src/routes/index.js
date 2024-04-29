import api from './api.js'
import assets from './assets.js'
import auth from './auth.js'
import create from './create.js'
import editor from './editor.js'
import help from './help.js'
import home from './home.js'
import library from './library.js'
import login from './login.js'
import logout from './logout.js'

export default [
  api,
  auth,
  create,
  editor,
  login,
  logout,
  home,
  help,
  assets,
  library
].flat()
