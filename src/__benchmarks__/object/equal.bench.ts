import { describe, bench } from 'vitest'
import { deepEqual } from '../../object/equal'

describe('Performance > Object > DeepEqual', () => {
  // EQ-01: Primitive comparison / 基本类型比较
  bench(
    'primitives | numbers and strings',
    () => {
      deepEqual(42, 42)
      deepEqual('hello', 'hello')
      deepEqual(true, true)
    },
    { time: 1000, iterations: 1000 },
  )

  // EQ-02: Flat object comparison / 扁平对象比较
  bench(
    'flat objects | 10 properties each',
    () => {
      const a = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`key_${i}`, i]))
      const b = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`key_${i}`, i]))
      deepEqual(a, b)
    },
    { time: 1000, iterations: 500 },
  )

  // EQ-03: Medium nested object / 中型嵌套对象
  bench(
    'nested objects | depth=3, width=10',
    () => {
      function genObj(d: number): any {
        if (d <= 0) return { value: Math.random() }
        const obj: any = {}
        for (let i = 0; i < 10; i++) {
          obj[`k_${i}`] = genObj(d - 1)
        }
        return obj
      }
      deepEqual(genObj(3), genObj(3))
    },
    { time: 1000, iterations: 200 },
  )

  // EQ-04: Large flat object / 大型扁平对象
  bench(
    'large flat objects | 1000 properties',
    () => {
      const gen = () => Object.fromEntries(Array.from({ length: 1000 }, (_, i) => [`prop_${i}`, i]))
      deepEqual(gen(), gen())
    },
    { time: 1000, iterations: 100 },
  )

  // EQ-05: Array comparison / 数组比较
  bench(
    'arrays | 1000 elements',
    () => {
      const arr = Array.from({ length: 1000 }, (_, i) => i)
      deepEqual(arr, [...arr])
    },
    { time: 1000, iterations: 200 },
  )

  // EQ-06: Mixed type comparison / 混合类型比较
  bench(
    'mixed types | Date, RegExp, Map, Set',
    () => {
      const a = {
        date: new Date('2024-01-01'),
        regex: /^test.*$/gi,
        map: new Map([
          ['a', 1],
          ['b', 2],
        ]),
        set: new Set([1, 2, 3]),
        nested: { arr: [1, 2, 3] },
      }
      const b = {
        date: new Date('2024-01-01'),
        regex: /^test.*$/gi,
        map: new Map([
          ['a', 1],
          ['b', 2],
        ]),
        set: new Set([1, 2, 3]),
        nested: { arr: [1, 2, 3] },
      }
      deepEqual(a, b)
    },
    { time: 1000, iterations: 200 },
  )

  // EQ-07: Unequal objects (early exit) / 不等对象（提前退出）
  bench(
    'unequal early exit | first property differs',
    () => {
      deepEqual({ a: 1, b: 2, c: 3 }, { a: 99, b: 2, c: 3 })
    },
    { time: 1000, iterations: 500 },
  )

  // EQ-08: Deeply unequal / 深度不等
  bench(
    'deeply unequal | differ at leaf level',
    () => {
      function genObj(d: number, diff = false): any {
        if (d <= 0) return { value: diff ? 999 : 42 }
        const obj: any = {}
        for (let i = 0; i < 5; i++) {
          obj[`k_${i}`] = genObj(d - 1, diff && i === 4)
        }
        return obj
      }
      deepEqual(genObj(5), genObj(5, true))
    },
    { time: 1000, iterations: 100 },
  )
})
