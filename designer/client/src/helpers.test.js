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

    it('does not mutate input', () => {
      const input = [1, 2, 3, 4, 5]

      // Move item down then back up
      const output1 = arrayMove(input, 0, 1)
      const output2 = arrayMove(output1, 1, 0)

      // Output values match input
      expect(output2).toEqual([1, 2, 3, 4, 5])
      expect(output2).toEqual(input)

      // But output is a new reference
      expect(output1).not.toBe(input)
      expect(output2).not.toBe(input)
    })
  })
})
