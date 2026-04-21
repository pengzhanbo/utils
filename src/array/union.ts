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

/**
 * Union two arrays by predicate
 *
 * 两个数组的并集，根据 predicate 函数进行比较
 *
 * @category Array
 *
 * @param predicate - The function to use to transform each element / 用于每个元素的 predicate 函数
 * @param a - The first array to union / 第一个数组
 * @param b - The second array to union / 第二个数组
 * @returns The array with duplicates removed / 去重后的数组
 *
 * @example
 * ```ts
 * unionBy([1, 2, 3], [2, 4, 5, 6], (item) => item % 2) // => [1, 2, 3, 4, 5, 6]
 * unionBy([1, 2], [3, 4], (item) => item % 2) // => []
 * ```
 */
export function unionBy<T, U>(a: T[], b: T[], predicate: (item: T) => U): T[] {
  return uniqBy([...a, ...b], predicate)
}
