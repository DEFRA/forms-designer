import {
  ComponentType,
  QuestionRenderer,
  SchemaVersion,
  type ComponentDef,
  type FormDefinition,
  type Page,
  type Question,
  type QuestionElements
} from '@defra/forms-model'

export type FetchClientInterface = (def: FormDefinition) => Promise<string>

const RENDER_ENDPOINT =
  'http://localhost:3009/preview/live/register-as-a-unicorn-breeder/whats-your-email-address'

export class FormsEngineRenderer extends QuestionRenderer {
  constructor(
    private _previewElements: QuestionElements,
    private _fetchClient: FetchClientInterface,
    private _endpoint: string = RENDER_ENDPOINT
  ) {
    super()
  }

  getFormDefinition(question: Question): FormDefinition {
    const component: ComponentDef = {
      id: 'f9494547-6f57-4231-a25d-733024892344',
      name: 'ABCDe',
      title: question.titleText,
      type: ComponentType.TextField,
      schema: {},
      options: {}
    }

    const page: Page = {
      title: question.titleText,
      path: 'page-one',
      id: '17b07fb3-7443-40a3-be2c-279ad4ce1bd4',
      next: [],
      components: [component]
    }
    const formDefinition: FormDefinition = {
      pages: [page],
      conditions: [],
      lists: [],
      sections: [],
      schema: SchemaVersion.V2
    }
    return formDefinition
  }

  render(question: Question) {
    this._fetchClient(this.getFormDefinition(question))
      .then((response) => {
        this._previewElements.setPreviewHTML(response)

        return response
      })
      .catch((err: unknown) => {
        throw err
      })
  }
}
