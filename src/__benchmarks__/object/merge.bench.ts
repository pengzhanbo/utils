import { describe, it } from 'vitest'
import { deepMerge, deepMergeWithArray } from '../../object/deep-merge.js'
import { runBenchmarks } from '../helpers/baseline.js'
import { MERGE_WITH_ARRAY_SOURCES } from '../helpers/fixtures.js'

function generateNested(depth: number): any {
  if (depth <= 0) {
    return { value: Math.random() }
  }
  const obj: any = {}
  for (let i = 0; i < 5; i++) {
    obj[`key_${i}`] = generateNested(depth - 1)
  }
  return obj
}

describe('performance > Object > DeepMerge', () => {
  // `deepMerge` mutates its target in place, so targets are rebuilt in `beforeEach`;
  // read-only sources and other inputs are pre-allocated outside the timed function
  // deepMerge 会原地修改目标对象，因此目标对象在 beforeEach 中重建；
  // 只读的源对象与其它输入在计时区间外预分配
  const smallSource = { f: 6, g: 7, h: 8, i: 9, j: 10 }
  const mediumSources = Array.from({ length: 5 }, (_, idx) =>
    Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`src${idx}_${i}`, idx * 10 + i])),
  )
  const nestedSource = generateNested(5)
  const largeSource = Object.fromEntries(
    Array.from({ length: 1000 }, (_, i) => [`source_${i}`, { value: i * 2 }]),
  )
  const assignSource = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`s_${i}`, i]))
  // 100 distinct keys, matching `assignSource`, so both rows of the DM-06 group do equal work
  // 100 个互不相同的键，与 `assignSource` 一致，使 DM-06 组两侧工作量对等
  const conflictSource = Object.fromEntries(
    Array.from({ length: 100 }, (_, i) => [`key_${i}`, `new_value_${i}`]),
  )

  let smallTarget: Record<string, number>
  let mediumBase: Record<string, number>
  let nestedTarget: Record<string, any>
  let largeTarget: Record<string, { value: number }>
  let mergeArrayTarget: Record<PropertyKey, any>
  let assignTarget: Record<string, number>
  let conflictTarget: Record<string, number>

  // DM-01: Two objects merge / 两对象合并
  it('small objects, 10 props', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench(
          'two source objects',
          {
            beforeEach: () => {
              smallTarget = { a: 1, b: 2, c: 3, d: 4, e: 5 }
            },
          },
          () => deepMerge(smallTarget, smallSource),
        ),
      ],
      { time: 1000, iterations: 500 },
    )
  })

  // DM-02: Multiple sources merge / 多源合并
  it('multiple sources, medium objects', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench(
          'multiple sources (5)',
          {
            beforeEach: () => {
              mediumBase = Object.fromEntries(
                Array.from({ length: 20 }, (_, i) => [`base_${i}`, i]),
              )
            },
          },
          () => deepMerge(mediumBase, ...mediumSources),
        ),
      ],
      { time: 1000, iterations: 200 },
    )
  })

  // DM-03: Deep nested merge / 深度嵌套合并
  it('deeply nested merge, depth=5 width=5', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench(
          'deeply nested merge',
          {
            beforeEach: () => {
              nestedTarget = generateNested(5)
            },
          },
          () => deepMerge(nestedTarget, nestedSource),
        ),
      ],
      { time: 1000, iterations: 100 },
    )
  })

  // DM-04: Large object merge / 大型对象合并
  it('large objects, 1000 props', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench(
          'large objects',
          {
            beforeEach: () => {
              largeTarget = Object.fromEntries(
                Array.from({ length: 1000 }, (_, i) => [`target_${i}`, { value: i }]),
              )
            },
          },
          () => deepMerge(largeTarget, largeSource),
        ),
      ],
      { time: 2000, iterations: 50 },
    )
  })

  // DM-05: withArray mode / 数组合并模式
  it('deepMergeWithArray, arrays present', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench(
          'deepMergeWithArray',
          {
            beforeEach: () => {
              // Fresh copy of the mutable merge target (mirrors MERGE_WITH_ARRAY_SOURCES[0])
              // 可变合并目标的全新副本（对应 MERGE_WITH_ARRAY_SOURCES[0]）
              mergeArrayTarget = { arr: [1, 2], obj: { x: 1 } }
            },
          },
          () =>
            deepMergeWithArray(
              mergeArrayTarget,
              MERGE_WITH_ARRAY_SOURCES[1] as Record<PropertyKey, any>,
              MERGE_WITH_ARRAY_SOURCES[2] as Record<PropertyKey, any>,
            ),
        ),
      ],
      { time: 1000, iterations: 200 },
    )
  })

  // DM-06 ~ DM-07: Same 100-prop scale, Object.assign baseline vs deepMerge conflict scenario
  // DM-06 ~ DM-07: 同为 100 props 规模，Object.assign 基线与 deepMerge 冲突场景对比
  // Both sides write 100 distinct keys, so the two rows do equal work
  // 两侧均写入 100 个互不相同的键，工作量对等
  it('object.assign vs deepMerge, 100 props', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench(
          'object.assign',
          {
            beforeEach: () => {
              assignTarget = Object.fromEntries(
                Array.from({ length: 100 }, (_, i) => [`t_${i}`, i]),
              )
            },
          },
          () => Object.assign(assignTarget, assignSource),
        ),
        bench(
          'high conflict rate',
          {
            beforeEach: () => {
              conflictTarget = Object.fromEntries(
                Array.from({ length: 100 }, (_, i) => [`key_${i}`, i]),
              )
            },
          },
          () => deepMerge(conflictTarget, conflictSource),
        ),
      ],
      { time: 1000, iterations: 200 },
    )
  })
})
