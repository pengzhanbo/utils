import { expect, it } from 'vitest'
import { camelCase, capitalize, kebabCase, slash } from './string'

it('slash', () => {
  expect(slash('')).toEqual('')
  expect(slash('foo\\bar')).toEqual('foo/bar')
  expect(slash('foo\\\\bar/\\baz')).toEqual('foo//bar//baz')
})

it('capitalize', () => {
  expect(capitalize('foo')).toEqual('Foo')
  expect(capitalize('foo bar')).toEqual('Foo bar')
  expect(capitalize('Foo')).toEqual('Foo')
})

it('kebabCase', () => {
  expect(kebabCase('foo-bar')).toEqual('foo-bar')
  expect(kebabCase('a b c')).toEqual('a-b-c')
  expect(kebabCase('orderBy')).toEqual('order-by')
  expect(kebabCase('ABC')).toEqual('abc')
  expect(kebabCase('__ABC__')).toEqual('__abc__')
  expect(kebabCase('__orderBy__')).toEqual('__order-by__')
})

it('camelCase', () => {
  expect(camelCase('foo-bar')).toEqual('fooBar')
  expect(camelCase('a b c')).toEqual('aBC')
  expect(camelCase('foo-bar baz_')).toEqual('fooBarBaz_')
  expect(camelCase('1-foo-2-bar')).toEqual('1Foo2Bar')
})
