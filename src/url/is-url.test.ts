import { describe, expect, it } from 'vitest'
import { isUrl } from './is-url'

describe('url > isUrl', () => {
  it('should be true', () => {
    expect(isUrl('http://example.com')).toBe(true)
    expect(isUrl('https://example.com')).toBe(true)
    expect(isUrl('https://example.com/foo/bar?foo=bar#hash')).toBe(true)

    expect(isUrl('file://example.com')).toBe(true)
    expect(isUrl('mailto:username@example.com')).toBe(true)
  })

  it('should be false', () => {
    expect(isUrl('//example.com')).toBe(false)
    expect(isUrl('example.com')).toBe(false)
    expect(isUrl('/foot/bar')).toBe(false)
  })
})
