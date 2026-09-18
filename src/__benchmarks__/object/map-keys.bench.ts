import { describe, it } from 'vitest'
import { mapKeys } from '../../object/map-keys.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Object > MapKeys', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const source: Record<string, number> = Object.fromEntries(
    Array.from({ length: 10000 }, (_, i) => [`key_${i}`, i]),
  )

  // MK-01 ~ MK-02: Same 10K-key scale, so they share one comparison table
  // MK-01 ~ MK-02: 同为 10K 键规模，放在同一张对比表中
  it('10K keys', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('upper-case keys', () => mapKeys(source, (k) => k.toUpperCase())),
        bench('collision', () => mapKeys(source, () => 'x')),
      ],
      { time: 1000, iterations: 100 },
    )
  })
})
