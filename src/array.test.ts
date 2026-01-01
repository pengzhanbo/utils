import { describe, expect, it, vi } from 'vitest'
import {
  chunk,
  difference,
  differenceBy,
  filterAsync,
  intersection,
  limitAsync,
  mapAsync,
  move,
  range,
  remove,
  shuffle,
  sortBy,
  toArray,
  union,
  uniq,
  uniqueBy,
} from './array'
import { sleep } from './promise'

describe('array > toArray', () => {
  it.each([
    [undefined, []],
    [null, []],
    [[], []],
    [false, [false]],
    [0, [0]],
    ['', ['']],
    ['foo', ['foo']],
    [['foo'], ['foo']],
  ])('%s => %s', (input, expected) => {
    expect(toArray(input)).toEqual(expected)
  })
})

describe('array > uniq', () => {
  it.each([
    [[undefined, undefined], [undefined]],
    [[null, null], [null]],
    [
      [true, true, false, false],
      [true, false],
    ],
    [
      [1, 1, 2, 3, 3],
      [1, 2, 3],
    ],
    [['foo', 'foo'], ['foo']],
  ])('%s => %s', (input, expected) => {
    expect(uniq(input as any)).toEqual(expected)
  })
})

describe('array > uniqueBy', () => {
  const equalFn = (l: { a: number }, r: { a: number }) => l.a === r.a
  it.each([
    [[], []],
    [[{ a: 2 }, { a: 1 }, { a: 3 }], [{ a: 2 }, { a: 1 }, { a: 3 }]],
    [[{ a: 2 }, { a: 1 }, { a: 2 }], [{ a: 2 }, { a: 1 }]],
  ])('(%s => %s', (input, expected) => {
    expect(uniqueBy(input, equalFn)).toEqual(expected)
  })
})

describe('array > remove', () => {
  it.each([
    [null, 0, null, false],
    [[], 0, [], false],
    [[1, 2, 3], 0, [1, 2, 3], false],
    [[1, 2, 3], 1, [2, 3], true],
    [[1, 2, 3], 2, [1, 3], true],
  ])('%s, remove value: %s => %s, removed: %s', (input, value, expected, removed) => {
    expect(remove(input as unknown as number[], value)).toEqual(removed)
    expect(input).toEqual(expected)
  })
})

describe('array > range', () => {
  it.each([
    [[0], []],
    [[5], [0, 1, 2, 3, 4]],
    [[1, 5], [1, 2, 3, 4]],
    [[0, 8, 2], [0, 2, 4, 6]],
    [[0, 3, 0], [0, 1, 2]],
  ])('%s => %s', (input, expected) => {
    expect(range(...(input as [number, number, number]))).toEqual(expected)
  })
})

describe('array > move', () => {
  it.each([
    [null, 0, 0, null],
    [[], 0, 0, []],
    [[0], 0, 0, [0]],
    [[1, 2, 3], 0, 0, [1, 2, 3]],
    [[1, 2, 3], 1, 2, [1, 3, 2]],
    [[1, 2, 3], 2, 1, [1, 3, 2]],
    [[1, 2, 3], 3, 1, [1, undefined, 2, 3]],
  ])('%s, from: %s, to: %s => %s', (input, from, to, expected) => {
    expect(move(input as number[], from, to)).toEqual(expected)
  })
})

describe('array > shuffle', () => {
  it.each([
    [[]],
    [[1, 2]],
    [[1, 3, 5, 7, 9]],
  ])('%s', (input) => {
    expect(shuffle(input)).toHaveLength(input.length)
  })
})

describe('array > sortBy', () => {
  it.each([
    [[], (v: number) => v, []],
    [[3, 4, 2, 5], (v: number) => v, [2, 3, 4, 5]],
    [
      [
        { name: 'Mark', age: 20 },
        { name: 'John', age: 18 },
        { name: 'Jack', age: 21 },
        { name: 'Tom', age: 18 },
      ],
      (v: { name: string, age: number }) => v.age,
      [
        { name: 'John', age: 18 },
        { name: 'Tom', age: 18 },
        { name: 'Mark', age: 20 },
        { name: 'Jack', age: 21 },
      ],
    ],
  ])('%s', (input: unknown[], sortFn: (v: any) => number, expected) => {
    expect(sortBy(input, sortFn)).toEqual(expected)
  })
})

