import { describe, expect, it } from 'vitest'
import { ensurePrefix } from './ensure-prefix'

describe('string > ensurePrefix', () => {
  it('should work with empty', () => {
    expect(ensurePrefix('', 'http://')).toBe('http://')
    expect(ensurePrefix('', '')).toBe('')
    expect(ensurePrefix('foo', '')).toBe('foo')
  })
  it('should work', () => {
    expect(ensurePrefix('example.com', 'http://')).toBe('http://example.com')
    expect(ensurePrefix('//example.com', '//')).toBe('//example.com')
  })
})
