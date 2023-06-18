import { expect, it } from 'vitest'
import { clamp, inRange } from './math'

it('clamp', () => {
  expect(clamp(2, 1, 3)).toEqual(2)
  expect(clamp(1, 2, 3)).toEqual(2)
  expect(clamp(4, 1, 3)).toEqual(3)
})

it('inRange', () => {
  expect(inRange(2, 1, 3)).toBe(true)
  expect(inRange(6, 1, 3)).toBe(false)
  expect(inRange(3, 5)).toBe(true)
  expect(inRange(6, 5)).toBe(false)
})
