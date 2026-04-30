import { describe, expect, it } from 'vitest'
import { combineURLs } from './combine-urls'

describe('url > combineURLs', () => {
  it('should work', () => {
    expect(combineURLs('http://example.com')).toEqual('http://example.com')

    expect(combineURLs('foo', 'bar')).toEqual('foo/bar')
    expect(combineURLs('http://example.com', 'foo', 'bar')).toEqual('http://example.com/foo/bar')
    expect(combineURLs('//example.com/', '/foo/', '/bar/')).toEqual('//example.com/foo/bar/')
    expect(combineURLs('//example.com/', '/foo//bar', '//baz//')).toEqual(
      '//example.com/foo/bar/baz/',
    )
  })

  it('should return processed urls when baseUrl is empty string', () => {
    expect(combineURLs('', 'foo')).toEqual('foo')
    expect(combineURLs('', 'foo', 'bar')).toEqual('foo/bar')
    expect(combineURLs('', '/foo')).toEqual('foo')
  })

  it('should handle null and undefined baseUrl', () => {
    expect(combineURLs(undefined as any, 'foo')).toEqual('foo')
    expect(combineURLs(null as any, 'foo')).toEqual('foo')
  })

  it('should handle backslashes', () => {
    expect(combineURLs('http://example.com', 'foo\\bar', 'baz')).toEqual(
      'http://example.com/foo/bar/baz',
    )
  })

  it('should preserve URL protocol slashes', () => {
    expect(combineURLs('base', 'http://example.com', 'foo')).toEqual('base/http://example.com/foo')
    expect(combineURLs('base', 'https://example.com')).toEqual('base/https://example.com')
    expect(combineURLs('base', 'ftp://files.example.com')).toEqual('base/ftp://files.example.com')
  })

  it('should still collapse multiple slashes when not part of protocol', () => {
    expect(combineURLs('base', 'path//foo')).toEqual('base/path/foo')
  })
})
