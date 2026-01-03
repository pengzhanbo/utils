import { describe, expect, it } from 'vitest'
import { ensureSuffix } from './ensure-suffix'

describe('string > ensureSuffix', () => {
  it('should work with empty', () => {
    expect(ensureSuffix('', '.com')).toBe('.com')
    expect(ensureSuffix('', '')).toBe('')
    expect(ensureSuffix('foo', '.com')).toBe('foo.com')
  })
  it('should work', () => {
    expect(ensureSuffix('example.com', '.com')).toBe('example.com')
    expect(ensureSuffix('//example', '.com')).toBe('//example.com')
  })
})
