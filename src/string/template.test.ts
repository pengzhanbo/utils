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

  test('unclosed placeholder', () => {
    expect(template('Hello, {{name', { name: 'World' })).toBe('Hello, name')
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
    expect(template('{{a}} text {{b', {})).toBe('{{a}} text b')
  })

  test('partial placeholder - no opening prefix', () => {
    expect(template('Hello, name}}!', { name: 'World' })).toBe('Hello, name}}!')
  })

  test('mixed valid and invalid placeholders', () => {
    expect(template('{{valid}} and {{invalid', { valid: 'yes' })).toBe('yes and invalid')
    expect(template('{{a}} and {{b}} and {{c', { a: '1', b: '2' })).toBe('1 and 2 and c')
  })
})
