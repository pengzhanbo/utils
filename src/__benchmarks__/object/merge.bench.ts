import { describe, bench } from 'vitest'
import { deepMerge, deepMergeWithArray } from '../../object/deep-merge'
import { MERGE_WITH_ARRAY_SOURCES } from '../helpers/fixtures'

describe('Performance > Object > DeepMerge', () => {
  // DM-01: Two objects merge / 两对象合并
  bench(
    'Two source objects | small (10 props each)',
    () => {
      const target = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      const source = { f: 6, g: 7, h: 8, i: 9, j: 10 }
      deepMerge(target, source)
    },
    { time: 1000, iterations: 500 },
  )

  // DM-02: Multiple sources merge / 多源合并
  bench(
    'Multiple sources (5) | medium objects (20 props each)',
    () => {
      const base = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`base_${i}`, i]))
      const sources = Array.from({ length: 5 }, (_, idx) =>
        Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`src${idx}_${i}`, idx * 10 + i])),
      )
      deepMerge(base, ...sources)
    },
    { time: 1000, iterations: 200 },
  )

  // DM-03: Deep nested merge / 深度嵌套合并
  bench(
    'Deeply nested merge | depth=5, width=5',
    () => {
      function generateNested(depth: number): any {
        if (depth <= 0) return { value: Math.random() }
        const obj: any = {}
        for (let i = 0; i < 5; i++) {
          obj[`key_${i}`] = generateNested(depth - 1)
        }
        return obj
      }

      const target = generateNested(5)
      const source = generateNested(5)
      deepMerge(target, source)
    },
    { time: 1000, iterations: 100 },
  )

  // DM-04: Large object merge / 大型对象合并
  bench(
    'Large objects | 1000 props each',
    () => {
      const target = Object.fromEntries(
        Array.from({ length: 1000 }, (_, i) => [`target_${i}`, { value: i }]),
      )
      const source = Object.fromEntries(
        Array.from({ length: 1000 }, (_, i) => [`source_${i}`, { value: i * 2 }]),
      )
      deepMerge(target, source)
    },
    { time: 2000, iterations: 50 },
  )

  // DM-05: withArray mode / 数组合并模式
  bench(
    'deepMergeWithArray | arrays present',
    () => {
      deepMergeWithArray(
        MERGE_WITH_ARRAY_SOURCES[0] as Record<PropertyKey, any>,
        MERGE_WITH_ARRAY_SOURCES[1] as Record<PropertyKey, any>,
        MERGE_WITH_ARRAY_SOURCES[2] as Record<PropertyKey, any>,
      )
    },
    { time: 1000, iterations: 200 },
  )

  // DM-06: vs Object.assign / 与Object.assign对比
  bench(
    'Object.assign | shallow merge (100 props)',
    () => {
      const target = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`t_${i}`, i]))
      const source = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`s_${i}`, i]))
      Object.assign(target, source)
    },
    { time: 1000, iterations: 200 },
  )

  // DM-07: High conflict rate / 高冲突率场景
  bench(
    'High conflict rate | 50% overlapping keys',
    () => {
      const target = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key_${i}`, i]))
      const source = Object.fromEntries(
        Array.from({ length: 100 }, (_, i) => [`key_${i % 50}`, `new_value_${i}`]),
      )
      deepMerge(target, source)
    },
    { time: 1000, iterations: 200 },
  )
})
