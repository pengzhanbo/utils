import { describe, it } from 'vitest'
import { escape, unescape, escapeRegExp } from '../../string/escape.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > String > Escape', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const shortHtml = '<div class="test">Hello & World</div>'
  const mediumHtml = Array.from(
    { length: 50 },
    (_, i) => `<p attr${i}="value${i}">Text ${i} &amp; content</p>`,
  ).join('')
  const heavySpecialChars = '&<>\'"'.repeat(200)
  const plainText = 'This is a plain text without any special characters that need escaping'
  const mediumEntities =
    '&lt;p&gt;Text &amp;amp; &quot;quoted&quot;&#39;apos&#39;&lt;/p&gt;'.repeat(50)
  const regexSpecial = '[link](https://example.com/path?query=value&other=123)'
  const xssPattern = '<script>alert("XSS")</script><img src=x onerror=alert(1)>'

  // ES-01: Short HTML string / 短HTML字符串
  // ES-04: No special chars (fast path) / 无特殊字符（快速路径）
  // ES-01 + ES-04: Same short-input scale and 1K iterations / 同为短输入规模与 1K 迭代
  it('small strings', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('escape (special chars)', () => escape(shortHtml)),
        bench('escape (plain text)', () => escape(plainText)),
      ],
      { time: 1000, iterations: 1000 },
    )
  })

  // ES-02: Medium HTML string / 中等HTML字符串
  // ES-05: Unescape operation / 反转义操作
  // ES-02 + ES-05: Medium HTML scale, escape vs unescape / 中等 HTML 规模，escape 与 unescape 对比
  it('medium html strings', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('escape', () => escape(mediumHtml)),
        bench('unescape', () => unescape(mediumEntities)),
      ],
      { time: 1000, iterations: 500 },
    )
  })

  // ES-03: Heavy special chars / 高密度特殊字符
  it('heavy special chars', async ({ bench }) => {
    await runBenchmarks(bench, [bench('escape', () => escape(heavySpecialChars))], {
      time: 1000,
      iterations: 500,
    })
  })

  // ES-06: escapeRegExp / 正则转义
  it('escape regexp, regex special chars', async ({ bench }) => {
    await runBenchmarks(bench, [bench('escapeRegExp', () => escapeRegExp(regexSpecial))], {
      time: 1000,
      iterations: 1000,
    })
  })

  // ES-07: XSS attack pattern / XSS攻击模式
  it('xss prevention pattern', async ({ bench }) => {
    await runBenchmarks(bench, [bench('escape', () => escape(xssPattern))], {
      time: 1000,
      iterations: 1000,
    })
  })
})
