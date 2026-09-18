import { describe, it } from 'vitest'
import { invert } from '../../object/invert.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Object > Invert', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const source: Record<string, number> = Object.fromEntries(
    Array.from({ length: 10000 }, (_, i) => [`key_${i}`, i]),
  )

  // INV-01: Number values / 数值
  it('number values, 10K keys', async ({ bench }) => {
    await runBenchmarks(bench, [bench('number values', () => invert(source))], {
      time: 1000,
      iterations: 100,
    })
  })
})
