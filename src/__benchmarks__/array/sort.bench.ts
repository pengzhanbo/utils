import { describe, it } from 'vitest'
import { orderBy } from '../../array/order-by.js'
import { runBenchmarks } from '../helpers/baseline.js'
import { generateUserArray } from '../helpers/data-generators.js'

describe('performance > Array > OrderBy', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const smallUsers = generateUserArray(100)
  const tenKUsers = generateUserArray(10000)
  const largeUsers = generateUserArray(100000)
  const sortedUsers = [...tenKUsers].sort((a, b) => a.id - b.id)
  const reversedUsers = [...tenKUsers].sort((a, b) => b.id - a.id)

  // SO-01: Small array single field sort / 小数组单字段排序
  it('small array (100 items)', async ({ bench }) => {
    await runBenchmarks(bench, [bench('single field sort', () => orderBy(smallUsers, 'age'))], {
      time: 1000,
      iterations: 500,
    })
  })

  // SO-02 + SO-06 ~ SO-09: Same 10K scale and run options, so they share one comparison table
  // SO-02 + SO-06 ~ SO-09: 同为 10K 规模且运行参数相同，放在同一张对比表中
  //
  // `best case` / `worst case` run on already sorted / reversed data, while `single field sort`
  // runs on the plain (unsorted) data. Their gap comes from the input ordering, not from an
  // implementation difference; read them as a data-shape sensitivity, not as a head-to-head.
  // `best case` / `worst case` 使用已有序 / 逆序的数据，而 `single field sort` 使用原始（无序）
  // 数据。三者的差距来自输入的有序程度，而非实现差异，应将其视为「数据形态敏感度」而非同台对比。
  it('10K items, orderBy variants', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('single field sort', () => orderBy(tenKUsers, 'age')),
        bench('mixed sort directions', () => orderBy(tenKUsers, ['score', 'id'], ['desc', 'asc'])),
        // Native Array.sort mutates its input, so the copy is taken inside the timed function
        // to match the copy `orderBy` performs internally.
        // 原生 Array.sort 会修改入参，因此把复制放进计时函数内，与 `orderBy` 内部的复制口径对齐。
        bench('native Array.sort', () => [...tenKUsers].sort((a, b) => a.age - b.age)),
        bench('best case', () => orderBy(sortedUsers, 'id')),
        bench('worst case', () => orderBy(reversedUsers, 'id')),
      ],
      { time: 2000, iterations: 100 },
    )
  })

  // SO-03: Large array single field sort / 大数组单字段排序
  it('large array (100K items)', async ({ bench }) => {
    await runBenchmarks(bench, [bench('single field sort', () => orderBy(largeUsers, 'age'))], {
      time: 3000,
      iterations: 20,
    })
  })

  // SO-04 ~ SO-05: Same 10K scale and run options, so they share one comparison table
  // SO-04 ~ SO-05: 同为 10K 规模且运行参数相同，放在同一张对比表中
  it('10K items, custom sort keys', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('multi-field sort', () =>
          orderBy(tenKUsers, ['department', 'age', 'name'], ['asc', 'desc', 'asc'])),
        bench('function as sort key', () =>
          orderBy(tenKUsers, [(item): string => item.name.toLowerCase()])),
      ],
      { time: 2000, iterations: 50 },
    )
  })
})
