import { describe, it } from 'vitest'
import { shuffle } from '../../array/shuffle.js'
import { runBenchmarks } from '../helpers/baseline.js'
import { generateNumberArray } from '../helpers/data-generators.js'

describe('performance > Array > Shuffle', () => {
  // shuffle mutates its input, so every iteration needs a fresh copy
  // shuffle 会修改入参，因此每次迭代都需要一份新副本
  const smallArr = generateNumberArray(100)
  const mediumArr = generateNumberArray(10000)
  const largeArr = generateNumberArray(100000)

  let smallInput: number[]
  let mediumInput: number[]
  let largeInput: number[]

  it('small array (100 elements)', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench(
          'shuffle',
          {
            beforeEach: () => {
              smallInput = [...smallArr]
            },
          },
          () => shuffle(smallInput),
        ),
      ],
      { time: 1000, iterations: 500 },
    )
  })

  it('medium array (10K elements)', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench(
          'shuffle',
          {
            beforeEach: () => {
              mediumInput = [...mediumArr]
            },
          },
          () => shuffle(mediumInput),
        ),
      ],
      { time: 2000, iterations: 100 },
    )
  })

  it('large array (100K elements)', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench(
          'shuffle',
          {
            beforeEach: () => {
              largeInput = [...largeArr]
            },
          },
          () => shuffle(largeInput),
        ),
      ],
      { time: 3000, iterations: 20 },
    )
  })
})
