import { describe, it } from 'vitest'
import { template } from '../../string/template.js'
import { runBenchmarks } from '../helpers/baseline.js'
import {
  SMALL_TEMPLATE,
  SMALL_TEMPLATE_VALUES,
  MEDIUM_TEMPLATE,
  DENSE_TEMPLATE,
} from '../helpers/fixtures.js'

describe('performance > String > Template', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const plainString = 'This is a plain string without any variables'

  const longTemplateValues: Record<string, string> = {
    name: 'World',
    app: 'MyApp',
    role: 'admin',
    count: '42',
    items: 'notifications',
  }
  let longTemplate =
    'Hello {{name}}, welcome to {{app}}. Your {{role}} dashboard shows {{count}} {{items}}.'
  for (let i = 0; i < 15; i++) {
    longTemplateValues[`extra_${i}`] = `value_${i}`
    longTemplate += ` {{extra_${i}}}`
  }

  const stringValuesTemplate = Array.from({ length: 20 }, (_, i) => `{{var_${i}}}`).join(' | ')
  const stringValues: Record<string, string> = {}
  for (let i = 0; i < 20; i++) {
    stringValues[`var_${i}`] = `value_${i}`
  }

  const mixedTemplate =
    '{{a}} + {{b}} = {{c}}, {{d}} is {{e}}, count={{f}}, flag={{g}}, nil={{h}}, {{i}} and {{j}}'
  const mixedValues: Record<string, unknown> = {
    a: 1,
    b: 2,
    c: 3,
    d: 'active',
    e: true,
    f: 42,
    g: false,
    h: null,
    i: 'hello',
    j: 'world',
  }

  // TM-01: Short template / 简短模板
  // TM-05: No variables (fast path) / 无变量（快速路径）
  // TM-01 + TM-05: Short inputs; sub-microsecond rows, so each sample batches 1000 calls to
  // escape the timer resolution floor / 短输入；亚微秒级基准，每次采样批量执行 1000 次调用以脱离计时器分辨率下限
  it('small strings', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('short template', () => {
          let acc = 0
          for (let i = 0; i < 1000; i++) {
            acc += template(SMALL_TEMPLATE, SMALL_TEMPLATE_VALUES).length
          }
          return acc
        }),
        bench('no variables', () => {
          let acc = 0
          for (let i = 0; i < 1000; i++) {
            acc += template(plainString, {}).length
          }
          return acc
        }),
      ],
      { time: 1000, iterations: 100 },
    )
  })

  // TM-02: Medium template / 中等模板
  // TM-07: Mixed type values / 混合类型值（需要 String() 转换）
  // TM-02 + TM-07: 10 variables each / 各含 10 个变量
  it('10-variable templates', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('medium template', () => template(MEDIUM_TEMPLATE.template, MEDIUM_TEMPLATE.values)),
        bench('mixed type values', () => template(mixedTemplate, mixedValues)),
      ],
      { time: 1000, iterations: 500 },
    )
  })

  // TM-03: Long template / 长模板
  // TM-04: High variable density / 高密度变量
  // TM-06: String values fast path / 字符串值快速路径（typeof 优化）
  // TM-03 + TM-04 + TM-06: 20 variables each / 各含 20 个变量
  it('20-variable templates', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('long template', () => template(longTemplate, longTemplateValues)),
        bench('high variable density', () =>
          template(DENSE_TEMPLATE.template, DENSE_TEMPLATE.values)),
        bench('string values only', () => template(stringValuesTemplate, stringValues)),
      ],
      { time: 1000, iterations: 500 },
    )
  })
})
