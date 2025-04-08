import { describe, expect, it } from 'vitest'
import { combineURLs, ensureLeadingSlash, ensureTrailingSlash, isHttp, isUrl, parseProtocol, removeLeadingSlash, removeTrailingSlash, slash } from './url'

describe('url > slash', () => {
  it('should work', () => {
    expect(slash('')).toEqual('')
    expect(slash('foo\\bar')).toEqual('foo/bar')
    expect(slash('foo\\\\bar/\\baz')).toEqual('foo//bar//baz')
    expect(slash('/foo/bar')).toEqual('/foo/bar')
    expect(slash('\\foo\\bar\\')).toEqual('/foo/bar/')
  })
})

describe('url > ensureLeadingSlash', () => {
  it('should work', () => {
    expect(ensureLeadingSlash('foo/bar')).toEqual('/foo/bar')
    expect(ensureLeadingSlash('/foo/bar')).toEqual('/foo/bar')
  })
})

describe('url > ensureTrailingSlash', () => {
  it('should work', () => {
    expect(ensureTrailingSlash('foo/bar')).toEqual('foo/bar/')
    expect(ensureTrailingSlash('/foo/bar')).toEqual('/foo/bar/')
  })
})

describe('url > removeLeadingSlash', () => {
  it('should work', () => {
    expect(removeLeadingSlash('')).toEqual('')
    expect(removeLeadingSlash('foo/bar')).toEqual('foo/bar')
    expect(removeLeadingSlash('/foo/bar')).toEqual('foo/bar')
  })
})

describe('url > removeTrailingSlash', () => {
  it('should work', () => {
    expect(removeTrailingSlash('')).toEqual('')
    expect(removeTrailingSlash('foo/bar')).toEqual('foo/bar')
    expect(removeTrailingSlash('/foo/bar/')).toEqual('/foo/bar')
  })
})

describe('url > isHttp', () => {
  it('should be true', () => {
    expect(isHttp('http://example.com')).toBe(true)
    expect(isHttp('https://example.com')).toBe(true)
    expect(isHttp('//example.com')).toBe(true)
  })

  it('should be false', () => {
    expect(isHttp('example.com')).toBe(false)
    expect(isHttp('mailto:username@example.com')).toBe(false)
  })
})

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

describe('url > combineURLs', () => {
  it('should work', () => {
    expect(combineURLs('http://example.com')).toEqual('http://example.com')

    expect(combineURLs('foo', 'bar')).toEqual('foo/bar')
    expect(combineURLs('http://example.com', 'foo', 'bar'))
      .toEqual('http://example.com/foo/bar')
    expect(combineURLs('//example.com/', '/foo/', '/bar/'))
      .toEqual('//example.com/foo/bar/')
    expect(combineURLs('//example.com/', '/foo//bar', '//baz//'))
      .toEqual('//example.com/foo/bar/baz/')
  })
})

describe('url > parseProtocol', () => {
  it('should work', () => {
    expect(parseProtocol('http://example.com')).toEqual('http')
    expect(parseProtocol('mailto:username@example.com')).toEqual('mailto')
    expect(parseProtocol('example.com')).toEqual('')
    expect(parseProtocol('//example.com')).toEqual('')
  })
})
