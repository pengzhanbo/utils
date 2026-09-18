import { describe, it } from 'vitest'
import { orderBy } from '../../array/order-by.js'
import { runBenchmarks } from '../helpers/baseline.js'
import { generateUserArray } from '../helpers/data-generators.js'
import { MEDIUM_USER_ARRAY } from '../helpers/fixtures.js'

describe('performance > Array > OrderBy', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const smallUsers = generateUserArray(100)
  const mediumUsers = MEDIUM_USER_ARRAY
  const largeUsers = generateUserArray(100000)
  const sortedUsers = [...mediumUsers].sort((a, b) => a.id - b.id)
  const reversedUsers = [...mediumUsers].sort((a, b) => b.id - a.id)

  // Native Array.sort mutates its input, so every iteration needs a fresh copy
  // 原生 Array.sort 会修改入参，因此每次迭代都需要一份新副本
  let nativeSortInput: typeof mediumUsers = [...mediumUsers]

  // SO-01: Small array single field sort / 小数组单字段排序
  it('small array (100 items)', async ({ bench }) => {
    await runBenchmarks(bench, [bench('single field sort', () => orderBy(smallUsers, 'age'))], {
      time: 1000,
      iterations: 500,
    })
  })

  // SO-02 + SO-06 ~ SO-09: Same 10K scale and run options, so they share one comparison table
  // SO-02 + SO-06 ~ SO-09: 同为 10K 规模且运行参数相同，放在同一张对比表中
  it('10K items, orderBy variants', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('single field sort', () => orderBy(mediumUsers, 'age')),
        bench('mixed sort directions', () =>
          orderBy(mediumUsers, ['score', 'id'], ['desc', 'asc'])),
        bench(
          'native Array.sort',
          {
            beforeEach: () => {
              nativeSortInput = [...mediumUsers]
            },
          },
          () => nativeSortInput.sort((a, b) => a.age - b.age),
        ),
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
          orderBy(mediumUsers, ['department', 'age', 'name'], ['asc', 'desc', 'asc'])),
        bench('function as sort key', () =>
          orderBy(mediumUsers, [(item): string => item.name.toLowerCase()])),
      ],
      { time: 2000, iterations: 50 },
    )
  })
})
