import type { Arrayable } from '../types'
import { compareValues } from '../_internal/compare-values'
import { T_OBJECT } from '../_internal/tags'
import { isTypeof } from '../predicate'
import { toArray } from './to-array'

/**
 * Sorts an array of (objects | strings | numbers) based on the given `accords` and their corresponding order directions.
 *
 * - If you provide keys, it sorts the objects by the values of those keys.
 * - If you provide functions, it sorts based on the values returned by those functions.
 *
 * The function returns the array of (objects | strings | numbers) sorted in corresponding order directions.
 * If two objects have the same value for the current accordion, it uses the next accordion to determine their order.
 * If the number of orders is less than the number of accord, it uses the last order for the rest of the accord.
 *
 * 根据给定的`accords`及其对应的排序方向对 (对象 | 字符串 | 数字) 数组进行排序。
 *
 * - 如果提供键名，则按这些键对应的值对对象进行排序。
 * - 如果提供函数，则根据这些函数返回的值进行排序。
 *
 * 该函数返回按相应顺序方向排序的 (对象 | 字符串 | 数字) 数组。
 * 若两个 (对象 | 字符串 | 数字) 在当前排序依据上具有相同值，则使用下一个排序依据来确定它们的顺序。
 * 若排序依据的数量少于排序方向的数量，则剩余排序依据将沿用最后一个指定的排序方向。
 *
 * @category Array
 *
 * @example
 * ```ts
 * // Sort an array of objects by 'user' in ascending order and 'age' in descending order.
 * const users = [
 *   { user: 'fred', age: 48 },
 *   { user: 'barney', age: 34 },
 *   { user: 'fred', age: 40 },
 *   { user: 'barney', age: 36 },
 * ];
 *
 * const result = orderBy(users, [obj => obj.user, 'age'], ['asc', 'desc']);
 * // result will be:
 * // [
 * //   { user: 'barney', age: 36 },
 * //   { user: 'barney', age: 34 },
 * //   { user: 'fred', age: 48 },
 * //   { user: 'fred', age: 40 },
 * // ]
 * ```
 */
export function orderBy<T>(
  arr: readonly T[],
  accords: Arrayable<((item: T) => unknown) | (T extends object ? keyof T : never)>,
  orders: Arrayable<'asc' | 'desc'> = 'asc',
): T[] {
  if (arr.length === 0) return []

  accords = toArray(accords)
  orders = toArray(orders)
  return arr.slice().sort((a, b) => {
    const ol = orders.length

    for (let i = 0; i < accords.length; i++) {
      const order = ol > i ? orders[i] : orders[ol - 1]
      const accord = accords[i]!
      const isFunc = typeof accord === 'function'

      const valueA = isTypeof(a, T_OBJECT) ? (isFunc ? accord(a) : a[accord]) : a
      const valueB = isTypeof(b, T_OBJECT) ? (isFunc ? accord(b) : b[accord]) : b

      const result = compareValues(valueA, valueB, order!)

      if (result !== 0) {
        return result
      }
    }

    return 0
  })
}
