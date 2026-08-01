import { toTruthy } from '../guard'

/**
 * Removes falsy values from an array.
 *
 * Returns a new array containing only the truthy elements of the input array.
 * Falsy values are `false`, `0`, `0n`, `''`, `null`, `undefined`, and `NaN`.
 *
 * 过滤掉数组中的假值（falsy）元素。
 *
 * 返回一个新数组，仅包含输入数组中的真值元素。假值包括 `false`、`0`、`0n`、`''`、`null`、`undefined` 和 `NaN`。
 *
 * @category Array
 *
 * @typeParam T - The type of truthy elements in the array / 数组中真值元素的类型
 * @param arr - The array to compact. 要过滤的数组
 * @returns A new array with all falsy values removed. 移除所有假值后的新数组
 *
 * @remarks
 * O(n) time complexity - single pass through the array
 *
 * O(n) 时间复杂度 - 单次遍历数组
 *
 * @example
 * ```ts
 * compact([0, 1, '', null, undefined, NaN])
 * // => [1]
 * ```
 */
export function compact<T>(arr: readonly (T | Falsy)[]): T[] {
  return arr.filter(toTruthy) as T[]
}

type Falsy = false | 0 | 0n | '' | null | undefined