describe('array > chunk', () => {
  it.each([
    [[1, 2, 3, 4, 5], 2, [[1, 2], [3, 4], [5]]],
    [[1, 2, 3, 4, 5], 3, [[1, 2, 3], [4, 5]]],
    [[1, 2, 3, 4, 5], 1, [[1], [2], [3], [4], [5]]],
    [[1, 2, 3, 4, 5], undefined, [[1], [2], [3], [4], [5]]],
  ])('%s, size: %s => %s', (input, size, expected) => {
    expect(chunk(input, size)).toEqual(expected)
  })
})

describe('array > union', () => {
  it.each([
    [[], [], []],
    [[1, 2, 3], [], [1, 2, 3]],
    [[], [1, 2, 3], [1, 2, 3]],
    [[1, 2, 3], [1, 2, 3], [1, 2, 3]],
    [[1, 2, 3], [4, 5, 6], [1, 2, 3, 4, 5, 6]],
    [[1, 2, 3], [3, 4, 5], [1, 2, 3, 4, 5]],
  ])('%s, %s => %s', (a, b, expected) => {
    expect(union(a, b)).toEqual(expected)
  })
})

describe('array > intersection', () => {
  it.each([
    [[], [], []],
    [[1, 2, 3], [], []],
    [[], [1, 2, 3], []],
    [[1, 2, 3], [1, 2, 3], [1, 2, 3]],
    [[1, 2, 3], [4, 5, 6], []],
    [[1, 2, 3], [3, 4, 5], [3]],
  ])('%s, %s => %s', (a, b, expected) => {
    expect(intersection(a, b)).toEqual(expected)
  })
})

describe('array > difference', () => {
  it('should the difference of two arrays', () => {
    expect(difference([1, 2, 3], [1])).toEqual([2, 3])
    expect(difference([], [1, 2, 3])).toEqual([])
    expect(difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3])
  })
})

describe('array > differenceBy', () => {
  it('should the difference of two arrays using the `mapper` function', () => {
    expect(differenceBy([1.2, 2.3, 3.4], [1.2], Math.floor)).toEqual([2.3, 3.4])
    expect(differenceBy([], [1.2], Math.floor)).toEqual([])
  })

  it('should return the difference of two arrays with different element types using the `mapper` function', () => {
    interface CSV { id: number, csv: number }
    interface JSON { id: number, json: number }

    const array1: CSV[] = [
      { id: 1, csv: 1 },
      { id: 2, csv: 1 },
      { id: 3, csv: 1 },
    ]
    const array2: JSON[] = [
      { id: 2, json: 2 },
      { id: 4, json: 2 },
    ]

    const result = differenceBy(array1, array2, value => value.id)
    expect(result).toEqual([
      { id: 1, csv: 1 },
      { id: 3, csv: 1 },
    ])
  })
})

describe('array > filterAsync', () => {
  it('filters array asynchronously', async () => {
    const arr = [1, 2, 3, 4, 5]

    const predicate = vi.fn(async (n: number) => n % 2 === 0)
    const result = await filterAsync(arr, predicate)

    expect(result).toEqual([2, 4])

    expect(predicate).toHaveBeenCalledTimes(arr.length)
    expect(predicate.mock.calls[0]).toEqual([1, 0, arr])
    expect(predicate.mock.calls[1]).toEqual([2, 1, arr])
    expect(predicate.mock.calls[2]).toEqual([3, 2, arr])
  })

  it('returns empty array if given empty array', async () => {
    const arr: number[] = []
    const predicate = vi.fn(async () => true)

    const result = await filterAsync(arr, predicate)
    expect(result).toEqual([])

    expect(predicate).toHaveBeenCalledTimes(0)
  })

  it('returns empty array if all elements fail predicate', async () => {
    const arr = [1, 3, 5]
    const predicate = async (n: number) => n % 2 === 0

    const result = await filterAsync(arr, predicate)
    expect(result).toEqual([])
  })

  it('returns all elements if all pass predicate', async () => {
    const arr = [2, 4, 6]
    const predicate = async (n: number) => n % 2 === 0

    const result = await filterAsync(arr, predicate)
    expect(result).toEqual([2, 4, 6])
  })

  it('propagates rejection if any predicate throws', async () => {
    const arr = [1, 2, 3]
    const errorFn = async (item: number) => {
      if (item === 2) {
        throw new Error('fail')
      }
      return true
    }
    await expect(filterAsync(arr, errorFn)).rejects.toThrow('fail')
  })

  it('respects concurrency limit', async () => {
    const arr = [1, 2, 3, 4, 5]

    let running = 0
    let maxRunning = 0

    const fn = vi.fn(async (item: number) => {
      running++

      if (running > maxRunning) {
        maxRunning = running
      }

      await sleep(20)
      running--
      return item % 2 === 0
    })

    const concurrency = 2
    const result = await filterAsync(arr, fn, concurrency)

    expect(result).toEqual([2, 4])
    expect(maxRunning).toBeLessThanOrEqual(concurrency)
    expect(fn).toHaveBeenCalledTimes(arr.length)
  })

  it('uses full concurrency when not specified', async () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    let running = 0
    let maxRunning = 0

    const fn = async (item: number) => {
      running++
      if (running > maxRunning) {
        maxRunning = running
      }
      await sleep(20)
      running--
      return item % 2 === 0
    }

    await filterAsync(arr, fn)
    expect(maxRunning).toBe(10)
  })
})

