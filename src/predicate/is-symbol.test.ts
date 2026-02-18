import { describe, expect, it } from 'vitest'
import { isSymbol } from './is-symbol'

describe('predicate > isSymbol', () => {
  it('should work', () => {
    expect(isSymbol(undefined)).toBe(false)
    expect(isSymbol(null)).toBe(false)
    expect(isSymbol(1)).toBe(false)
    expect(isSymbol('1')).toBe(false)
    expect(isSymbol(true)).toBe(false)
    expect(isSymbol(false)).toBe(false)
    expect(isSymbol({})).toBe(false)
    expect(isSymbol(() => {})).toBe(false)
    expect(isSymbol(Symbol(''))).toBe(true)
  })
})
