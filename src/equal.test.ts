import { expect, it } from 'vitest'
import { deepEqual } from './equal'

it('deepEqual', () => {
  expect(deepEqual(1, 1)).toBe(true)
  expect(deepEqual(undefined, undefined)).toBe(true)
  expect(deepEqual(null, null)).toBe(true)
  expect(deepEqual(false, false)).toBe(true)
  expect(deepEqual('', '')).toBe(true)
  expect(deepEqual([1, 2], [1, 2])).toBe(true)
  expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true)
  expect(deepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true)
  expect(deepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 2] } })).toBe(true)
})
