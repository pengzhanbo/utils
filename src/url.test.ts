import { expect, it } from 'vitest'
import { combineURLs, isAbsoluteUrl, isHttp, isUrl, parseProtocol } from './url'

it('isHttp', () => {
  expect(isHttp('http://example.com')).toBe(true)
  expect(isHttp('https://example.com')).toBe(true)
  expect(isHttp('mailto:username@example.com')).toBe(false)
})

it('isUrl', () => {
  expect(isUrl('http://example.com')).toBe(true)
  expect(isUrl('https://example.com')).toBe(true)
  expect(isUrl('mailto:username@example.com')).toBe(true)
  expect(isUrl('example.com')).toBe(false)
})

it('isAbsoluteUrl', () => {
  expect(isAbsoluteUrl('http://example.com')).toBe(true)
  expect(isAbsoluteUrl('https://example.com')).toBe(true)
  expect(isAbsoluteUrl('mailto:username@example.com')).toBe(false)
  expect(isAbsoluteUrl('example.com')).toBe(false)
  expect(isAbsoluteUrl('//example.com')).toBe(true)
  expect(isAbsoluteUrl('/example.com')).toBe(false)
})

it('combineURLs', () => {
  expect(combineURLs('http://example.com')).toEqual('http://example.com')
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
  expect(parseProtocol('example.com')).toEqual('')
})
