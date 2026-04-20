import { describe, expect, it } from 'vitest'
import { indent } from './indent'

describe('string > indent', () => {
  it('should indent each line with default two spaces', () => {
    expect(indent('hello\nworld')).toBe('  hello\n  world')
    expect(indent('foo\nbar\nbaz')).toBe('  foo\n  bar\n  baz')
  })

  it('should indent each line with custom indent string', () => {
    expect(indent('hello\nworld', '\t')).toBe('\thello\n\tworld')
    expect(indent('hello\nworld', '  ')).toBe('  hello\n  world')
    expect(indent('hello\nworld', '--')).toBe('--hello\n--world')
  })

  it('should handle single line', () => {
    expect(indent('hello')).toBe('  hello')
    expect(indent('hello', '\t')).toBe('\thello')
  })

  it('should handle empty string', () => {
    expect(indent('')).toBe('')
  })

  it('should handle string with trailing newline', () => {
    expect(indent('hello\nworld\n')).toBe('  hello\n  world\n  ')
  })

  it('should handle multiline with empty lines', () => {
    expect(indent('hello\n\nworld')).toBe('  hello\n  \n  world')
  })
})
