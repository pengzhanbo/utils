import type { Arrayable, Nullable } from './types'
import { isArray } from './is'

/**
 * Convert Arrayable<T> to Array<T>
 *
 * @category Array
 *
 * @example
 * ```ts
 * toArray(null) // => []
 * toArray(undefined) // => []
 * toArray([]) // => []
 * toArray(1) // => [1]
 * ```
 */
export function toArray<T>(v: Nullable<Arrayable<T>>): Array<T> {
  if (v === null || v === undefined)
    return []
  if (isArray(v))
    return v
  return [v]
}

/**
 * Unique array
 *
 * @category Array
 *
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
 *
 * @example
 * ```ts
 * uniqueBy([1, 1, 2, 2, 3, 3], (a, b) => a === b) // => [1, 2, 3]
 * ```
 */
export function uniqueBy<T>(
  array: T[],
  equalFn: (a: T, b: T) => boolean,
): T[] {
  return array.reduce((acc: T[], cur) => {
    const index = acc.findIndex(item => equalFn(cur, item))
    if (index === -1)
      acc.push(cur)
    return acc
  }, [])
}

/**
 * Remove value from array
 * @category Array
 *
 * @param array - the array
 * @param value - the value to remove
 * @returns if `true`, the value is removed, `false` otherwise
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3]
 * remove(arr, 2) // => true
 * console.log(arr) // => [1, 3]
 * remove(arr, 4) // => false
 * ```
 */
export function remove<T>(array: T[], value: T): boolean {
  if (!isArray(array))
    return false
  const index = array.indexOf(value)
  if (index !== -1) {
    array.splice(index, 1)
    return true
  }
  return false
}

/**
 * Generate a range array of numbers. The `stop` is exclusive.
 *
 * @category Array
 *
 * @param stop - the end of the range
 *
 * @example
 * ```ts
 * range(5) // => [0, 1, 2, 3, 4]
 * ```
 */
export function range(stop: number): number[]
/**
 * Generate a range array of numbers.
 *
 * @category Array
 *
 * @param start - the start of the range
 * @param stop - the end of the range
 * @param step - the step of the range
 *
 * @example
 * ```ts
 * range(5, 10) // => [5, 6, 7, 8, 9]
 * range(5, 10, 2) // => [5, 7, 9]
 * ```
 */
export function range(start: number, stop: number, step?: number): number[]
export function range(...args: any): number[] {
  let start, stop, step
  if (args.length === 1) {
    start = 0
    stop = args[0]
    step = 1
  }
  else {
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
 *
 * @category Array
 *
 * @param arr - the array
 * @param from - the index of the item to move
 * @param to - the index to move to
 */
export function move<T>(arr: T[], from: number, to: number): T[] {
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
 *
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
export function sortBy<T>(array: T[], cb: (item: T) => number): T[] {
  if (array.length === 0)
    return []
  return array.sort((a, b) => {
    const s1 = cb(a)
    const s2 = cb(b)
    return s1 > s2 ? 1 : s2 > s1 ? -1 : 0
  })
}

/**
 * Split array into chunks
 *
 * @category Array
 *
 * @param input - the array
 * @param size - the chunk size
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2) // => [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(input: T[], size = 1): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < input.length; i += size)
    chunks.push(input.slice(i, i + size))

  return chunks
}

/**
 * Union two arrays
 *
 * @category Array
 *
 * @example
 * ```ts
 * union([1, 2, 3], [2, 4, 5, 6]) // => [1, 2, 3, 4, 5, 6]
 * ```
 */
export function union<T>(a: T[], b: T[]): T[] {
  return [...new Set([...a, ...b])]
}
