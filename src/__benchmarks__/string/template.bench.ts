import { describe, bench } from 'vitest'
import { template } from '../../string/template'
import {
  SMALL_TEMPLATE,
  SMALL_TEMPLATE_VALUES,
  MEDIUM_TEMPLATE,
  DENSE_TEMPLATE,
} from '../helpers/fixtures'

describe('Performance > String > Template', () => {
  // TM-01: Short template / 简短模板
  bench(
    'Short template | 50 chars, 2 variables',
    () => {
      template(SMALL_TEMPLATE, SMALL_TEMPLATE_VALUES)
    },
    { time: 1000, iterations: 1000 },
  )

  // TM-02: Medium template / 中等模板
  bench(
    'Medium template | ~250 chars, 10 variables',
    () => {
      template(MEDIUM_TEMPLATE.template, MEDIUM_TEMPLATE.values)
    },
    { time: 1000, iterations: 500 },
  )

  // TM-03: Long template / 长模板
  bench(
    'Long template | 500 chars, 20 variables',
    () => {
      let longTemplate =
        'Hello {{name}}, welcome to {{app}}. Your {{role}} dashboard shows {{count}} {{items}}.'
      const values: Record<string, string> = {
        name: 'World',
        app: 'MyApp',
        role: 'admin',
        count: '42',
        items: 'notifications',
      }
      for (let i = 0; i < 15; i++) {
        values[`extra_${i}`] = `value_${i}`
        longTemplate += ` {{extra_${i}}}`
      }
      template(longTemplate, values)
    },
    { time: 1000, iterations: 500 },
  )

  // TM-04: High variable density / 高密度变量
  bench(
    'High variable density | 20 variables in compact string',
    () => {
      template(DENSE_TEMPLATE.template, DENSE_TEMPLATE.values)
    },
    { time: 1000, iterations: 500 },
  )

  // TM-05: No variables (fast path) / 无变量（快速路径）
  bench(
    'No variables | plain string (no replacement needed)',
    () => {
      template('This is a plain string without any variables', {})
    },
    { time: 1000, iterations: 1000 },
  )

  // TM-06: String values fast path / 字符串值快速路径（typeof 优化）
  bench(
    'String values only | typeof fast path (20 vars)',
    () => {
      const str = Array.from({ length: 20 }, (_, i) => `{{var_${i}}}`).join(' | ')
      const values: Record<string, string> = {}
      for (let i = 0; i < 20; i++) {
        values[`var_${i}`] = `value_${i}`
      }
      template(str, values)
    },
    { time: 1000, iterations: 500 },
  )

  // TM-07: Mixed type values / 混合类型值（需要 String() 转换）
  bench(
    'Mixed type values | number/boolean/string (10 vars)',
    () => {
      const str =
        '{{a}} + {{b}} = {{c}}, {{d}} is {{e}}, count={{f}}, flag={{g}}, nil={{h}}, {{i}} and {{j}}'
      const values: Record<string, unknown> = {
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
      template(str, values)
    },
    { time: 1000, iterations: 500 },
  )
})
