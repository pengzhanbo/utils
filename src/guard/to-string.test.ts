import { describe, expect, it } from 'vitest'
import { toString } from './to-string'

describe('guard > toString', () => {
  it('should work', () => {
    expect(toString(null)).toBe('null')
    expect(toString('')).toBe('')
    expect(toString(1)).toBe('1')
    expect(toString(true)).toBe('true')
    expect(toString([])).toBe('')
    expect(toString({})).toBe('[object Object]')
    expect(toString(undefined)).toBe('undefined')
    expect(toString(() => {})).toBe('() => {\n    }')
    expect(toString(Symbol(''))).toBe('Symbol()')
  })

  it('should work with an object that has toString', () => {
    const obj = { toString: () => 'test' }
    expect(toString(obj)).toBe('test')
  })

  it('should work with a class that has toString', () => {
    class Test {
      toString() {
        return 'test'
      }
    }
    expect(toString(new Test())).toBe('test')
  })
})