describe('array >mapAsync', () => {
  it('maps array asynchronously', async () => {
    const arr = [1, 2, 3]

    const callback = vi.fn(async n => n * 2)
    const result = await mapAsync(arr, callback)

    expect(result).toEqual([2, 4, 6])

    expect(callback).toHaveBeenCalledTimes(arr.length)
    expect(callback.mock.calls[0]).toEqual([1, 0, arr])
    expect(callback.mock.calls[1]).toEqual([2, 1, arr])
    expect(callback.mock.calls[2]).toEqual([3, 2, arr])
  })

  it('returns empty array if given empty array', async () => {
    const arr: number[] = []
    const callback = vi.fn(async n => n * 2)

    const result = await mapAsync(arr, callback)
    expect(result).toEqual([])

    expect(callback).toHaveBeenCalledTimes(0)
  })

  it('propagates rejection if any callback throws', async () => {
    const arr = [1, 2, 3]
    const errorFn = async (item: number) => {
      if (item === 2) {
        throw new Error('fail')
      }
      return item
    }
    await expect(mapAsync(arr, errorFn)).rejects.toThrow('fail')
  })

  it('respects concurrency limit', async () => {
    const arr = [1, 2, 3, 4, 5]

    let running = 0
    let maxRunning = 0

    const fn = vi.fn(async (item: number) => {
      running++

      if (running > maxRunning) {
        maxRunning = running
      }

      await sleep(20)
      running--
      return item * 2
    })

    const concurrency = 2
    const result = await mapAsync(arr, fn, concurrency)

    expect(result).toEqual([2, 4, 6, 8, 10])
    expect(maxRunning).toBeLessThanOrEqual(concurrency)
    expect(fn).toHaveBeenCalledTimes(arr.length)
  })

  it('uses full concurrency when not specified', async () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    let running = 0
    let maxRunning = 0

    const fn = async (item: number) => {
      running++
      if (running > maxRunning) {
        maxRunning = running
      }
      await sleep(20)
      running--
      return item
    }

    await mapAsync(arr, fn)
    expect(maxRunning).toBe(10)
  })
})

describe('array > limitAsync', () => {
  it('limits concurrency of async callbacks', async () => {
    let running = 0
    let maxRunning = 0

    const callback = vi.fn(async () => {
      running++

      if (running > maxRunning) {
        maxRunning = running
      }
      await sleep(30)

      running--
    })

    const limitedCallback = limitAsync(callback, 2)

    await Promise.all([limitedCallback(), limitedCallback(), limitedCallback(), limitedCallback(), limitedCallback()])

    expect(maxRunning).toBeLessThanOrEqual(2)
    expect(callback).toHaveBeenCalledTimes(5)
  })

  it('returns correct values in correct order', async () => {
    const callback = vi.fn(async (item: number) => item)

    const limitedCallback = limitAsync(callback, 3)

    const results = await Promise.all([limitedCallback(3), limitedCallback(1), limitedCallback(4), limitedCallback(2)])

    expect(results).toEqual([3, 1, 4, 2])

    expect(callback).toBeCalledTimes(4)
    expect(callback.mock.calls[0]![0]).toBe(3)
    expect(callback.mock.calls[1]![0]).toBe(1)
    expect(callback.mock.calls[2]![0]).toBe(4)
    expect(callback.mock.calls[3]![0]).toBe(2)
  })

  it('propagates callback errors', async () => {
    const callback = vi.fn(async (item: number) => {
      if (item === 2) {
        throw new Error('fail')
      }
      return item
    })

    const limitedCallback = limitAsync(callback, 2)

    await expect(Promise.all([limitedCallback(1), limitedCallback(2), limitedCallback(3)])).rejects.toThrow('fail')
  })
})
