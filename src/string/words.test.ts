import { describe, expect, it } from 'vitest'
import { words } from './words'

describe('string > words', () => {
  it('should work with empty', () => {
    expect(words('')).toEqual([])
    expect(words(' ')).toEqual([])
  })

  it('should work with ASCII comma-separated string', () => {
    expect(words('foo,bar,baz')).toEqual(['foo', 'bar', 'baz'])
    expect(words('foo,bar, & baz,')).toEqual(['foo', 'bar', 'baz'])
    expect(words('  leading and trailing whitespace  ')).toEqual([
      'leading',
      'and',
      'trailing',
      'whitespace',
    ])
  })

  it('should work with space-separated string', () => {
    expect(words('foo')).toEqual(['foo'])
    expect(words('foo bar')).toEqual(['foo', 'bar'])
  })

  it('should work with Unicode emojis', () => {
    expect(words('foo🚀bar')).toEqual(['foo', '🚀', 'bar'])
    expect(words('example🚀with✨emojis💡and🔍special🌟characters')).toEqual([
      'example',
      '🚀',
      'with',
      '✨',
      'emojis',
      '💡',
      'and',
      '🔍',
      'special',
      '🌟',
      'characters',
    ])
  })

  it('should work with special characters', () => {
    expect(words('hi@email.com')).toEqual(['hi', 'email', 'com'])
  })

  it('should work with camelCase string', () => {
    expect(words('fooBarBaz')).toEqual(['foo', 'Bar', 'Baz'])
  })

  it('should work with PascalCase string', () => {
    expect(words('FooBarBaz')).toEqual(['Foo', 'Bar', 'Baz'])
  })

  it('should work with snake_case string', () => {
    expect(words('foo_bar_baz')).toEqual(['foo', 'bar', 'baz'])
    expect(words('__foo_bar_baz__')).toEqual(['foo', 'bar', 'baz'])
  })

  it('should work with kebab-case string', () => {
    expect(words('foo-bar-baz')).toEqual(['foo', 'bar', 'baz'])
    expect(words('--foo-bar-baz--')).toEqual(['foo', 'bar', 'baz'])
  })

  it('should work with mixed formats', () => {
    expect(words('camelCase_snake_case-kebabCase')).toEqual([
      'camel',
      'Case',
      'snake',
      'case',
      'kebab',
      'Case',
    ])
  })

  it('should work with acronyms', () => {
    expect(words('HTMLResponse')).toEqual(['HTML', 'Response'])
  })

  it('should work with single character', () => {
    expect(words('aB')).toEqual(['a', 'B'])
  })

  it('should work with include numbers in string', () => {
    expect(words('foo1bar2baz3')).toEqual(['foo', '1', 'bar', '2', 'baz', '3'])
    expect(words('123foo')).toEqual(['123', 'foo'])
    expect(words('foo 123 baz')).toEqual(['foo', '123', 'baz'])
  })

  it('should work with chinese', () => {
    expect(words('你好世界')).toEqual(['你好世界'])
    expect(words('你好世界🚀')).toEqual(['你好世界', '🚀'])
    expect(words('你好，世界')).toEqual(['你好', '世界'])
  })

  it('should handle NFD-normalized input', () => {
    const nfdInput = 'café'.normalize('NFD')
    expect(nfdInput).not.toBe('café')
    expect(words(nfdInput)).toEqual(words('café'))
  })
})
