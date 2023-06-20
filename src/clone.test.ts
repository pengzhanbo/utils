import { expect, it } from 'vitest'
import { deepClone, shallowClone, simpleClone } from './clone'

it('simpleClone', () => {
  expect(simpleClone('')).toEqual('')
  expect(simpleClone(1)).toEqual(1)
  expect(simpleClone([1])).toEqual([1])
  expect(simpleClone({ a: 1 })).toEqual({ a: 1 })
  expect(simpleClone(false)).toEqual(false)
})

it('shallowClone', () => {
  expect(shallowClone({ a: 1 })).toEqual({ a: 1 })
  expect(shallowClone([{ a: 1 }])).toEqual([{ a: 1 }])
})

it('deepClone', () => {
  expect(deepClone({ a: 1 })).toEqual({ a: 1 })
  expect(deepClone({ a: { b: { c: 1 } } })).toEqual({ a: { b: { c: 1 } } })
})
