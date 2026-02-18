/**
 * Sum of an array of numbers
 *
 * 计算数组中所有数字的和
 *
 * @category Math
 *
 * @param numbers - The array of numbers to sum. 要求和的数字数组
 * @returns The sum of the numbers. 数组中所有数字的和
 *
 * @example
 * ```ts
 * sum([1, 2, 3, 4, 5]) // => 15
 * sum([1.5, 2.5, 3]) // => 7
 * sum([]) // => 0
 * ```
 */
export function sum(numbers: number[]): number {
  let result = 0

  for (let i = 0; i < numbers.length; i++) {
    result += numbers[i]!
  }

  return result
}
