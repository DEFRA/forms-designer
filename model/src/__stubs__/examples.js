import {
  buildDeclarationFieldComponent,
  buildLatLongFieldComponent,
  buildMarkdownComponent,
  buildRadiosComponent,
  buildTextFieldComponent
} from '~/src/__stubs__/components.js'
import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import {
  buildQuestionPage,
  buildRepeaterPage,
  buildSummaryPage
} from '~/src/__stubs__/pages.js'

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

export const formDefinitionWithTwoQuestionsAndGuidance = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [
        buildMarkdownComponent({ content: 'My markdown text' }),
        buildTextFieldComponent({
          id: 'q1',
          name: 'textField',
          title: 'This is the first textfield question',
          hint: 'Help text'
        }),
        buildTextFieldComponent({
          id: 'q2',
          name: 'textField',
          title: 'This is the second textfield question',
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

export const formDefinitionWithLocationAndDeclaration = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [
        buildLatLongFieldComponent({
          id: 'q1',
          name: 'latLongField',
          title: 'This is the first lat long field question',
          hint: 'Hint text',
          options: {
            instructionText: 'Some instruction text'
          }
        }),
        buildDeclarationFieldComponent({
          id: 'q2',
          name: 'declarationField',
          title: 'This is a declaration question',
          hint: 'Declaration hint text',
          content: 'This is the declaration that needs agreeing to',
          shortDescription: 'Declaration short desc'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'p2'
    })
  ]
})

export const formDefinitionWithFormLevelDeclaration = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'q1',
          name: 'textField',
          title: 'This is the first textfield question',
          hint: 'Hint text 1',
          shortDescription: 'Short desc 1'
        }),
        buildTextFieldComponent({
          id: 'q2',
          name: 'textField',
          title: 'This is the second textfield question',
          hint: 'Hint text 2',
          shortDescription: 'Short desc 2'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'p2',
      components: [
        buildMarkdownComponent({
          id: 'q10',
          content: 'This is a final declaration for the summary page'
        })
      ]
    })
  ]
})

export const formDefinitionWithRepeater = buildDefinition({
  pages: [
    buildRepeaterPage({
      id: 'p1',
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'q1',
          name: 'TextField',
          title: 'This is the first text field field question',
          hint: 'Hint text',
          shortDescription: 'Short desc'
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
          title: 'This is a radio question',
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
