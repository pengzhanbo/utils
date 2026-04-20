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

  it('should return baseUrl when baseUrl is empty string', () => {
    expect(combineURLs('', 'foo')).toEqual('')
    expect(combineURLs('', 'foo', 'bar')).toEqual('')
  })

  it('should handle null and undefined baseUrl', () => {
    expect(combineURLs(undefined as any, 'foo')).toBeUndefined()
    expect(combineURLs(null as any, 'foo')).toBeNull()
  })

  it('should handle backslashes', () => {
    expect(combineURLs('http://example.com', 'foo\\bar', 'baz')).toEqual(
      'http://example.com/foo/bar/baz',
    )
  })
})
