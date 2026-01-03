import { describe, expect, it } from 'vitest'
import { combineURLs } from './combine-urls'

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
