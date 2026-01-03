import { describe, expect, it } from 'vitest'
import { toString } from './to-string'

describe('guard > toString', () => {
  it('should work', () => {
    expect(toString(null)).toBe('[object Null]')
    expect(toString('')).toBe('[object String]')
    expect(toString(1)).toBe('[object Number]')
    expect(toString(true)).toBe('[object Boolean]')
    expect(toString([])).toBe('[object Array]')
    expect(toString({})).toBe('[object Object]')
    expect(toString(undefined)).toBe('[object Undefined]')
    expect(toString(() => {})).toBe('[object Function]')
    expect(toString(Symbol(''))).toBe('[object Symbol]')
  })

  it('should work with an object that has toString', () => {
    const obj = { toString: () => 'test' }
    expect(toString(obj)).toBe('[object Object]')
  })

  it('should work with a class that has toString', () => {
    class Test {
      toString() {
        return 'test'
      }
    }
    expect(toString(new Test())).toBe('[object Object]')
  })
})
