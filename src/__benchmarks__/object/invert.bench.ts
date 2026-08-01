import { describe, bench } from 'vitest'
import { invert } from '../../object/invert'

describe('Performance > Object > Invert', () => {
  // INV-01: Number values / 数值
  bench(
    'number values | 10K keys',
    () => {
      const obj: Record<string, number> = Object.fromEntries(
        Array.from({ length: 10000 }, (_, i) => [`key_${i}`, i]),
      )
      invert(obj)
    },
    { time: 1000, iterations: 100 },
  )
})
