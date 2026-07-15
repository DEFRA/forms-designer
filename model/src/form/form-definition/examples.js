import {
  buildRadiosComponent,
  buildTextFieldComponent
} from '~/src/__stubs__/components.js'
import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import { buildQuestionPage, buildSummaryPage } from '~/src/__stubs__/pages.js'

export const formDefinitionWithSinglePage = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'c1',
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'c2'
    })
  ]
})

export const formDefinitionWithoutSummary = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'c1',
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text'
        })
      ],
      next: [{ path: '/summary' }]
    })
  ]
})

export const formDefinitionWithTwoQuestions = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'q1',
          name: 'textField',
          title: 'This is your first question',
          hint: 'Help text'
        }),
        buildTextFieldComponent({
          id: 'q2',
          name: 'textField',
          title: 'This is your second question',
          hint: 'Help text'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'p2'
    })
  ]
})

export const formDefinitionWithNoQuestions = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'p2'
    })
  ]
})

export const formDefinitionWithRadioQuestion = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [
        buildRadiosComponent({
          id: 'q1',
          name: 'radioField',
          title: 'This is your first question',
          hint: 'Help text',
          list: 'my-list-id'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'p2'
    })
  ],
  lists: [
    {
      name: 'my-list',
      id: 'my-list-id',
      type: 'string',
      title: 'list for radio',
      items: [
        {
          id: 'option-1',
          text: 'Option 1',
          hint: {
            text: 'Option 1 hint'
          },
          value: 'Option1'
        },
        {
          id: 'option-2',
          text: 'Option 2',
          hint: {
            text: 'Option 2 hint'
          },
          value: 'Option2'
        },
        {
          id: 'option-3',
          text: 'Option 3',
          hint: {
            text: 'Option 3 hint'
          },
          value: 'Option3'
        }
      ]
    }
  ]
})
