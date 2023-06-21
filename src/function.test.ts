import { expect, it } from 'vitest'
import { compose } from './function'

function add(a: number, b: number) {
  return a + b
}

function multiply(a: number) {
  return a * 2
}

function subtract(a: number) {
  return a - 1
}

it('compose', () => {
  expect(compose(multiply, add)(1, 2)).toBe(6)
  expect(compose(subtract, add)(1, 2)).toBe(2)
  expect(compose(subtract, multiply, add)(1, 2)).toBe(5)
})
