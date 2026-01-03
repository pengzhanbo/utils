import type { Arrayable } from '../types'
import { orderBy } from './order-by'

/**
 * Sorts an array of objects based on the given `accords`.
 *
 * - If you provide keys, it sorts the objects by the values of those keys.
 * - If you provide functions, it sorts based on the values returned by those functions.
 *
 * The function returns the array of objects sorted in ascending order.
 * If two objects have the same value for the current accordion, it uses the next accordion to determine their order.
 *
 * 根据给定的`accords`对对象数组进行排序。
 *
 * - 如果提供键名，则按这些键对应的值对对象进行排序。
 * - 如果提供函数，则根据这些函数返回的值进行排序。
 *
 * 该函数返回按升序排序的对象数组。
 * 若两个对象在当前排序依据上具有相同值，则使用下一个排序依据来确定它们的顺序。
 *
 * @category Array
 *
 * @example
 * ```ts
 * const users = [
 *  { user: 'foo', age: 24 },
 *  { user: 'bar', age: 7 },
 *  { user: 'foo', age: 8 },
 *  { user: 'bar', age: 29 },
 * ];
 *
 * sortBy(users, ['user', 'age']);
 * sortBy(users, [obj => obj.user, 'age']);
 * // results will be:
 * // [
 * //   { user : 'bar', age: 7 },
 * //   { user : 'bar', age: 29 },
 * //   { user : 'foo', age: 8 },
 * //   { user : 'foo', age: 24 },
 * // ]
 * ```
 */
export function sortBy<T extends object>(
  arr: readonly T[],
  accords: Arrayable<((item: T) => unknown) | keyof T>,
): T[] {
  return orderBy(arr, accords, 'asc')
}
