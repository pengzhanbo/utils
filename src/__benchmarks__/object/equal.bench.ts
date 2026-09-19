import { describe, it } from 'vitest'
import { deepEqual } from '../../object/equal.js'
import { runBenchmarks } from '../helpers/baseline.js'

// Deterministic leaves keep both operands structurally equal, so `deepEqual` walks the
// whole tree instead of exiting at the first differing leaf
// 叶子值保持确定性，使两侧结构完全相等，`deepEqual` 会遍历整棵树而不是在首个不同叶子处提前退出
function generateWideNested(depth: number, seed = 0): any {
  if (depth <= 0) {
    return { value: seed }
  }
  const obj: any = {}
  for (let i = 0; i < 10; i++) {
    obj[`k_${i}`] = generateWideNested(depth - 1, seed * 10 + i)
  }
  return obj
}

function generateDeepUnequal(depth: number, diff = false): any {
  if (depth <= 0) {
    return { value: diff ? 999 : 42 }
  }
  const obj: any = {}
  for (let i = 0; i < 5; i++) {
    obj[`k_${i}`] = generateDeepUnequal(depth - 1, diff && i === 4)
  }
  return obj
}

describe('performance > Object > DeepEqual', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const flatA = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`key_${i}`, i]))
  const flatB = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`key_${i}`, i]))
  const nestedA = generateWideNested(3)
  const nestedB = generateWideNested(3)
  const largeFlatA = Object.fromEntries(Array.from({ length: 1000 }, (_, i) => [`prop_${i}`, i]))
  const largeFlatB = Object.fromEntries(Array.from({ length: 1000 }, (_, i) => [`prop_${i}`, i]))
  const arrayA = Array.from({ length: 1000 }, (_, i) => i)
  const arrayB = [...arrayA]
  const mixedA = {
    date: new Date('2024-01-01'),
    regex: /^test.*$/gi,
    map: new Map([
      ['a', 1],
      ['b', 2],
    ]),
    set: new Set([1, 2, 3]),
    nested: { arr: [1, 2, 3] },
  }
  const mixedB = {
    date: new Date('2024-01-01'),
    regex: /^test.*$/gi,
    map: new Map([
      ['a', 1],
      ['b', 2],
    ]),
    set: new Set([1, 2, 3]),
    nested: { arr: [1, 2, 3] },
  }
  const deepUnequalA = generateDeepUnequal(5)
  const deepUnequalB = generateDeepUnequal(5, true)

  // EQ-01: Primitive comparison / 基本类型比较
  // Sub-microsecond row, so each sample batches 1000 rounds to escape the timer resolution floor
  // 亚微秒级基准，每次采样批量执行 1000 轮以脱离计时器分辨率下限
  it('primitives, numbers and strings', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('primitives', () => {
          let acc = 0
          for (let i = 0; i < 1000; i++) {
            acc += deepEqual(42, 42) ? 1 : 0
            acc += deepEqual('hello', 'hello') ? 1 : 0
            acc += deepEqual(true, true) ? 1 : 0
          }
          return acc
        }),
      ],
      { time: 1000, iterations: 100 },
    )
  })

  // EQ-02: Flat object comparison / 扁平对象比较
  it('flat objects, 10 properties each', async ({ bench }) => {
    await runBenchmarks(bench, [bench('flat objects', () => deepEqual(flatA, flatB))], {
      time: 1000,
      iterations: 500,
    })
  })

  // EQ-03: Medium nested object, equal operands (full traversal) / 中型嵌套对象，两侧相等（全量遍历）
  it('nested objects, depth=3 width=10', async ({ bench }) => {
    await runBenchmarks(bench, [bench('nested objects', () => deepEqual(nestedA, nestedB))], {
      time: 1000,
      iterations: 200,
    })
  })

  // EQ-04: Large flat object / 大型扁平对象
  // Raised iterations and duration to bring the previously noisy rme (±22.4%) down
  // 提高迭代次数与运行时长，以降低此前偏高的 rme（±22.4%）
  it('large flat objects, 1000 properties', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [bench('large flat objects', () => deepEqual(largeFlatA, largeFlatB))],
      { time: 2000, iterations: 500 },
    )
  })

  // EQ-05: Array comparison / 数组比较
  it('arrays, 1000 elements', async ({ bench }) => {
    await runBenchmarks(bench, [bench('arrays', () => deepEqual(arrayA, arrayB))], {
      time: 1000,
      iterations: 200,
    })
  })

  // EQ-06: Mixed type comparison / 混合类型比较
  it('mixed types (Date, RegExp, Map, Set)', async ({ bench }) => {
    await runBenchmarks(bench, [bench('mixed types', () => deepEqual(mixedA, mixedB))], {
      time: 1000,
      iterations: 200,
    })
  })

  // EQ-07: Unequal objects (early exit) / 不等对象（提前退出）
  it('unequal early exit, first property differs', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [bench('unequal early exit', () => deepEqual({ a: 1, b: 2, c: 3 }, { a: 99, b: 2, c: 3 }))],
      { time: 1000, iterations: 500 },
    )
  })

  // EQ-08: Deeply unequal / 深度不等
  it('deeply unequal, differ at leaf level', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [bench('deeply unequal', () => deepEqual(deepUnequalA, deepUnequalB))],
      { time: 1000, iterations: 100 },
    )
  })
})
