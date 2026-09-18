import { describe, it } from 'vitest'
import { zip } from '../../array/zip.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Array > Zip', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const numbers10k = Array.from({ length: 10000 }, (_, i) => i)
  const strings10k = Array.from({ length: 10000 }, (_, i) => `item_${i}`)
  const booleans10k = Array.from({ length: 10000 }, (_, i) => i % 2 === 0)
  const objects10k = Array.from({ length: 10000 }, (_, i) => ({ id: i }))
  const numbers10 = Array.from({ length: 10 }, (_, i) => i)
  const strings10 = Array.from({ length: 10 }, (_, i) => `item_${i}`)

  // ZP-01 + ZP-04: Same 10K scale and run options, so they share one comparison table
  // ZP-01 + ZP-04: 同为 10K 规模且运行参数相同，放在同一张对比表中
  it('10K items, 2 arrays', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('zip', () => zip(numbers10k, strings10k)),
        bench('manual loop baseline', () => {
          const minLength = Math.min(numbers10k.length, strings10k.length)
          const result: unknown[][] = []
          for (let i = 0; i < minLength; i++) {
            result.push([numbers10k[i], strings10k[i]])
          }
          return result
        }),
      ],
      { time: 1000, iterations: 200 },
    )
  })

  // ZP-02: Four arrays / 四个数组
  it('10K items, 4 arrays', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [bench('zip', () => zip(numbers10k, strings10k, booleans10k, objects10k))],
      { time: 1000, iterations: 100 },
    )
  })

  // ZP-03: Small arrays / 小数组
  it('small arrays, 2 arrays', async ({ bench }) => {
    await runBenchmarks(bench, [bench('zip', () => zip(numbers10, strings10))], {
      time: 1000,
      iterations: 500,
    })
  })
})
