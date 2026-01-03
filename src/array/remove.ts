import { isArray } from '../is'

/**
 * Remove value from array
 *
 * 从数组中移除值
 *
 * also see {@link removeBy}
 *
 * @category Array
 *
 * @param array - the array
 * @param value - the value to remove - 待移除的值
 * @returns - if `true`, the value is removed, `false` otherwise.
 *          - 如果成功移除,返回 `true`, 否则返回 `false`
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
 * Remove value by predicate function from array
 *
 * 通过 predicate 方法，从数组中移除值
 *
 * also see {@link remove}
 *
 * @category Array
 *
 * @param array - the array
 * @param predicate - the predicate function
 * @returns - if `true`, the value is removed, `false` otherwise.
 *          - 如果成功移除,返回 `true`, 否则返回 `false`
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3]
 * removeBy(arr, n => n === 2) // => true
 * console.log(arr) // => [1, 3]
 * ```
 *
 * @example
 * ```ts
 * const arr = [
 *   { id: 1, csv: 1 },
 *   { id: 2, csv: 1 },
 *   { id: 3, csv: 1 },
 * ]
 * removeBy(arr, item => item.id === 2) // => true
 * console.log(arr) // => [{ id: 1, csv: 1 }, { id: 3, csv: 1 }]
 * ```
 */
export function removeBy<T>(
  array: T[],
  predicate: (item: T, index: number, array: readonly T[]) => boolean,
): boolean {
  if (!isArray(array))
    return false
  const index = array.findIndex(predicate)
  if (index !== -1) {
    array.splice(index, 1)
    return true
  }
  return false
}
