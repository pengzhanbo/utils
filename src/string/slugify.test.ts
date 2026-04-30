import { describe, expect, it } from 'vitest'
import { slugify } from './slugify'

describe('string > slugify', () => {
  it('should convert spaces to hyphens', () => {
    expect(slugify('hello world')).toBe('hello-world')
    expect(slugify('foo bar baz')).toBe('foo-bar-baz')
  })

  it('should handle snake_case', () => {
    expect(slugify('hello_world')).toBe('hello-world')
    expect(slugify('foo_bar_baz')).toBe('foo-bar-baz')
  })

  it('should handle kebab-case', () => {
    expect(slugify('hello-world')).toBe('hello-world')
    expect(slugify('foo-bar-baz')).toBe('foo-bar-baz')
  })

  it('should remove special characters', () => {
    expect(slugify('Hello World!!!')).toBe('hello-world')
    expect(slugify('What???')).toBe('what')
    expect(slugify('foo@#%&bar')).toBe('foo-bar')
    expect(slugify('hello world!@#$%^&*()')).toBe('hello-world')
  })

  it('should remove accents', () => {
    expect(slugify('café')).toBe('cafe')
    expect(slugify('naïve')).toBe('naive')
    expect(slugify('résumé')).toBe('resume')
  })

  it('should handle leading numbers', () => {
    expect(slugify('123hello')).toBe('_123hello')
    expect(slugify('1hello world')).toBe('_1hello-world')
  })

  it('should collapse multiple separators', () => {
    expect(slugify('foo  bar')).toBe('foo-bar')
    expect(slugify('hello---world')).toBe('hello-world')
    expect(slugify('foo...bar')).toBe('foo-bar')
  })

  it('should remove leading and trailing hyphens', () => {
    expect(slugify('  hello  ')).toBe('hello')
    expect(slugify('-hello-')).toBe('hello')
    expect(slugify('---hello---')).toBe('hello')
  })

  it('should return empty string for empty input', () => {
    expect(slugify('')).toBe('')
    expect(slugify('   ')).toBe('')
  })

  it('should convert to lowercase', () => {
    expect(slugify('HELLO WORLD')).toBe('hello-world')
    expect(slugify('HeLLo WoRLD')).toBe('hello-world')
  })

  it('should handle mixed input', () => {
    expect(slugify('Hello World!!!')).toBe('hello-world')
    expect(slugify('What???')).toBe('what')
  })

  it('should remove non-Latin combining marks (e.g. Vietnamese)', () => {
    expect(slugify('Thành phố Hồ Chí Minh')).toBe('thanh-pho-ho-chi-minh')
    expect(slugify('ngữ âm')).toBe('ngu-am')
  })
})
