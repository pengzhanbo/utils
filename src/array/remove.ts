import { isArray } from '../predicate'

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
 * @returns
 * if `true`, the value is removed, `false` otherwise.
 *
 * 如果成功移除,返回 `true`, 否则返回 `false`
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3]
 * remove(arr, 2) // => true
 * console.log(arr) // => [1, 3]
 * remove(arr, 4) // => false
 * ```
 * @remarks
 * This function mutates the original array in place. It uses `Array.prototype.splice` to remove the element.
 *
 * 此函数会直接修改原数组。它使用 `Array.prototype.splice` 移除元素。
 * @typeParam T - The type of elements in the array / 数组元素的类型
 */
export function remove<T>(array: T[], value: T): boolean {
  if (!isArray(array)) return false
  const index = array.findIndex((item) => Object.is(item, value))
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
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param array - the array / 数组
 * @param predicate - the predicate function / 谓词函数
 * @returns if `true`, the value is removed, `false` otherwise. / 如果成功移除,返回 `true`, 否则返回 `false`
 *
 * @remarks
 * This function mutates the original array in place. It uses `Array.prototype.splice` to remove the element.
 *
 * 此函数会直接修改原数组。它使用 `Array.prototype.splice` 移除元素。
 *
 * @see also {@link remove}
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
  if (!isArray(array)) return false
  const index = array.findIndex(predicate)
  if (index !== -1) {
    array.splice(index, 1)
    return true
  }
  return false
}
