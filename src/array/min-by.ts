import { isUndefined } from '../predicate/is-undefined.js'

/**
 * Returns the first element of an array with the minimum value according to an iteratee function.
 *
 * The iteratee is invoked for each element, and the element with the smallest
 * resulting value is returned. If multiple elements tie for the minimum, the
 * first one encountered is kept. If the array is empty, `undefined` is returned.
 *
 * 根据迭代函数返回数组中对应值最小的第一个元素。
 *
 * 对每个元素调用迭代函数，返回结果值最小的那个元素。若多个元素并列最小，则保留最先遇到的元素。若数组为空，返回 `undefined`。
 *
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param arr - The array to search. 要搜索的数组
 * @param iteratee - The function invoked per element, returning a number or string. 对每个元素调用的迭代函数，返回数字或字符串
 * @returns The element with the minimum value, or `undefined` if the array is empty. 值最小的元素，数组为空时返回 `undefined`
 *
 * @remarks
 * O(n) time complexity - single pass through the array
 *
 * O(n) 时间复杂度 - 单次遍历数组
 *
 * @example
 * ```ts
 * minBy([{ n: 1 }, { n: 3 }, { n: 2 }], (u) => u.n)
 * // => { n: 1 }
 * ```
 *
 * @example
 * ```ts
 * minBy(['pear', 'apple', 'banana'], (s) => s)
 * // => 'apple'
 * ```
 */
export function minBy<T>(arr: readonly T[], iteratee: (item: T) => number | string): T | undefined {
  let min: T | undefined
  let minValue: number | string | undefined

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]!
    const value = iteratee(item)
    if (isUndefined(minValue) || (value as number) < (minValue as number)) {
      minValue = value
      min = item
    }
  }

  return min
}
