import type { Arrayable } from '../types/guard.js'
import { isFunction } from '../predicate/is-function.js'
import { toArray } from './to-array.js'

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
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param arr - The array of items to sort. 要排序的数组
 * @param accords - The sorting criteria: keys of T or functions that extract a sort key from each item. 排序依据：T 的键名或从每个元素提取排序键的函数
 * @param orders - The sort direction for each criterion. If fewer orders than accords, the last order is reused. Defaults to 'asc'. 每个排序依据的排序方向。若排序方向少于排序依据，则复用最后一个方向。默认 'asc'
 * @returns A new sorted array (the original array is not mutated). 排序后的新数组（原数组不变）
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
  if (arr.length <= 1) {
    return arr.length === 0 ? [] : [...arr]
  }

  const accordList = toArray(accords)
  const orderList = toArray(orders)
  const keyCount = accordList.length

  const ol = orderList.length
  const lastOrder = ol > 0 ? orderList[ol - 1]! : 'asc'

  const extractors: ((item: T) => unknown)[] = []
  const dirs: number[] = []
  for (let i = 0; i < keyCount; i++) {
    const accord = accordList[i]!
    if (isFunction(accord)) {
      extractors.push(accord)
    } else {
      const key = accord
      extractors.push((item: T) => item[key])
    }
    const order = i < ol ? orderList[i]! : lastOrder
    dirs.push(order === 'desc' ? -1 : 1)
  }

  const len = arr.length

  // Precompute the sort keys and the invalid flags for every accord, so that
  // the comparator only reads plain arrays instead of re-running the
  // extractors and the type checks on every comparison.
  const keys: unknown[][] = []
  const invalid: boolean[][] = []
  for (let j = 0; j < keyCount; j++) {
    const extractor = extractors[j]!
    const values: unknown[] = Array.from({ length: len })
    const flags: boolean[] = Array.from({ length: len })
    for (let i = 0; i < len; i++) {
      const value = extractor(arr[i]!)
      values[i] = value
      // NaN and undefined are always placed at the end.
      flags[i] = Number.isNaN(value) || value === undefined
    }
    keys.push(values)
    invalid.push(flags)
  }

  // Sort the indices (Schwartzian transform) to keep the same comparison
  // sequence and the same stable permutation as sorting the values directly.
  const indices: number[] = Array.from({ length: len })
  for (let i = 0; i < len; i++) {
    indices[i] = i
  }

  indices.sort((a, b): number => {
    for (let i = 0; i < keyCount; i++) {
      const flags = invalid[i]!
      const aIsInvalid = flags[a]!
      const bIsInvalid = flags[b]!
      if (aIsInvalid && bIsInvalid) {
        return 0
      }
      if (aIsInvalid) {
        return 1
      }
      if (bIsInvalid) {
        return -1
      }
      const values = keys[i]!
      const valueA = values[a]
      const valueB = values[b]
      if (valueA! < valueB!) {
        return -dirs[i]!
      }
      if (valueA! > valueB!) {
        return dirs[i]!
      }
    }
    return 0
  })

  const result: T[] = Array.from({ length: len })
  for (let i = 0; i < len; i++) {
    result[i] = arr[indices[i]!]!
  }

  return result
}
