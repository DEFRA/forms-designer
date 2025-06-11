import { ComponentType } from '~/src/components/enums.js'
import { buildPreviewShortAnswer } from '~/src/form/form-editor/__stubs__/preview.js'
import { PreviewPageController } from '~/src/form/form-editor/preview/controller/page-controller.js'

describe('page-controller', () => {
  describe('PreviewPageController', () => {
    const question = buildPreviewShortAnswer(
      {
        question: 'Question title'
      },
      jest.fn()
    )

    it('should return the page title should one exist', () => {
      const pageTitle = 'Page title'
      const pageController = new PreviewPageController(
        [question],
        pageTitle,
        'active'
      )
      const expectedPageComponent = {
        model: {
          id: 'inputField',
          name: 'inputField',
          label: {
            classes: 'govuk-label--l',
            text: 'Question title'
          },
          hint: {
            text: 'Choose one adventure that best suits you.',
            classes: ''
          }
        },
        questionType: ComponentType.TextField
      }
      expect(pageController.pageTitle).toEqual({
        text: pageTitle,
        classes: 'active'
      })
      expect(pageController.components).toEqual([expectedPageComponent])
    })

    it('should return the title of the first component should one not exist', () => {
      const pageController = new PreviewPageController([question])

      expect(pageController.pageTitle).toEqual({
        text: 'Question title',
        classes: ''
      })
    })
  })
})
