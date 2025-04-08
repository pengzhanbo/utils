import { expect, it } from 'vitest'
import { camelCase, capitalize, ensurePrefix, ensureSuffix, kebabCase, lowerCase, pascalCase, snakeCase, upperCase, words } from './string'

it('ensurePrefix', () => {
  expect(ensurePrefix('foo', 'bar')).toEqual('foobar')
  expect(ensurePrefix('foo', 'foo')).toEqual('foo')
  expect(ensurePrefix('foo', 'foo/')).toEqual('foo/')
  expect(ensurePrefix('foo/', 'foo')).toEqual('foo/foo')
  expect(ensurePrefix('/foo/', 'foo')).toEqual('/foo/foo')
})

it('ensureSuffix', () => {
  expect(ensureSuffix('foo', 'bar')).toEqual('barfoo')
  expect(ensureSuffix('foo', 'foo')).toEqual('foo')
  expect(ensureSuffix('foo', 'foo/')).toEqual('foo/foo')
  expect(ensureSuffix('foo/', 'foo')).toEqual('foofoo/')
  expect(ensureSuffix('/foo/', 'foo')).toEqual('foo/foo/')
})

it('words', () => {
  expect(words('')).toEqual([])
  expect(words('foo')).toEqual(['foo'])
  expect(words('foo bar')).toEqual(['foo', 'bar'])
  expect(words('fooBarBaz')).toEqual(['foo', 'Bar', 'Baz'])
  expect(words('foo-bar-baz')).toEqual(['foo', 'bar', 'baz'])
  expect(words('foo_bar_baz')).toEqual(['foo', 'bar', 'baz'])
  expect(words('_foo_bar_baz_')).toEqual(['foo', 'bar', 'baz'])
  expect(words('1-foo-2-bar')).toEqual(['1', 'foo', '2', 'bar'])
  expect(words('1foo2bar')).toEqual(['1', 'foo', '2', 'bar'])
  expect(words('张三李四')).toEqual(['张三李四'])
  expect(words('张三,李四_')).toEqual(['张三', '李四'])
  expect(words('张三,李四🚀')).toEqual(['张三', '李四', '🚀'])
})

it('capitalize', () => {
  expect(capitalize('')).toEqual('')
  expect(capitalize('foo')).toEqual('Foo')
  expect(capitalize('foo bar')).toEqual('Foo bar')
  expect(capitalize('Foo')).toEqual('Foo')
})

it('kebabCase', () => {
  expect(kebabCase('')).toEqual('')
  expect(kebabCase('foo-bar')).toEqual('foo-bar')
  expect(kebabCase('a b c')).toEqual('a-b-c')
  expect(kebabCase('orderBy')).toEqual('order-by')
  expect(kebabCase('ABC')).toEqual('abc')
  expect(kebabCase('__ABC__')).toEqual('abc')
  expect(kebabCase('__orderBy__')).toEqual('order-by')
})

it('snakeCase', () => {
  expect(snakeCase('')).toEqual('')
  expect(snakeCase('foo-bar')).toEqual('foo_bar')
  expect(snakeCase('a b c')).toEqual('a_b_c')
  expect(snakeCase('orderBy')).toEqual('order_by')
  expect(snakeCase('ABC')).toEqual('abc')
  expect(snakeCase('__ABC__')).toEqual('abc')
  expect(snakeCase('__orderBy__')).toEqual('order_by')
})

it('camelCase', () => {
  expect(camelCase('')).toEqual('')
  expect(camelCase('foo-bar')).toEqual('fooBar')
  expect(camelCase('a b c')).toEqual('aBC')
  expect(camelCase('foo-bar baz_')).toEqual('fooBarBaz')
  expect(camelCase('1-foo-2-bar')).toEqual('1Foo2Bar')
})

it('lowerCase', () => {
  expect(lowerCase('')).toEqual('')
  expect(lowerCase('foo-bar')).toEqual('foo bar')
  expect(lowerCase('a b c')).toEqual('a b c')
  expect(lowerCase('orderBy')).toEqual('order by')
  expect(lowerCase('ABC')).toEqual('abc')
  expect(lowerCase('__ABC__')).toEqual('abc')
  expect(lowerCase('__orderBy__')).toEqual('order by')
})

it('upperCase', () => {
  expect(upperCase('')).toEqual('')
  expect(upperCase('foo-bar')).toEqual('FOO BAR')
  expect(upperCase('a b c')).toEqual('A B C')
  expect(upperCase('orderBy')).toEqual('ORDER BY')
  expect(upperCase('ABC')).toEqual('ABC')
  expect(upperCase('__ABC__')).toEqual('ABC')
  expect(upperCase('__orderBy__')).toEqual('ORDER BY')
})

it('pascalCase', () => {
  expect(pascalCase('')).toEqual('')
  expect(pascalCase('foo-bar')).toEqual('FooBar')
  expect(pascalCase('a b c')).toEqual('ABC')
  expect(pascalCase('orderBy')).toEqual('OrderBy')
  expect(pascalCase('ABC')).toEqual('Abc')
  expect(pascalCase('__ABC__')).toEqual('Abc')
  expect(pascalCase('__orderBy__')).toEqual('OrderBy')
})
