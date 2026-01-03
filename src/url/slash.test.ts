import { describe, expect, it } from 'vitest'
import {
  ensureLeadingSlash,
  ensureTrailingSlash,
  removeLeadingSlash,
  removeTrailingSlash,
  slash,
} from './slash'

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
