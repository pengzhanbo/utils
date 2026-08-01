import { describe, bench } from 'vitest'
import { deepFlatten } from '../../array/deep-flatten'

describe('Performance > Array > DeepFlatten', () => {
  // DF-01: Deeply nested / 深度嵌套
  bench(
    'deepFlatten | 5-level nesting (10K leaves)',
    () => {
      let arr: any[] = Array.from({ length: 10000 }, (_, i) => i)
      for (let i = 0; i < 5; i++) arr = [arr]
      deepFlatten(arr)
    },
    { time: 1000, iterations: 50 },
  )

  // DF-02: Shallow mixed / 浅层混合
  bench(
    'deepFlatten | 2-level nesting (10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => (i % 2 === 0 ? i : [i]))
      deepFlatten(arr)
    },
    { time: 1000, iterations: 100 },
  )

  // DF-03: Already flat / 已扁平
  bench(
    'deepFlatten | flat array (10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i)
      deepFlatten(arr)
    },
    { time: 1000, iterations: 200 },
  )

  // DF-04: vs native flat(Infinity) / 与原生 flat(Infinity) 对比
  bench(
    'flat(Infinity) baseline | 5-level nesting (10K leaves)',
    () => {
      let arr: any[] = Array.from({ length: 10000 }, (_, i) => i)
      for (let i = 0; i < 5; i++) arr = [arr]
      arr.flat(Infinity)
    },
    { time: 1000, iterations: 50 },
  )
})
