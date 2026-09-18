import { describe, it } from 'vitest'
import { mapValues } from '../../object/map-values.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Object > MapValues', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const source: Record<string, number> = Object.fromEntries(
    Array.from({ length: 10000 }, (_, i) => [`key_${i}`, i]),
  )

  // MV-01 ~ MV-02: Same 10K-key scale, so they share one comparison table
  // MV-01 ~ MV-02: 同为 10K 键规模，放在同一张对比表中
  it('10K keys', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('numeric transform', () => mapValues(source, (v) => v * 2)),
        bench('string concat', () => mapValues(source, (v, k) => `${k}_${v}`)),
      ],
      { time: 1000, iterations: 100 },
    )
  })
})
