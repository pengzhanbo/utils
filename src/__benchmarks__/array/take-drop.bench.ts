import { describe, it } from 'vitest'
import { dropRight } from '../../array/drop-right.js'
import { drop } from '../../array/drop.js'
import { takeRight } from '../../array/take-right.js'
import { take } from '../../array/take.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Array > TakeDrop', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const numbers10k = Array.from({ length: 10000 }, (_, i) => i)
  const numbers10 = Array.from({ length: 10 }, (_, i) => i)

  // TD-01 ~ TD-04: Same 10K scale and run options, so they share one comparison table
  // TD-01 ~ TD-04: 同为 10K 规模且运行参数相同，放在同一张对比表中
  it('10K items, take & drop', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('take', () => take(numbers10k, 5000)),
        bench('drop', () => drop(numbers10k, 5000)),
        bench('takeRight', () => takeRight(numbers10k, 5000)),
        bench('dropRight', () => dropRight(numbers10k, 5000)),
      ],
      { time: 1000, iterations: 200 },
    )
  })

  // TD-05 ~ TD-08: Same small scale and run options, so they share one comparison table
  // TD-05 ~ TD-08: 同为小数组规模且运行参数相同，放在同一张对比表中
  it('small array, take & drop', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('take', () => take(numbers10, 3)),
        bench('drop', () => drop(numbers10, 3)),
        bench('takeRight', () => takeRight(numbers10, 3)),
        bench('dropRight', () => dropRight(numbers10, 3)),
      ],
      { time: 1000, iterations: 1000 },
    )
  })
})
