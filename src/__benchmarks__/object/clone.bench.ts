import { describe, it } from 'vitest'
import { deepClone, shallowClone, simpleClone } from '../../object/clone.js'
import { runBenchmarks } from '../helpers/baseline.js'
import {
  SMALL_OBJECT,
  MEDIUM_FLAT_OBJECT,
  MEDIUM_NESTED_OBJECT,
  LARGE_FLAT_OBJECT,
  LARGE_ARRAY,
  SPECIAL_TYPE_OBJECT,
  CIRCULAR_OBJECT,
} from '../helpers/fixtures.js'

describe('performance > Object > Clone', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const deepNestedObject = {
    level1: { level2: { level3: { level4: { level5: { value: 42 } } } } },
  }
  const objectArray = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: i * 2 }))
  const primitiveArray1k = Array.from({ length: 1000 }, (_, i) => i)
  const primitiveArray100k = Array.from({ length: 100000 }, (_, i) => i)

  // DC-01: Small flat object / 小型扁平对象
  it('small object, 5 props', async ({ bench }) => {
    await runBenchmarks(bench, [bench('deepClone', () => deepClone(SMALL_OBJECT))], {
      time: 1000,
      iterations: 500,
    })
  })

  // DC-02 + DC-08 + DC-10: Same 100-prop medium scale, so they share one comparison table
  // DC-02 + DC-08 + DC-10: 同为 100 props 中型规模，放在同一张对比表中
  it('medium objects, 100 props', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('deepClone', () => deepClone(MEDIUM_NESTED_OBJECT)),
        bench('jSON.parse(JSON.stringify())', () => JSON.parse(JSON.stringify(MEDIUM_FLAT_OBJECT))),
        bench('simpleClone (JSON method)', () => simpleClone(MEDIUM_FLAT_OBJECT)),
      ],
      { time: 1000, iterations: 200 },
    )
  })

  // DC-03: Deep nested object / 深度嵌套对象
  it('deeply nested object, depth=5', async ({ bench }) => {
    await runBenchmarks(bench, [bench('deepClone', () => deepClone(deepNestedObject))], {
      time: 1000,
      iterations: 500,
    })
  })

  // DC-04: Large flat object / 大型扁平对象
  it('large flat object, 10000 props', async ({ bench }) => {
    await runBenchmarks(bench, [bench('deepClone', () => deepClone(LARGE_FLAT_OBJECT))], {
      time: 2000,
      iterations: 50,
    })
  })

  // DC-05: Special types object / 特殊类型对象
  it('mixed types (Date, RegExp, Map, Set)', async ({ bench }) => {
    await runBenchmarks(bench, [bench('deepClone', () => deepClone(SPECIAL_TYPE_OBJECT))], {
      time: 1000,
      iterations: 200,
    })
  })

  // DC-06: Circular reference / 循环引用对象
  it('circular references', async ({ bench }) => {
    await runBenchmarks(bench, [bench('deepClone', () => deepClone(CIRCULAR_OBJECT))], {
      time: 1000,
      iterations: 200,
    })
  })

  // DC-07 ~ DC-07b: Same 1000-element array scale, object vs primitive elements
  // DC-07 ~ DC-07b: 同为 1000 元素数组规模，对比对象元素与基本类型元素
  it('array, 1000 elements', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('deepClone (object elements)', () => deepClone(objectArray)),
        bench('deepClone (primitive elements)', () => deepClone(primitiveArray1k)),
      ],
      { time: 1000, iterations: 200 },
    )
  })

  // DC-07c + DC-09: Same 100K-element array scale, deepClone vs its shallowClone baseline
  // DC-07c + DC-09: 同为 100K 元素数组规模，deepClone 与其 shallowClone 基线对比
  it('arrays, 100K elements', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('deepClone', () => deepClone(primitiveArray100k)),
        bench('shallowClone', () => shallowClone(LARGE_ARRAY)),
      ],
      { time: 2000, iterations: 30 },
    )
  })
})
