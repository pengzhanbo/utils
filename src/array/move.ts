import { isArray } from '../predicate'

/**
 * Move item in an array
 *
 * 移动数组中的项
 *
 * @category Array
 *
 * @param arr - the array
 * @param from - the index of the item to move. 要移动的项的索引
 * @param to - the index to move to. 要移动到的索引
 * @returns the array with the item moved. 返回移动后的数组
 * @example
 * ```ts
 * move([1, 2, 3], 0, 2) // => [3, 1, 2]
 * ```
 */
export function move<T>(arr: T[], from: number, to: number): T[] {
  if (!isArray(arr) || arr.length === 0) {
    return arr
  }
  arr.splice(to, 0, arr.splice(from, 1)[0]!)
  return arr
}
