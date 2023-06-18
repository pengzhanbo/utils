import { expect, it } from 'vitest'
import { combineURLs, parseProtocol } from './url'

it('combineURLs', () => {
  expect(combineURLs('foo', 'bar')).toEqual('foo/bar')
  expect(combineURLs('http://example.com', 'foo', 'bar')).toEqual(
    'http://example.com/foo/bar',
  )
  expect(combineURLs('//example.com/', '/foo/', '/bar/')).toEqual(
    '//example.com/foo/bar/',
  )
  expect(combineURLs('//example.com/', '/foo//bar', '//baz//')).toEqual(
    '//example.com/foo/bar/baz/',
  )
})

it('parseProtocol', () => {
  expect(parseProtocol('http://example.com')).toEqual('http')
  expect(parseProtocol('mailto:username@example.com')).toEqual('mailto')
})
