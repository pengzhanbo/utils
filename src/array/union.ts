import { uniq, uniqBy } from './uniq'

/**
 * Union two arrays
 *
 * 两个数组的并集
 *
 * @category Array
 *
 * @example
 * ```ts
 * union([1, 2, 3], [2, 4, 5, 6]) // => [1, 2, 3, 4, 5, 6]
 * union([1, 2], [3, 4]) // => []
 * ```
 */
export function union<T>(a: T[], b: T[]): T[] {
  return uniq([...a, ...b])
}

export function unionBy<T, U>(a: T[], b: T[], predicate: (item: T) => U): T[] {
  return uniqBy([...a, ...b], predicate)
}
