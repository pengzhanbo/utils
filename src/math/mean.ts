import { sum } from './sum'

/**
 * Mean (average) of an array of numbers
 *
 * 计算数组中所有数字的平均值
 *
 * @category Math
 *
 * @param numbers - The array of numbers to calculate the mean. 要计算平均值的数字数组
 * @returns The mean of the numbers. 数组中所有数字的平均值
 *
 * @example
 * ```ts
 * mean([1, 2, 3, 4, 5]) // => 3
 * mean([1.5, 2.5, 3]) // => 2.333...
 * mean([]) // => NaN
 * ```
 */
export function mean(numbers: number[]): number {
  if (numbers.length === 0) {
    return Number.NaN
  }
  return sum(numbers) / numbers.length
}
