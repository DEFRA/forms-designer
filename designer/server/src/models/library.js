import * as forms from '~/src/lib/forms.js'

export async function listLibraryViewModel() {
  const list = await forms.list()
  const pageTitle = 'Forms library'
  const head = [{ text: 'Name' }, { text: 'Last updated' }, { text: 'Actions' }]
  const rows = list.map((form) => [
    { text: form.title },
    { text: '9 Apr 2024' },
    {
      html: `<a href="/editor/${form.id}" role="button" draggable="false" class="govuk-button" data-module="govuk-button">Edit</a>`
    }
  ])

  return { pageTitle, head, rows }
}
