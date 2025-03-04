import { ComponentType, ControllerType } from '@defra/forms-model'

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithSinglePage = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [
        {
          id: 'c1',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      id: 'c2',
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary,
      components: []
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithSummaryOnly = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary,
      components: []
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithoutSummary = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [
        {
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithTwoQuestions = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [
        {
          id: 'q1',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first question',
          hint: 'Help text',
          options: {},
          schema: {}
        },
        {
          id: 'q2',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your second question',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      id: 'p2',
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary,
      components: []
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithTwoPagesAndQuestions = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [
        {
          id: 'q1',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first question',
          hint: 'Help text',
          options: {},
          schema: {}
        },
        {
          id: 'q2',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your second question',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      id: 'p2',
      path: '/page-two',
      title: 'Page two',
      section: 'section',
      components: [
        {
          id: 'q1',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first question - page two',
          hint: 'Help text',
          options: {},
          schema: {}
        },
        {
          id: 'q2',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your second question - page two',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      id: 'p3',
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary,
      components: []
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithNoQuestions = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [],
      next: [{ path: '/summary' }]
    },
    {
      id: 'p2',
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary,
      components: []
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithNoPages = {
  name: 'Test form',
  pages: [],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @import { FormDefinition } from '@defra/forms-model'
 */
