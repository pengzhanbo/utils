import { describe, bench } from 'vitest'
import { shuffle } from '../../array/shuffle'
import { generateNumberArray } from '../helpers/data-generators'

describe('Performance > Array > Shuffle', () => {
  const smallArr = generateNumberArray(100)
  const mediumArr = generateNumberArray(10000)
  const largeArr = generateNumberArray(100000)

  bench(
    'Shuffle | small array (100 elements)',
    () => {
      shuffle([...smallArr])
    },
    { time: 1000, iterations: 500 },
  )

  bench(
    'Shuffle | medium array (10K elements)',
    () => {
      shuffle([...mediumArr])
    },
    { time: 2000, iterations: 100 },
  )

  bench(
    'Shuffle | large array (100K elements)',
    () => {
      shuffle([...largeArr])
    },
    { time: 3000, iterations: 20 },
  )
})
