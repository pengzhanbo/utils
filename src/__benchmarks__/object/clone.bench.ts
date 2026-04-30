import { describe, bench } from 'vitest'
import { deepClone, shallowClone, simpleClone } from '../../object/clone'
import {
  SMALL_OBJECT,
  MEDIUM_FLAT_OBJECT,
  MEDIUM_NESTED_OBJECT,
  LARGE_ARRAY,
  SPECIAL_TYPE_OBJECT,
  CIRCULAR_OBJECT,
} from '../helpers/fixtures'

describe('Performance > Object > Clone', () => {
  // DC-01: Small flat object / 小型扁平对象
  bench(
    'deepClone | small object (5 props)',
    () => {
      deepClone(SMALL_OBJECT)
    },
    { time: 1000, iterations: 500 },
  )

  // DC-02: Medium nested object / 中型嵌套对象
  bench(
    'deepClone | medium nested object (depth=2, 100 props)',
    () => {
      deepClone(MEDIUM_NESTED_OBJECT)
    },
    { time: 1000, iterations: 200 },
  )

  // DC-03: Deep nested object / 深度嵌套对象
  bench(
    'deepClone | deeply nested object (depth=5)',
    () => {
      const deepNested = { level1: { level2: { level3: { level4: { level5: { value: 42 } } } } } }
      deepClone(deepNested)
    },
    { time: 1000, iterations: 500 },
  )

  // DC-04: Large flat object / 大型扁平对象
  bench(
    'deepClone | large flat object (10000 props)',
    () => {
      deepClone(MEDIUM_FLAT_OBJECT)
    },
    { time: 2000, iterations: 50 },
  )

  // DC-05: Special types object / 特殊类型对象
  bench(
    'deepClone | mixed types (Date, RegExp, Map, Set)',
    () => {
      deepClone(SPECIAL_TYPE_OBJECT)
    },
    { time: 1000, iterations: 200 },
  )

  // DC-06: Circular reference / 循环引用对象
  bench(
    'deepClone | circular references',
    () => {
      deepClone(CIRCULAR_OBJECT)
    },
    { time: 1000, iterations: 200 },
  )

  // DC-07: Array cloning (object elements) / 对象数组克隆
  const objArr = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: i * 2 }))
  bench(
    'deepClone | array (1000 object elements)',
    () => {
      deepClone(objArr)
    },
    { time: 1000, iterations: 200 },
  )

  // DC-07b: Array cloning (primitive elements) / 基本类型数组克隆
  const primArr1k = Array.from({ length: 1000 }, (_, i) => i)
  bench(
    'deepClone | array (1000 primitive elements)',
    () => {
      deepClone(primArr1k)
    },
    { time: 1000, iterations: 200 },
  )

  // DC-07c: Large primitive array / 大型基本类型数组
  const primArr100k = Array.from({ length: 100000 }, (_, i) => i)
  bench(
    'deepClone | array (100K primitive elements)',
    () => {
      deepClone(primArr100k)
    },
    { time: 2000, iterations: 30 },
  )

  // DC-08: vs JSON method / 与JSON方法对比
  bench(
    'JSON.parse(JSON.stringify()) | medium flat object (100 props)',
    () => {
      JSON.parse(JSON.stringify(MEDIUM_FLAT_OBJECT))
    },
    { time: 1000, iterations: 200 },
  )

  // DC-09: shallowClone comparison / 浅拷贝对比
  bench(
    'shallowClone | large array (100K items)',
    () => {
      shallowClone(LARGE_ARRAY)
    },
    { time: 2000, iterations: 30 },
  )

  // DC-10: simpleClone comparison / 简单克隆对比
  bench(
    'simpleClone (JSON method) | medium flat object (100 props)',
    () => {
      simpleClone(MEDIUM_FLAT_OBJECT)
    },
    { time: 1000, iterations: 200 },
  )
})
