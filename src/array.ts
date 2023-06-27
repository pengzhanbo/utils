import { isArray } from './is.js'
import type { Arrayable, Nullable } from './types.js'

/**
 * Convert Arrayable<T> to Array<T>
 * @category Array
 * @example
 * ```ts
 * toArray(null) // => []
 * toArray(undefined) // => []
 * toArray([]) // => []
 * toArray(1) // => [1]
 * ```
 */
export function toArray<T>(v: Nullable<Arrayable<T>>): Array<T> {
  if (v === null || v === undefined) return []
  if (isArray(v)) return v
  return [v]
}

/**
 * Unique array
 * @category Array
 * @example
 * ```ts
 * uniq([1, 1, 2, 2, 3, 3]) // => [1, 2, 3]
 * ```
 */
export function uniq<T>(v: T[]): T[] {
  return Array.from(new Set(v))
}

/**
 * Unique array by a custom equality function
 * @category Array
 */
export function uniqueBy<T>(
  array: T[],
  equalFn: (a: any, b: any) => boolean,
): T[] {
  return array.reduce((acc: T[], cur: any) => {
    const index = acc.findIndex((item: any) => equalFn(cur, item))
    if (index === -1) acc.push(cur)
    return acc
  }, [])
}

/**
 * Remove value from array
 * @category Array
 */
export function remove<T>(array: T[], value: T) {
  if (!isArray(array)) return false
  const index = array.indexOf(value)
  if (index !== -1) {
    array.splice(index, 1)
    return true
  }
  return false
}

/**
 * Generate a range array of numbers. The `stop` is exclusive.
 * @category Array
 * @example
 * ```ts
 * range(5) // => [0, 1, 2, 3, 4]
 * range(5, 10) // => [5, 6, 7, 8, 9]
 * range(5, 10, 2) // => [5, 7, 9]
 * ```
 */
export function range(stop: number): number[]
export function range(start: number, stop: number, step?: number): number[]
export function range(...args: any): number[] {
  let start, stop, step
  if (args.length === 1) {
    start = 0
    stop = args[0]
    step = 1
  } else {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;[start, stop, step = 1] = args
  }
  const arr: number[] = []
  let current = start
  while (current < stop) {
    arr.push(current)
    current += step || 1
  }

  return arr
}

/**
 * Move item in an array
 * @category Array
 */
export function move<T>(arr: T[], from: number, to: number) {
  arr.splice(to, 0, arr.splice(from, 1)[0])
  return arr
}

/**
 * Shuffle array
 * @category Array
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 * Sort array
 * @category Array
 * @example
 * ```ts
 * const arr = [
 *  { name: 'Mark', age: 20 },
 *  { name: 'John', age: 18 },
 *  { name: 'Jack', age: 21 },
 *  { name: 'Tom', age: 18 },
 * ]
 * sortBy(arr, (item) => item.age) // => [ { name: 'John', age: 18 }, { name: 'Tom', age: 18 }, { name: 'Mark', age: 20 }, { name: 'Jack', age: 21 } ]
 * ```
 */
export function sortBy<T>(array: T[], cb: (item: T) => number) {
  if (array.length === 0) return []
  return array.sort((a, b) => {
    const s1 = cb(a)
    const s2 = cb(b)
    return s1 > s2 ? 1 : s2 > s1 ? -1 : 0
  })
}

/**
 *
 * @category Array
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2) // => [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(input: T[], size = 1) {
  const chunks: T[][] = []
  for (let i = 0; i < input.length; i += size) {
    chunks.push(input.slice(i, i + size))
  }
  return chunks
}

/**
 * Union two arrays
 * @category Array
 * ```ts
 * union([1, 2, 3], [2, 4, 5, 6]) // => [1, 2, 3, 4, 5, 6]
 * ```
 */
export function union<T>(a: T[], b: T[]) {
  return [...new Set([...a, ...b])]
}
