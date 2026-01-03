import { describe, expect, it } from 'vitest'
import { escape, escapeRegExp, unescape } from './escape'

describe('string > escape', () => {
  it('should work', () => {
    expect(escape('')).toEqual('')
    expect(escape('<')).toEqual('&lt;')
    expect(escape('<a>')).toEqual('&lt;a&gt;')
    expect(escape('<a href="https://example.com">')).toEqual('&lt;a href=&quot;https://example.com&quot;&gt;')
    expect(escape('<script>alert(1)</script>')).toEqual('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(escape('&')).toEqual('&amp;')
    expect(escape('"')).toEqual('&quot;')
    expect(escape('\'')).toEqual('&#39;')
    expect(escape('<>&"\'')).toEqual('&lt;&gt;&amp;&quot;&#39;')
    expect(escape('normal text')).toEqual('normal text')
    expect(escape('1234567890')).toEqual('1234567890')
    expect(escape(' ')).toEqual(' ')
    expect(escape('\n')).toEqual('\n')
  })
})

describe('string > escapeRegExp', () => {
  it('should work', () => {
    const escaped = '\\^\\$\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\\\'
    const unescaped = '^$.*+?()[]{}|\\'
    expect(escapeRegExp(unescaped + unescaped)).toBe(escaped + escaped)
    expect(escapeRegExp('abc')).toBe('abc')
  })
})

describe('string > unescape', () => {
  it('should work', () => {
    let escaped = '&amp;&lt;&gt;&quot;&#39;/'
    let unescaped = '&<>"\'/'
    escaped += escaped
    unescaped += unescaped

    expect(unescape('&amp;lt;')).toBe('&lt;')
    expect(unescape(escaped)).toBe(unescaped)
    expect(unescape('abc')).toBe('abc')
    expect(unescape(escape(unescaped))).toBe(unescaped)
    expect(unescape('&#39;')).toBe('\'')
    expect(unescape('&#039;')).toBe('\'')
    expect(unescape('&#000039;')).toBe('\'')
  })
})
