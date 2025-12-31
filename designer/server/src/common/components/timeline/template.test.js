import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Timeline Component', () => {
  describe('with items', () => {
    it('should render timeline with items', () => {
      const { document } = renderMacro('appTimeline', 'timeline/macro.njk', {
        params: {
          items: [
            {
              title: 'Form created',
              user: 'Chris Smith',
              date: '14 June 2019 at 2:01pm',
              isFormWentLive: false,
              isConsolidated: false
            }
          ]
        }
      })

      const $timeline = document.querySelector('.app-timeline')
      expect($timeline).toBeInTheDocument()
    })

    it('should render multiple items', () => {
      const { document } = renderMacro('appTimeline', 'timeline/macro.njk', {
        params: {
          items: [
            {
              title: 'Draft edited',
              user: 'Chris Smith',
              date: '14 June 2019 at 3:01pm',
              isFormWentLive: false,
              isConsolidated: false
            },
            {
              title: 'Form created',
              user: 'Alex Patel',
              date: '14 June 2019 at 2:01pm',
              isFormWentLive: false,
              isConsolidated: false
            }
          ]
        }
      })

      const $items = document.querySelectorAll('.app-timeline__item')
      expect($items).toHaveLength(2)
    })

    it('should render item title and user', () => {
      const { document } = renderMacro('appTimeline', 'timeline/macro.njk', {
        params: {
          items: [
            {
              title: 'Form created',
              user: 'Chris Smith',
              date: '14 June 2019 at 2:01pm',
              isFormWentLive: false,
              isConsolidated: false
            }
          ]
        }
      })

      const $title = document.querySelector('.app-timeline__title strong')
      expect($title).toHaveTextContent('Form created')

      const $user = document.querySelector('.app-timeline__user')
      expect($user).toHaveTextContent('by Chris Smith')
    })

    it('should render item date', () => {
      const { document } = renderMacro('appTimeline', 'timeline/macro.njk', {
        params: {
          items: [
            {
              title: 'Form created',
              user: 'Chris Smith',
              date: '14 June 2019 at 2:01pm',
              isFormWentLive: false,
              isConsolidated: false
            }
          ]
        }
      })

      const $date = document.querySelector('.app-timeline__date')
      expect($date).toHaveTextContent('14 June 2019 at 2:01pm')
    })

    it('should render item description when provided', () => {
      const { document } = renderMacro('appTimeline', 'timeline/macro.njk', {
        params: {
          items: [
            {
              title: 'Form name updated',
              user: 'Emily Wong',
              date: '14 June 2019 at 2:01pm',
              description:
                "Updated the form name from 'Old Name' to 'New Name'.",
              isFormWentLive: false,
              isConsolidated: false
            }
          ]
        }
      })

      const $description = document.querySelector('.app-timeline__description')
      expect($description).toBeInTheDocument()
      expect($description).toHaveTextContent(
        "Updated the form name from 'Old Name' to 'New Name'."
      )
    })

    it('should not render description when not provided', () => {
      const { document } = renderMacro('appTimeline', 'timeline/macro.njk', {
        params: {
          items: [
            {
              title: 'Form created',
              user: 'Chris Smith',
              date: '14 June 2019 at 2:01pm',
              isFormWentLive: false,
              isConsolidated: false
            }
          ]
        }
      })

      const $description = document.querySelector('.app-timeline__description')
      expect($description).not.toBeInTheDocument()
    })

    it('should highlight form went live events', () => {
      const { document } = renderMacro('appTimeline', 'timeline/macro.njk', {
        params: {
          items: [
            {
              title: 'Form went live',
              user: 'Samira Khan',
              date: '14 June 2019 at 2:01pm',
              isFormWentLive: true,
              isConsolidated: false
            }
          ]
        }
      })

      const $item = document.querySelector('.app-timeline__item')
      expect($item).toHaveClass('app-timeline__item--highlight')
    })

    it('should render consolidated edit events', () => {
      const { document } = renderMacro('appTimeline', 'timeline/macro.njk', {
        params: {
          items: [
            {
              title: 'Draft edited',
              user: 'Chris Smith',
              date: '14 June 2019 at 4:30pm',
              description:
                'Edited the draft form 3 times between 3:30pm and 4:30pm.',
              isFormWentLive: false,
              isConsolidated: true,
              count: 3
            }
          ]
        }
      })

      const $description = document.querySelector('.app-timeline__description')
      expect($description).toHaveTextContent(
        'Edited the draft form 3 times between 3:30pm and 4:30pm.'
      )
    })
  })

  describe('with no items', () => {
    it('should render empty message when no items', () => {
      const { document } = renderMacro('appTimeline', 'timeline/macro.njk', {
        params: {
          items: []
        }
      })

      const $timeline = document.querySelector('.app-timeline')
      expect($timeline).not.toBeInTheDocument()

      const $message = document.querySelector('.govuk-body')
      expect($message).toHaveTextContent('No history available.')
    })
  })
})
