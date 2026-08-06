import { describe, bench } from 'vitest'
import { shuffle } from '../../array/shuffle.js'
import { generateNumberArray } from '../helpers/data-generators.js'

describe('performance > Array > Shuffle', () => {
  const smallArr = generateNumberArray(100)
  const mediumArr = generateNumberArray(10000)
  const largeArr = generateNumberArray(100000)

  bench(
    'shuffle | small array (100 elements)',
    () => {
      shuffle([...smallArr])
    },
    { time: 1000, iterations: 500 },
  )

  bench(
    'shuffle | medium array (10K elements)',
    () => {
      shuffle([...mediumArr])
    },
    { time: 2000, iterations: 100 },
  )

  bench(
    'shuffle | large array (100K elements)',
    () => {
      shuffle([...largeArr])
    },
    { time: 3000, iterations: 20 },
  )
})
