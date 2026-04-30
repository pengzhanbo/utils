import { describe, bench } from 'vitest'
import { escape, unescape, escapeRegExp } from '../../string/escape'

describe('Performance > String > Escape', () => {
  // ES-01: Short HTML string / 短HTML字符串
  bench(
    'escape | short string (50 chars, 5 special chars)',
    () => {
      escape('<div class="test">Hello & World</div>')
    },
    { time: 1000, iterations: 1000 },
  )

  // ES-02: Medium HTML string / 中等HTML字符串
  bench(
    'escape | medium HTML (500 chars, ~50 special chars)',
    () => {
      const str = Array.from(
        { length: 50 },
        (_, i) => `<p attr${i}="value${i}">Text ${i} &amp; content</p>`,
      ).join('')
      escape(str)
    },
    { time: 1000, iterations: 500 },
  )

  // ES-03: Heavy special chars / 高密度特殊字符
  bench(
    'escape | heavy special chars (all 5 types repeated)',
    () => {
      const str = '&<>\'"'.repeat(200)
      escape(str)
    },
    { time: 1000, iterations: 500 },
  )

  // ES-04: No special chars (fast path) / 无特殊字符（快速路径）
  bench(
    'escape | plain text (no escaping needed)',
    () => {
      escape('This is a plain text without any special characters that need escaping')
    },
    { time: 1000, iterations: 1000 },
  )

  // ES-05: Unescape operation / 反转义操作
  bench(
    'unescape | medium HTML entities string',
    () => {
      const str = '&lt;p&gt;Text &amp;amp; &quot;quoted&quot;&#39;apos&#39;&lt;/p&gt;'.repeat(50)
      unescape(str)
    },
    { time: 1000, iterations: 500 },
  )

  // ES-06: escapeRegExp / 正则转义
  bench(
    'escapeRegExp | string with regex special chars',
    () => {
      escapeRegExp('[link](https://example.com/path?query=value&other=123)')
    },
    { time: 1000, iterations: 1000 },
  )

  // ES-07: XSS attack pattern / XSS攻击模式
  bench(
    'escape | XSS prevention pattern',
    () => {
      const str = '<script>alert("XSS")</script><img src=x onerror=alert(1)>'
      escape(str)
    },
    { time: 1000, iterations: 1000 },
  )
})
