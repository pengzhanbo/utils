import { describe, expect, it } from 'vitest'
import { deepFlatten } from './deep-flatten.js'

describe('array > deepFlatten', () => {
  it('should flatten deeply nested arrays', () => {
    const result = deepFlatten([1, [2, [3, [4]]]])
    expect(result).toEqual([1, 2, 3, 4])
  })

  it('should flatten heterogeneous nested values', () => {
    const result = deepFlatten(['a', [1, [true, [null]]]])
    expect(result).toEqual(['a', 1, true, null])
  })

  it('should return an empty array for empty input', () => {
    expect(deepFlatten([])).toEqual([])
  })

  it('should return a new array for already-flat input', () => {
    const input = [1, 2, 3]
    const result = deepFlatten(input)
    expect(result).toEqual([1, 2, 3])
    expect(result).not.toBe(input)
  })

  it('should handle empty nested arrays', () => {
    expect(deepFlatten([[], [[]], 1])).toEqual([1])
  })

  it('should treat holes in sparse arrays as undefined', () => {
    const inner: number[] = []
    inner[0] = 2
    inner[2] = 4
    const input: (number | number[])[] = []
    input[0] = 1
    input[2] = inner
    const result = deepFlatten(input)
    expect(result).toEqual([1, undefined, 2, undefined, 4])
    expect(0 in result).toBe(true)
  })

  it('should not mutate the input array', () => {
    const input = [1, [2, [3]], 4]
    deepFlatten(input)
    expect(input).toEqual([1, [2, [3]], 4])
  })

  it('should preserve object references', () => {
    const obj = { a: 1 }
    const result = deepFlatten([obj, [obj]])
    expect(result).toEqual([obj, obj])
    expect(result[0]).toBe(obj)
  })

  it('should accept readonly input', () => {
    const input = [1, [2]] as const
    const result = deepFlatten(input)
    expect(result).toEqual([1, 2])
  })

  // ===== Sparse holes / 稀疏数组空洞 =====
  it('should emit undefined for holes at every nesting level', () => {
    const inner: string[] = []
    inner[1] = 'b'
    const outer: (string | string[])[] = []
    outer[0] = 'a'
    outer[2] = inner

    const result = deepFlatten(outer)

    expect(result).toEqual(['a', undefined, undefined, 'b'])
    // holes are materialized as dense `undefined` entries
    expect(result).toHaveLength(4)
    expect(1 in result).toBe(true)
    expect(2 in result).toBe(true)
  })

  // ===== Deep nesting parity / 深层嵌套一致性 =====
  it('should match flat(Infinity) for 5-level nesting', () => {
    const input: unknown[] = [1, [2, ['a', [3, [4, [true]]]], []], null]
    expect(deepFlatten(input)).toEqual(input.flat(Infinity))
  })

  // ===== Large input / 大数组 =====
  it('should flatten 200000 elements without throwing RangeError', () => {
    const size = 200_000
    const inner = Array.from({ length: size }, (_, i) => i)
    const input = [0, inner]

    const result = deepFlatten(input)

    expect(result).toHaveLength(size + 1)
    expect(result[0]).toBe(0)
    expect(result[1]).toBe(0)
    expect(result[size]).toBe(size - 1)
  })

  // ===== Immutability / 不可变性 =====
  it('should not mutate deeply nested input', () => {
    const inner = [3]
    const middle = [2, inner]
    const input = [1, middle]

    const result = deepFlatten(input)

    // structural comparison
    expect(input).toEqual([1, [2, [3]]])
    // shallow reference comparison: nested containers stay untouched
    expect(input[1]).toBe(middle)
    expect(middle[1]).toBe(inner)
    expect(inner).toEqual([3])
    expect(result).not.toBe(input)
  })

  // ===== Mixed types / 混合类型 =====
  it('should flatten mixed types with empty nested arrays', () => {
    const obj = { id: 1 }
    const input: unknown[] = [1, 'a', [true, [obj, []], [], null], []]

    expect(deepFlatten(input)).toEqual([1, 'a', true, obj, null])
  })
})
