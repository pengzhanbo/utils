import { describe, expect, it } from 'vitest'
import { escape, escapeRegExp, unescape } from './escape'

describe('string > escape', () => {
  it('should escape HTML special characters', () => {
    expect(escape('')).toEqual('')
    expect(escape('<')).toEqual('&lt;')
    expect(escape('<a>')).toEqual('&lt;a&gt;')
    expect(escape('<a href="https://example.com">')).toEqual(
      '&lt;a href=&quot;https://example.com&quot;&gt;',
    )
    expect(escape('<script>alert(1)</script>')).toEqual('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(escape('&')).toEqual('&amp;')
    expect(escape('"')).toEqual('&quot;')
    expect(escape("'")).toEqual('&#39;')
    expect(escape('<>&"\'')).toEqual('&lt;&gt;&amp;&quot;&#39;')
    expect(escape('normal text')).toEqual('normal text')
    expect(escape('1234567890')).toEqual('1234567890')
    expect(escape(' ')).toEqual(' ')
    expect(escape('\n')).toEqual('\n')
  })

  it('should escape backtick character', () => {
    expect(escape('`')).toEqual('&#96;')
    expect(escape('<>`')).toEqual('&lt;&gt;&#96;')
    expect(escape('`hello`')).toEqual('&#96;hello&#96;')
    expect(escape('<script>`code`</script>')).toEqual('&lt;script&gt;&#96;code&#96;&lt;/script&gt;')
  })

  it('should escape all six HTML characters together', () => {
    expect(escape('&<>"\'`')).toEqual('&amp;&lt;&gt;&quot;&#39;&#96;')
  })

  it('should round-trip escape and unescape for all characters', () => {
    const original = '&<>"\'`'
    expect(unescape(escape(original))).toBe(original)
  })
})

describe('string > escapeRegExp', () => {
  it('should escape all RegExp special characters', () => {
    const escaped = '\\^\\$\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\\\'
    const unescaped = '^$.*+?()[]{}|\\'
    expect(escapeRegExp(unescaped + unescaped)).toBe(escaped + escaped)
    expect(escapeRegExp('abc')).toBe('abc')
  })

  it('should handle empty string', () => {
    expect(escapeRegExp('')).toBe('')
  })

  it('should handle string with no special characters', () => {
    expect(escapeRegExp('hello world 123')).toBe('hello world 123')
  })

  it('should escape forward slash', () => {
    expect(escapeRegExp('[link](https://sub.domain.com/)')).toBe(
      '\\[link\\]\\(https://sub\\.domain\\.com/\\)',
    )
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
    expect(unescape('&#39;')).toBe("'")
    expect(unescape('&#039;')).toBe("'")
    expect(unescape('&#000039;')).toBe("'")
  })

  it('should handle empty string', () => {
    expect(unescape('')).toBe('')
  })

  it('should handle string without entities', () => {
    expect(unescape('hello world')).toBe('hello world')
    expect(unescape('123')).toBe('123')
  })

  it('should handle ampersand without semicolon', () => {
    expect(unescape('&')).toBe('&')
    expect(unescape('&amp')).toBe('&amp')
    expect(unescape('a & b')).toBe('a & b')
  })

  it('should handle ampersand with semicolon too far away', () => {
    expect(unescape('&abcdefghijklmnopq;')).toBe('&abcdefghijklmnopq;')
  })

  it('should handle unknown entities', () => {
    expect(unescape('&unknown;')).toBe('&unknown;')
    expect(unescape('&foo;')).toBe('&foo;')
  })

  it('should handle numeric entity variants', () => {
    expect(unescape('&#39;')).toBe("'")
    expect(unescape('&#039;')).toBe("'")
    expect(unescape('&#0039;')).toBe("'")
    expect(unescape('&#000039;')).toBe("'")
  })

  it('should unescape backtick entity &#96;', () => {
    expect(unescape('&#96;')).toBe('`')
    expect(unescape('hello&#96;world')).toBe('hello`world')
  })

  it('should unescape numeric entity variants with leading zeros', () => {
    expect(unescape('&#096;')).toBe('`')
    expect(unescape('&#0096;')).toBe('`')
    expect(unescape('&#x60;')).toBe('`')
    expect(unescape('&#x060;')).toBe('`')
    expect(unescape('&#039;')).toBe("'")
    expect(unescape('&#0039;')).toBe("'")
    expect(unescape('&#x27;')).toBe("'")
    expect(unescape('&#38;')).toBe('&')
  })

  it('should handle invalid numeric entities', () => {
    expect(unescape('&#abc;')).toBe('&#abc;')
    expect(unescape('&#3a;')).toBe('&#3a;')
    expect(unescape('&#0a9;')).toBe('&#0a9;')
    expect(unescape('&#00x9;')).toBe('&#00x9;')
    expect(unescape('&#xG;')).toBe('&#xG;')
    expect(unescape('&#xD800;')).toBe('&#xD800;')
    expect(unescape('&#55296;')).toBe('&#55296;')
  })

  it('should handle multiple entities in sequence', () => {
    expect(unescape('&amp;&amp;&amp;')).toBe('&&&')
    expect(unescape('&lt;&gt;')).toBe('<>')
  })

  it('should handle entity at end of string', () => {
    expect(unescape('hello&amp;')).toBe('hello&')
  })

  it('should handle entity at start of string', () => {
    expect(unescape('&amp;hello')).toBe('&hello')
  })

  it('should preserve non-entity ampersand followed by valid entity', () => {
    expect(unescape('&amp;&lt;')).toBe('&<')
  })
})
