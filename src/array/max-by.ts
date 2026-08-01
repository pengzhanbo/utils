import { isUndefined } from '../predicate'

/**
 * Returns the first element of an array with the maximum value according to an iteratee function.
 *
 * The iteratee is invoked for each element, and the element with the largest
 * resulting value is returned. If multiple elements tie for the maximum, the
 * first one encountered is kept. If the array is empty, `undefined` is returned.
 *
 * 根据迭代函数返回数组中对应值最大的第一个元素。
 *
 * 对每个元素调用迭代函数，返回结果值最大的那个元素。若多个元素并列最大，则保留最先遇到的元素。若数组为空，返回 `undefined`。
 *
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param arr - The array to search. 要搜索的数组
 * @param iteratee - The function invoked per element, returning a number or string. 对每个元素调用的迭代函数，返回数字或字符串
 * @returns The element with the maximum value, or `undefined` if the array is empty. 值最大的元素，数组为空时返回 `undefined`
 *
 * @remarks
 * O(n) time complexity - single pass through the array
 *
 * O(n) 时间复杂度 - 单次遍历数组
 *
 * @example
 * ```ts
 * maxBy([{ n: 1 }, { n: 3 }, { n: 2 }], (u) => u.n)
 * // => { n: 3 }
 * ```
 *
 * @example
 * ```ts
 * maxBy(['pear', 'apple', 'banana'], (s) => s)
 * // => 'pear'
 * ```
 */
export function maxBy<T>(arr: readonly T[], iteratee: (item: T) => number | string): T | undefined {
  let max: T | undefined
  let maxValue: number | string | undefined

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]!
    const value = iteratee(item)
    if (isUndefined(maxValue) || (value as number) > (maxValue as number)) {
      maxValue = value
      max = item
    }
  }

  return max
}
