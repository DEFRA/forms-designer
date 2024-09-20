import { arrayMove } from '~/src/helpers.js'

describe('Helpers', () => {
  describe('arrayMove', () => {
    it.each([
      [
        'moves item down from start',
        {
          from: 0,
          to: 1,
          input: [1, 2, 3, 4, 5],
          output: [2, 1, 3, 4, 5]
        }
      ],
      [
        'moves item down from end (wraps to start)',
        {
          from: 4,
          to: 5,
          input: [1, 2, 3, 4, 5],
          output: [5, 1, 2, 3, 4]
        }
      ],
      [
        'moves item down from end to infinity (wraps to start)',
        {
          from: 4,
          to: Infinity,
          input: [1, 2, 3, 4, 5],
          output: [5, 1, 2, 3, 4]
        }
      ],
      [
        'moves item up from start (wraps to end)',
        {
          from: 0,
          to: -1,
          input: [1, 2, 3, 4, 5],
          output: [2, 3, 4, 5, 1]
        }
      ],
      [
        'moves item up from start to minus infinity (wraps to end)',
        {
          from: 0,
          to: -Infinity,
          input: [1, 2, 3, 4, 5],
          output: [2, 3, 4, 5, 1]
        }
      ],
      [
        'moves item up from end',
        {
          from: 4,
          to: 3,
          input: [1, 2, 3, 4, 5],
          output: [1, 2, 3, 5, 4]
        }
      ]
    ])('%s', (_, { from, to, input, output }) => {
      expect(arrayMove(input, from, to)).toEqual(output)
    })
  })
})
