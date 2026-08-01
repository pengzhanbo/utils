import { describe, bench } from 'vitest'
import { mapValues } from '../../object/map-values'

describe('Performance > Object > MapValues', () => {
  // MV-01: Numeric transform / 数值转换
  bench(
    'numeric transform | 10K keys',
    () => {
      const obj: Record<string, number> = Object.fromEntries(
        Array.from({ length: 10000 }, (_, i) => [`key_${i}`, i]),
      )
      mapValues(obj, (v) => v * 2)
    },
    { time: 1000, iterations: 100 },
  )

  // MV-02: String concat / 字符串拼接
  bench(
    'string concat | 10K keys',
    () => {
      const obj: Record<string, number> = Object.fromEntries(
        Array.from({ length: 10000 }, (_, i) => [`key_${i}`, i]),
      )
      mapValues(obj, (v, k) => `${k}_${v}`)
    },
    { time: 1000, iterations: 100 },
  )
})
