import { isArray, isInteger } from '../predicate'

/**
 * Move item in an array, change the original array.
 *
 * 移动数组中的项，此方法会改变原数组。
 *
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param arr - the array / 数组
 * @param from - the index of the item to move. 要移动的项的索引
 * @param to - the index to move to. 要移动到的索引
 * @returns the array with the item moved. 返回移动后的数组
 *
 * @remarks
 * This function mutates the original array in place using `Array.prototype.splice`. It does not create a copy.
 *
 * 此函数会通过 `Array.prototype.splice` 直接修改原数组，不会创建副本。
 *
 * @example
 * ```ts
 * move([1, 2, 3], 0, 2) // => [3, 1, 2]
 * ```
 */
export function move<T>(arr: T[], from: number, to: number): T[] {
  if (!isArray(arr) || arr.length === 0) {
    return arr
  }
  if (!isInteger(from) || !isInteger(to)) throw new TypeError('from and to must be integers')

  const len = arr.length

  from = from < 0 ? Math.max(from + len, 0) : from
  to = to < 0 ? Math.max(to + len, 0) : to

  if (from >= len) from = len - 1
  if (to > len) to = len

  if (from === to) return arr

  arr.splice(to, 0, arr.splice(from, 1)[0]!)
  return arr
}
