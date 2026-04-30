import { describe, expect, test } from 'vitest'
import { template } from './template'

describe('template', () => {
  test('basic interpolation', () => {
    expect(template('Hello, {{name}}!', { name: 'World' })).toBe('Hello, World!')
  })

  test('multiple placeholders', () => {
    expect(template('{{greeting}}, {{name}}', { greeting: 'Hi', name: 'there' })).toBe('Hi, there')
  })

  test('numeric values', () => {
    expect(template('{{a}} + {{b}} = {{c}}', { a: 1, b: 2, c: 3 })).toBe('1 + 2 = 3')
  })

  test('missing values are left as placeholder', () => {
    expect(template('Hello, {{name}}!', {})).toBe('Hello, {{name}}!')
  })

  test('unclosed placeholder preserves prefix', () => {
    expect(template('Hello, {{name', { name: 'World' })).toBe('Hello, {{name')
  })

  test('empty string', () => {
    expect(template('', { name: 'World' })).toBe('')
  })

  test('no placeholders', () => {
    expect(template('Hello, World!', { name: 'World' })).toBe('Hello, World!')
  })

  test('custom prefix and suffix', () => {
    expect(template('<%name%>', { name: 'World' }, { prefix: '<%', suffix: '%>' })).toBe('World')
  })

  test('adjacent placeholders', () => {
    expect(template('{{a}}{{b}}', { a: '1', b: '2' })).toBe('12')
  })

  test('placeholder with special characters', () => {
    expect(template('{{user.name}}', { 'user.name': 'John' })).toBe('John')
  })

  test('empty values', () => {
    expect(template('Hello, {{name}}!', { name: '' })).toBe('Hello, !')
  })

  test('value is converted to string', () => {
    expect(template('Count: {{count}}', { count: 42 })).toBe('Count: 42')
  })

  test('whitespace in placeholder', () => {
    expect(template('Hello, {{ name }}!', { name: 'World' })).toBe('Hello, World!')
    expect(template('{{ a }} + {{ b }}', { a: 1, b: 2 })).toBe('1 + 2')
  })

  test('unknown template variables are left as placeholder', () => {
    expect(template('Hello, {{unknown}}!', {})).toBe('Hello, {{unknown}}!')
    expect(template('{{a}} and {{b}} and {{c}}', { a: '1' })).toBe('1 and {{b}} and {{c}}')
  })

  test('missing value with whitespace inside placeholder', () => {
    expect(template('Hello, {{ name }}!', {})).toBe('Hello, {{name}}!')
  })

  test('empty placeholder', () => {
    expect(template('Hello, {{}}!', {})).toBe('Hello, {{}}!')
  })

  test('multiple unclosed placeholders', () => {
    expect(template('{{a}}{{b}}{{c}}', {})).toBe('{{a}}{{b}}{{c}}')
    expect(template('{{a}} text {{b', {})).toBe('{{a}} text {{b')
  })

  test('partial placeholder - no opening prefix', () => {
    expect(template('Hello, name}}!', { name: 'World' })).toBe('Hello, name}}!')
  })

  test('mixed valid and invalid placeholders', () => {
    expect(template('{{valid}} and {{invalid', { valid: 'yes' })).toBe('yes and {{invalid')
    expect(template('{{a}} and {{b}} and {{c', { a: '1', b: '2' })).toBe('1 and 2 and {{c')
  })

  test('unclosed placeholder at end of string preserves prefix', () => {
    expect(template('prefix {{key', {})).toBe('prefix {{key')
    expect(template('{{only', {})).toBe('{{only')
  })

  test('unclosed placeholder with text after it preserves prefix', () => {
    // When suffix is never found, everything from the unclosed prefix onward is preserved
    expect(template('{{open more text', {})).toBe('{{open more text')
    expect(template('before {{unclosed after', {})).toBe('before {{unclosed after')
  })

  test('custom prefix/suffix with unclosed placeholder', () => {
    expect(template('Hello <%name', { name: 'World' }, { prefix: '<%', suffix: '%>' })).toBe(
      'Hello <%name',
    )
  })

  test('overlapping: unclosed prefix before valid placeholder', () => {
    // {{a has no matching }}, but {{b}} is valid — {{a should be literal text
    expect(template('{{a hello {{b}}', { b: 'world' })).toBe('{{a hello world')
    expect(template('{{x}} and {{y text {{z}}', { x: 'X', z: 'Z' })).toBe('X and {{y text Z')
  })

  test('overlapping: multiple unclosed before valid placeholder', () => {
    // Two unclosed {{ before a valid one
    expect(template('{{p1 {{p2 {{valid}}', { valid: 'ok' })).toBe('{{p1 {{p2 ok')
  })

  test('overlapping: valid, then unclosed, then valid', () => {
    expect(
      template('{{first}} mid {{unclosed {{second}}', {
        first: 'A',
        second: 'B',
      }),
    ).toBe('A mid {{unclosed B')
  })

  test('overlapping with custom delimiters', () => {
    expect(template('<%open <%closed%>', { closed: 'done' }, { prefix: '<%', suffix: '%>' })).toBe(
      '<%open done',
    )
  })

  test('does not leak Object.prototype.constructor', () => {
    expect(template('{{constructor}}', {})).toBe('{{constructor}}')
  })

  test('does not leak Object.prototype.toString', () => {
    expect(template('{{toString}}', {})).toBe('{{toString}}')
  })

  test('does not leak Object.prototype.__proto__', () => {
    expect(template('{{__proto__}}', {})).toBe('{{__proto__}}')
  })

  test('own property interpolation still works after prototype leak fix', () => {
    expect(template('{{name}}', { name: 'World' })).toBe('World')
    expect(template('{{a}} + {{b}}', { a: 1, b: 2 })).toBe('1 + 2')
  })

  test('empty prefix returns original string', () => {
    expect(template('hello', {}, { prefix: '', suffix: '}}' })).toBe('hello')
  })

  test('empty suffix returns original string', () => {
    expect(template('hello', {}, { prefix: '{{', suffix: '' })).toBe('hello')
  })

  test('empty prefix and suffix returns original string', () => {
    expect(template('hello', {}, { prefix: '', suffix: '' })).toBe('hello')
  })

  test('undefined value returns empty string', () => {
    expect(template('{{name}}', { name: undefined })).toBe('')
  })

  test('null value returns empty string', () => {
    expect(template('{{name}}', { name: null })).toBe('')
  })

  test('mixed nullish and non-nullish values', () => {
    expect(template('{{a}} and {{b}}', { a: 'hello', b: null })).toBe('hello and ')
  })
})
