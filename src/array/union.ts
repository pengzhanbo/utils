import { uniq, uniqBy } from './uniq'

/**
 * Union two arrays
 *
 * 两个数组的并集
 *
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param a - The first array to union. 第一个数组
 * @param b - The second array to union. 第二个数组
 * @returns A new array containing unique elements from both arrays. 包含两个数组中唯一元素的新数组
 *
 * @example
 * ```ts
 * union([1, 2, 3], [2, 4, 5, 6]) // => [1, 2, 3, 4, 5, 6]
 * union([1, 2], [3, 4]) // => [1, 2, 3, 4]
 * ```
 */
export function union<T>(a: readonly T[], b: readonly T[]): T[] {
  return uniq([...a, ...b])
}

/**
 * Union two arrays by predicate
 *
 * 两个数组的并集，根据 predicate 函数进行比较
 *
 * @category Array
 *
 * @param a - The first array to union / 第一个数组
 * @param b - The second array to union / 第二个数组
 * @param predicate - The function to use to transform each element for deduplication / 用于每个元素的 predicate 函数以进行去重
 * @returns The array with duplicates removed / 去重后的数组
 *
 * @example
 * ```ts
 * unionBy([1, 2, 3], [2, 4, 5, 6], (item) => item % 2) // => [1, 2]
 * unionBy([1, 2], [3, 4], (item) => item % 2) // => [1, 2]
 * ```
 */
export function unionBy<T, U>(a: readonly T[], b: readonly T[], predicate: (item: T) => U): T[] {
  return uniqBy([...a, ...b], predicate)
}
