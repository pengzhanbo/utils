import { describe, bench } from 'vitest'
import { mapKeys } from '../../object/map-keys.js'

describe('performance > Object > MapKeys', () => {
  // MK-01: Upper-case keys / 键转大写
  bench(
    'upper-case keys | 10K keys',
    () => {
      const obj: Record<string, number> = Object.fromEntries(
        Array.from({ length: 10000 }, (_, i) => [`key_${i}`, i]),
      )
      mapKeys(obj, (k) => k.toUpperCase())
    },
    { time: 1000, iterations: 100 },
  )

  // MK-02: Key collision / 键碰撞
  bench(
    'collision | all keys map to one key',
    () => {
      const obj: Record<string, number> = Object.fromEntries(
        Array.from({ length: 10000 }, (_, i) => [`key_${i}`, i]),
      )
      mapKeys(obj, () => 'x')
    },
    { time: 1000, iterations: 100 },
  )
})
