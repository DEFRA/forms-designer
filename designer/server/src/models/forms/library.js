import * as forms from '~/src/lib/forms.js'

export async function listViewModel() {
  const pageTitle = 'Forms library'
  const formItems = await forms.list()

  return { pageTitle, formItems }
}
