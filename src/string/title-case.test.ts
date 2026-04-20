import { describe, expect, it } from 'vitest'
import { titleCase } from './title-case'

describe('string > titleCase', () => {
  it('should capitalize each word', () => {
    expect(titleCase('hello world')).toBe('Hello World')
    expect(titleCase('foo bar baz')).toBe('Foo Bar Baz')
  })

  it('should handle camelCase', () => {
    expect(titleCase('helloWorld')).toBe('Hello World')
    expect(titleCase('fooBarBaz')).toBe('Foo Bar Baz')
  })

  it('should handle snake_case', () => {
    expect(titleCase('hello_world')).toBe('Hello World')
    expect(titleCase('foo_bar_baz')).toBe('Foo Bar Baz')
  })

  it('should handle kebab-case', () => {
    expect(titleCase('hello-world')).toBe('Hello World')
    expect(titleCase('foo-bar-baz')).toBe('Foo Bar Baz')
  })

  it('should handle mixed case', () => {
    expect(titleCase('HELLO WORLD')).toBe('Hello World')
  })

  it('should handle emojis', () => {
    expect(titleCase('hello 🚀 world')).toBe('Hello 🚀 World')
  })

  it('should return empty string for empty input', () => {
    expect(titleCase('')).toBe('')
    expect(titleCase('   ')).toBe('')
  })

  it('should handle single word', () => {
    expect(titleCase('hello')).toBe('Hello')
    expect(titleCase('HELLO')).toBe('Hello')
  })

  it('should handle numbers', () => {
    expect(titleCase('hello 123 world')).toBe('Hello 123 World')
    expect(titleCase('test 123')).toBe('Test 123')
  })
})
